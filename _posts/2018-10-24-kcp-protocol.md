---
layout:       article
title:        KCP 协议介绍
key:          2018-10-24
tags:         notes
categories:   notes
created_date: 2018-10-24 00:14:00
date:         2018-10-24 13:06:28
---

KCP 是一个快速可靠协议。它主要的设计目的是为了解决在网络拥堵的情况下 TCP 协议网络速度慢的问题，增大网络传输速率，但相当于 TCP 而言，会相应的牺牲一部分带宽。

<!-- more -->

KCP 没有规定下层传输协议，一般用 UDP 作为下层传输协议。KCP 层协议的数据包在 UDP 数据报文的基础上增加控制头。当用户数据很大，大于一个 UDP 包能承担的范围时（大于 MSS），KCP 会将用户数据分片存储在多个 KCP 包中。因此每个 KCP 包称为一个分片。

## 网络协议的基本概念

首先我们先复习一下网络协议的一些基本的概念，这对我们理解 KCP 有很大的帮助。

### 超时与重传

超时重传指的是，发送数据包在一定的时间内没有收到相应的 ACK，等待一定的时间，超时之后就认为这个数据包丢失，就会重新发送。这个等待时间被称为 RTO，即重传超时时间。

### 滑动窗口

TCP 通过确认机制来保证数据传输的可靠性。在早期的时候，发送数据方在发送数据之后会启动定时器，在一定时间内，如果没有收到发送数据包的 ACK 报文，就会重新发送数据，直到发送成功为止。但是这种停等的重传机制必须等待确认之后才能发送下一个包，传输速度比较慢。

为了提高传输速度，发送方不必在每发送一个包之后就进行等待确认，而是可以发送多个包出去，然后等待接收方一 一确认。但是接收方不可能同时处理无限多的数据，因此需要限制发送方往网络中发送的数据数量。接收方在未收到确认之前，发送方在只能发送 wnd 大小的数据，这个机制叫做滑动窗口机制。TCP 的每一端都可以收发数据。每个 TCP 活连接的两端都维护一个发送窗口和接收窗口结构。

KCP 结构体字段含义

snd_una：第一个未确认的包  
snd_nxt：下一个待分配的包的序号

KCP 通过以下方式提高速率：

（1）RTO。

TCP 的 RTO 是以 2 倍的方式来计算的。当丢包的次数多的时候，重传超时时间 RTO 就非常非常的大了，重传就非常的慢，效率低，性能差。而 KCP 的 RTO 可以以 1.5 倍的速度增长，相对于 TCP 来说，有更短的重传超时时间。

（2）快速重传机制——无延迟 ACK 回复模式

假如开启 KCP 的快速重传机制，并且设置了当重复的 ACK 个数大于 resend 时候，直接进行重传。 当发送端发送了 1,2,3,4,5 五个包，然后收到远端的 ACK：1,3,4,5。当收到 ACK3 时，KCP 知道 2 被跳过 1 次，当收到 ACK4 的时候，KCP 知道 2 被跳过 2 次，当次数大于等于设置的 resend 的值的时候，不用等到超时，可直接重传 2 号包。这就是 KCP 的快速重传机制。
下面是设置快速重传机制的源码：

```c
//nodelay:   0 不启用，1启用快速重传模式
//interval： 内部flush刷新时间
//resend:    0（默认）表示关闭。可以自己设置值，若设置为2（则2次ACK跨越将会直接重传）
//nc:        是否关闭拥塞控制，0（默认）代表不关闭，1代表关闭
int iKCP_nodelay(iKCPcb *KCP, int nodelay, int interval, int resend, int nc)
{
     if (nodelay >= 0)              //大于0表示启用快速重传模式
     {             
         KCP->nodelay = nodelay;
         if (nodelay) {
             KCP->rx_minrto = IKCP_RTO_NDL;  //最小重传超时时间（如果需要可以设置更小）
         } else{
             KCP->rx_minrto = IKCP_RTO_MIN;  
         }
     }
     if (interval >= 0) {
         if (interval > 5000) 
             interval = 5000;
         else if (interval < 10) 
             interval = 10;
         KCP->interval = interval;           //内部flush刷新时间
     }
     if (resend >= 0) {                     // ACK被跳过resend次数后直接重传该包, 而不等待超时
         KCP->fastresend = resend           // fastresend : 触发快速重传的重复ack个数
     }
     if (nc >= 0) {
         KCP->nocwnd = nc;
     }
     return 0;
}
```

（3）选择重传

KCP 采用滑动窗口机制来提高发送速度。由于 UDP 是不可靠的传输方式，会存在丢包和薄、包的乱序。而 KCP 是可靠的且保证数据有序的协议。为了保证包的顺序，接收方会维护一个接收窗口，接收窗口有一个起始序号 rcv_nxt（待接收消息序号）以及尾序号 rcv_nxt + rcv_wnd（接收窗口大小）。如果接收窗口收到序号为 rcv_nxt 的分片（刚好是接收端待接收的消息序号），那么 rcv_nxt 就加一，也就是滑动窗口右移，并把该数据放入接收队列供应用层取用。如果收到的数据在窗口范围内但不是 rcv_nxt ，那么就把数据保存起来，等收到 rcv_nxt 序号的分片时再一并放入接收队列供应用层取用。
当丢包发生的时候，假设第 n 个包丢失了，但是第 n+1,n+2 个包都已经传输成功了，此时只重传第n 个包，二部重传成功传输的 n+1,n+2 号包，这就是选择重传。为了能够做到选择重传，接收方需要告诉发送方哪些包它收到了。比如在返回的 ACK 中包含 rcv_nxt 和 sn，rcv_nxt 的含义是接收方已经成功按顺序接收了 rcv_nxt 序号之前的所有包，大于 rcv_nxt 的序号 sn 表示的是在接收窗口内的不连续的包。那么根据这两个参数就可以计算出哪些包没有收到了。发送方接收到接收方发过来的数据时，首先解析 rcv_nxt，把所有小于 rcv_nxt 序号的包从发送缓存队列中移除。然后再解析sn（大于 rcv_nxt），遍历发送缓存队列，找到所有序号小于 sn 的包，根据我们设置的快速重传的门限，对每个分片维护一个快速重传的计数，每收到一个 ack 解析 sn 后找到了一个分片，就把该分片的快速重传的计数加一，如果该计数达到了快速重传门限，那么就认为该分片已经丢失，可以触发快速重传，该门限值在 KCP 中可以设置。

（4）拥塞窗口

当网络状态不好的时候，KCP 会限制发送端发送的数据量，这就是拥塞控制。拥塞窗口（cwnd）会随着网络状态的变化而变化。这里采用了慢启动机制，慢启动也就是控制拥塞窗口从 0 开始增长，在每收到一个报文段确认后，把拥塞窗口加1，多增加一个 MSS 的数值。但是为了防止拥塞窗口过大引起网络阻塞，还需要设置一个慢机制的的门限（ssthresh 即拥塞窗口的阈值）。当拥塞窗口增长到阈值以后，就减慢增长速度，缓慢增长。

但是当网络很拥堵的情况下，导致发送数据出现重传时，这时说明网络中消息太多了，用户应该减少发送的数据，也就是拥塞窗口应该减小。怎么减小呢，在快速重传的情况下，有包丢失了但是有后续的包收到了，说明网络还是通的，这时采取拥塞窗口的退半避让,拥塞窗口减半，拥塞门限减半。减小网络流量，缓解拥堵。当出现超时重传的时候，说明网络很可能死掉了，因为超时重传会出现，原因是有包丢失了，并且该包之后的包也没有收到，这很有可能是网络死了，这时候，拥塞窗口直接变为 1，不再发送新的数据，直到丢失的包传输成功。

## KCP主要工作过程

把要发送的 buffer 分片成 KCP 的数据包格式，插入待发送队列中。

当用户的数据超过一个 MSS(最大分片大小)的时候，会对发送的数据进行分片处理。KCP 采用的是流的方式进行分片处理。通过 frg 进行排序区分，frg 即 message 中的 segment 分片 ID，在message 中的索引，由大到小，0 表示最后一个分片。比如 3,2,1,0。即把 message 分成了四个分片，分片的 ID 分别是 4,3,2,1。

分片方式共有两种：

消息方式。将用户数据分片，为每个分片设置 ID，将分片后的数据一个一个地存入发送队列，接收方通过 id 解析原来的包，消息方式一个分片的数据量可能不能达到 MSS 流方式。检测每个发送队列里的分片是否达到最大 MSS，如果没有达到就会用新的数据填充分片。

网络速度：流方式 > 消息方式

接收数据：流方式一个分片一个分片的的接收。消息方式 KCP 的接收函数会把自己原本属于一个数据的分片重组。

```c
int iKCP_send(iKCPcb *KCP, const char *buffer, int len)
{
     IKCPSEG *seg;
     int count, i;

    assert(KCP->mss > 0);
    if (len < 0) return -1;
    
    //根据len计算出需要多少个分片
    if (len <= (int)KCP->mss) 
        count = 1;
    else 
        count = (len + KCP->mss - 1) / KCP->mss;   
    
    if (count > 255) 
        return -2;
    
    if (count == 0) 
        count = 1;
    
    // fragment
    for (i = 0; i < count; i++) {
        int size = len > (int)KCP->mss ? (int)KCP->mss : len;   //获取当前分片的长度，存放到size中
        seg = iKCP_segment_new(KCP, size);      
        assert(seg);
        if (seg == NULL) {
            return -2;
        }
        if (buffer && len > 0) {
            memcpy(seg->data, buffer, size);
        }
        seg->len = size;
        seg->frg = count - i - 1;    //frg用来表示被分片的序号，从大到小递减
        iqueue_init(&seg->node);
        iqueue_add_tail(&seg->node, &KCP->snd_queue);   //把segment分片插入到发送队列中
        KCP->nsnd_que++;
        if (buffer) {
            buffer += size;
        }
        len -= size;
    }
    
    return 0;
}
```

将发送队列中的数据通过下层协议 UDP 进行发送

`void iKCP_flush(iKCPcb *KCP)`主要处理一下四种情况：

（1）发送 ack

```
// flush acknowledges
count = KCP->ackcount;
for (i = 0; i < count; i++) {
     size = (int)(ptr - buffer);
     if (size + IKCP_OVERHEAD > IKCP_OVERHEAD) {
         iKCP_output(KCP, buffer, size);
         ptr = buffer;
     }
     iKCP_ack_get(KCP, i, &seg.sn, &seg.ts);   //sn:message分片segment的序号,ts:message发送时刻的时间戳
     ptr = iKCP_encode_seg(ptr, &seg);
}

KCP->ackcount = 0;
```

（2）发送探测窗口消息

```c
// probe window size (if remote window size equals zero)
if (KCP->rmt_wnd == 0) {                                //远端接收窗口大小为0的时候
     if (KCP->probe_wait == 0) {                         //探查窗口需要等待的时间为0
         KCP->probe_wait = IKCP_PROBE_INIT;              //设置探查窗口需要等待的时间
         KCP->ts_probe = KCP->current + KCP->probe_wait; //设置下次探查窗口的时间戳 = 当前时间 + 探查窗口等待时间间隔
     }   
     else {
         if (_itimediff(KCP->current, KCP->ts_probe) >= 0) { //当前时间 > 下一次探查窗口的时间
             if (KCP->probe_wait < IKCP_PROBE_INIT) 
                 KCP->probe_wait = IKCP_PROBE_INIT;
             KCP->probe_wait += KCP->probe_wait / 2;   //等待时间变为之前的1.5倍
             if (KCP->probe_wait > IKCP_PROBE_LIMIT)
                 KCP->probe_wait = IKCP_PROBE_LIMIT;   //若超过上限，设置为上限值
             KCP->ts_probe = KCP->current + KCP->probe_wait;  //计算下次探查窗口的时间戳
             KCP->probe |= IKCP_ASK_SEND;         //设置探查变量。IKCP_ASK_TELL表示告知远端窗口大小。IKCP_ASK_SEND表示请求远端告知窗口大小
         }
     }
}   else {
     KCP->ts_probe = 0;
     KCP->probe_wait = 0;
}

// flush window probing commands。IKCP_ASK_SEND表示请求远端告知窗口大小
if (KCP->probe & IKCP_ASK_SEND) {
     seg.cmd = IKCP_CMD_WASK;
     size = (int)(ptr - buffer);
     if (size + IKCP_OVERHEAD > IKCP_OVERHEAD) {
         iKCP_output(KCP, buffer, size);     //KCP的下层输出协议，通过设置回调函数来实现
         ptr = buffer;
     }
     ptr = iKCP_encode_seg(ptr, &seg);
}

// flush window probing commands。IKCP_ASK_TELL表示告知远端窗口大小
if (KCP->probe & IKCP_ASK_TELL) {
     seg.cmd = IKCP_CMD_WINS;
     size = (int)(ptr - buffer);
     if (size + IKCP_OVERHEAD > IKCP_OVERHEAD) {
         iKCP_output(KCP, buffer, size);
         ptr = buffer;
     }
     ptr = iKCP_encode_seg(ptr, &seg);
}

// flash remain no data segments
size = (int)(ptr - buffer);
if (size > 0) {
     iKCP_output(KCP, buffer, size);
     ptr = buffer;
}

KCP->probe = 0;
```

（3）计算拥塞窗口大小

```c
// calculate window size
cwnd = _imin_(KCP->snd_wnd, KCP->rmt_wnd);    //cwnd = 发送窗口大小 和 远端接收窗口大小的最小值
if (KCP->nocwnd == 0)                         //不取消拥塞控制
     cwnd = _imin_(KCP->cwnd, cwnd);           //拥塞窗口 = 当前拥塞窗口和cwnd的最小值（也就是取当前拥塞窗口、发送窗口、接收窗口的最小值）
```

（4）将发送队列中的消息存入发送缓存队列(发送缓存队列就是发送窗口)

```c
while (_itimediff(KCP->snd_nxt, KCP->snd_una + cwnd) < 0) {
     IKCPSEG *newseg;
     if (iqueue_is_empty(&KCP->snd_queue)) 
         break;

    newseg = iqueue_entry(KCP->snd_queue.next, IKCPSEG, node);  //snd_queue：发送消息的队列
    
    iqueue_del(&newseg->node);                      //从发送消息队列中，删除节点
    iqueue_add_tail(&newseg->node, &KCP->snd_buf);  //然后把删除的节点，加入到KCP的发送缓存队列中
    KCP->nsnd_que--; 
    KCP->nsnd_buf++;
    
    newseg->conv = KCP->conv;     //会话id
    newseg->cmd = IKCP_CMD_PUSH;  //cmd：用来区分分片的作用。IKCP_CMD_PUSH:数据分片，IKCP_CMD_ACK:ack分片，IKCP_CMD_WASK：请求告知窗口大小，IKCP_CMD_WINS:告知窗口大小
    newseg->wnd = seg.wnd;  
    newseg->ts = current;           
    newseg->sn = KCP->snd_nxt++;  //下一个待发报的序号
    newseg->una = KCP->rcv_nxt;   //待收消息序号
    newseg->resendts = current;   //下次超时重传的时间戳
    newseg->rto = KCP->rx_rto;    //由ack接收延迟计算出来的重传超时时间
    newseg->fastack = 0;          //收到ack时计算的该分片被跳过的累计次数
    newseg->xmit = 0;             //发送分片的次数，每发送一次加一
}
```

（5）检查缓存队列中当前需要发送的数据(包括新传数据和重传数据)

```c
// flush data segments
for (p = KCP->snd_buf.next; p != &KCP->snd_buf; p = p->next) {
     IKCPSEG *segment = iqueue_entry(p, IKCPSEG, node);
     int needsend = 0;
     if (segment->xmit == 0) {
         needsend = 1;
         segment->xmit++;                //发送分片的次数
         segment->rto = KCP->rx_rto;     //该分片超时重传的时间戳
         segment->resendts = current + segment->rto + rtomini;  //下次超时重传的时间戳
     }
     else if (_itimediff(current, segment->resendts) >= 0) {   //当前时间>下次重传时间。说明没有重传，即丢包了？
         needsend = 1;
         segment->xmit++;
         KCP->xmit++;
         if (KCP->nodelay == 0) {        //0：表示不启动快速重传模式
             segment->rto += KCP->rx_rto;    //不启动快速重传模式，每次重传之后rto的时间就是之前的2倍
         }   else {
             segment->rto += KCP->rx_rto / 2;  //启用快速重传之后，rto变成原来的1.5倍
         }
         segment->resendts = current + segment->rto;
         lost = 1;
     }
     else if (segment->fastack >= resent) {     //fastack：表示收到ack计算的该分片被跳过的累积次数
         needsend = 1;
         segment->xmit++;
         segment->fastack = 0;
         segment->resendts = current + segment->rto;
         change++;
     }

    if (needsend) {
        int size, need;
        segment->ts = current;
        segment->wnd = seg.wnd;       //剩余接收窗口大小。即接收窗口大小-接收队列大小
        segment->una = KCP->rcv_nxt;  //待接收消息序号
    
        size = (int)(ptr - buffer);
        need = IKCP_OVERHEAD + segment->len;   //segment报文默认大小 + segment的长度
    
        // 禁止数据包合包
        if (size + need > IKCP_OVERHEAD) {
            iKCP_output(KCP, buffer, size, IKCP_RETRY_FLAG);
            ptr = buffer;
        }
    
        ptr = iKCP_encode_seg(ptr, segment);
    
        if (segment->len > 0) {
            memcpy(ptr, segment->data, segment->len);
            ptr += segment->len;
        }
    
        if (segment->xmit >= KCP->dead_link) {
            KCP->state = -1;
        }
    
        // 重试次数打日志
        if (segment->xmit > 1)
        {
            iKCP_log(KCP, 0x80000000, "xmit: %d, sn: %d, rto: %u", segment->xmit, segment->sn, segment->rto);
        }
    }
}

// flash remain segments
size = (int)(ptr - buffer);
if (size > 0) {
     iKCP_output(KCP, buffer, size, IKCP_RETRY_FLAG);
}
```

（6）根据重传数据更新发送窗口大小

（7）在发生快速重传的时候，会将慢启动阈值调整为当前发送窗口的一半，并把拥塞窗口大小调整为 KCP.ssthresh + resent，resent 是触发快速重传的丢包的次数，resent 的值代表的意思在被弄丢的包后面收到了 resent 个数的包的ack，也就是我们在 iKCP_nodelay 方法中设置的 resend 的值。这样调整后 KCP 就进入了拥塞控制状态。

```c
if (change) {
     IUINT32 inflight = KCP->snd_nxt - KCP->snd_una;   //下一个要分配的包 - 第一个未确认的包
     KCP->ssthresh = inflight / 2;                     //change=1说明发生过快速重传。当发生快速重传的时候，会将慢启动阈值调整为当前发送窗口的一半
     if (KCP->ssthresh < IKCP_THRESH_MIN)
         KCP->ssthresh = IKCP_THRESH_MIN;   
     KCP->cwnd = KCP->ssthresh + resent;   //并把拥塞窗口大小 = 拥塞窗口阈值 + 触发快速重传的ack大小
     KCP->incr = KCP->cwnd * KCP->mss;
}
```

（8）如果发生的超时重传，那么就重新进入慢启动状态。

```c
if (lost) {
     KCP->ssthresh = cwnd / 2;   //丢包了。窗口的大小需要减半
     if (KCP->ssthresh < IKCP_THRESH_MIN)
         KCP->ssthresh = IKCP_THRESH_MIN;
     KCP->cwnd = 1;
     KCP->incr = KCP->mss;
}
```

KCP 接收到下层协议 UDP 传进来的数据底层数据 buffer 转换成 KCP 的数据包格式

`int iKCP_input(iKCPcb *KCP, const char *data, long size)`

KCP 报文分为 ACK 报文、数据报文、探测窗口报文、响应窗口报文四种。
KCP 报文的 una 字段（snd_una：第一个未确认的包）表示对端希望接收的下一个 KCP 包序号，也就是说明接收端已经收到了所有小于 una 序号的 KCP 包。解析 una 字段后需要把发送缓冲区里面包序号小于 una 的包全部丢弃掉。

ack 报文则包含了对端收到的 KCP 包的序号，接到ack包后需要删除发送缓冲区中与 ack 包中的发送包序号（sn）相同的 KCP包。

```c
if (cmd == IKCP_CMD_ACK) {
     if ((_itimediff(KCP->current, ts) >= 0) && (_itimediff(sn, KCP->maxsn) >= 0)) {
         iKCP_update_ack(KCP, _itimediff(KCP->current, ts));
     }
#if 0
     {
         iKCP_log(KCP, 0x80000000, "[ACK]conv: %d, sn: %d, ts: %u, current: %u", KCP->conv, sn, ts, KCP->current);
     }
#endif
     iKCP_parse_ack(KCP, sn);
     iKCP_shrink_buf(KCP);
     if (iKCP_canlog(KCP, IKCP_LOG_IN_ACK)) {
         iKCP_log(KCP, IKCP_LOG_IN_DATA, 
             "input ack: sn=%lu rtt=%ld rto=%ld", sn, 
             (long)_itimediff(KCP->current, ts),
             (long)KCP->rx_rto);
     }
}

static void iKCP_parse_ack(iKCPcb *KCP, IUINT32 sn)
{
    struct IQUEUEHEAD *p, *next;

    if (_itimediff(sn, KCP->snd_una) < 0 || _itimediff(sn, KCP->snd_nxt) >= 0)
        return;
    
    for (p = KCP->snd_buf.next; p != &KCP->snd_buf; p = next) {
        IKCPSEG *seg = iqueue_entry(p, IKCPSEG, node);
        next = p->next;
        if (sn == seg->sn) {
            iqueue_del(p);
    
            KCP->sumxmit += seg->xmit;
            ++KCP->sumseg;
    
            iKCP_segment_delete(KCP, seg);
            KCP->nsnd_buf--;
            break;
        }
        else {
            // 序号为sn的被跳过了
            seg->fastack++;
        }
    }
}
```

收到数据报文时，需要判断数据报文是否在接收窗口内，如果是则保存 ack，如果数据报文的 sn 正好是待接收的第一个报文 rcv_nxt，那么就更新 rcv_nxt (加1)。如果配置了 ackNodelay 模式（无延迟 ack）或者远端窗口为 0（代表暂时不能发送用户数据），那么这里会立刻 fulsh（） 发送ack。

```c
else if (cmd == IKCP_CMD_PUSH) {    //数据报文
     if (iKCP_canlog(KCP, IKCP_LOG_IN_DATA)) {
         iKCP_log(KCP, IKCP_LOG_IN_DATA, 
             "input psh: sn=%lu ts=%lu", sn, ts);
     }
     if (_itimediff(sn, KCP->rcv_nxt + KCP->rcv_wnd) < 0) {
         iKCP_ack_push(KCP, sn, ts);     //sn:message分片segment的序号,ts:message发送时刻的时间戳
         if (_itimediff(sn, KCP->rcv_nxt) >= 0) {
             seg = iKCP_segment_new(KCP, len);
             seg->conv = conv;
             seg->cmd = cmd;
             seg->frg = frg;
             seg->wnd = wnd;
             seg->ts = ts;
             seg->sn = sn;
             seg->una = una;
             seg->len = len;

            if (len > 0) {
                memcpy(seg->data, data, len);
            }
    
            iKCP_parse_data(KCP, seg);
        }
    }
}
```

如果 snd_una 增加了那么就说明对端正常收到且回应了发送方发送缓冲区第一个待确认的包，此时需要更新 cwnd（拥塞窗口）

```c
if (_itimediff(KCP->snd_una, una) > 0) {     //如果第一个未确认的包的序号>待接收消息序号
     if (KCP->cwnd < KCP->rmt_wnd) {          //用拥塞口大小 < 远端接收窗口大小
        IUINT32 mss = KCP->mss;
         if (KCP->cwnd < KCP->ssthresh) {     //拥塞窗口大小 < 拥塞窗口阈值
             KCP->cwnd++;                     //拥塞窗口+1
              KCP->incr += mss;                //可发送最大数据量增加最大分片个大小
          }   else {
            if (_itimediff(KCP->snd_una, una) > 0) {
         if (KCP->cwnd < KCP->rmt_wnd) {
             IUINT32 mss = KCP->mss;
             if (KCP->cwnd < KCP->ssthresh) {
                 KCP->cwnd++;
                 KCP->incr += mss;
             }   else {
                 if (KCP->incr < mss) KCP->incr = mss;
                 KCP->incr += (mss * mss) / KCP->incr + (mss / 16);
                 if ((KCP->cwnd + 1) * mss <= KCP->incr) {
                     KCP->cwnd++;
                 }
             }
             if (KCP->cwnd > KCP->rmt_wnd) {
                 KCP->cwnd = KCP->rmt_wnd;
                 KCP->incr = KCP->rmt_wnd * mss;
             }
         }
     }

```

KCP 将接收到的 KCP 数据包还原成之前 KCP 发送的 buffer 数据

`int iKCP_recv(iKCPcb *KCP, char *buffer, int len)`

---------------------
版权声明：本文为转载：

> 作者：Dannii_  
> 来源：CSDN  
> 原文：<https://blog.csdn.net/qq_36748278/article/details/80171575>
