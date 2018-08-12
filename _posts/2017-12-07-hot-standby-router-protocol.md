---
layout: article
title: 热备份路由器协议（HSRP概述）
key: 2017-12-07
tags: HSRP
categories: mdcn
date: 2017-12-07 09:02:37
modify_date: 2017-12-07 16:56:30
---

## HSRP

热备份路由器协议（Hot Standby Router Protocol）

> cisco的私有协议。实现在第三层的高可用。

### 配置

RouterA

```shell
switch(config)# interface vlan10
switch(config-if)# ip address 10.1.10.2 255.255.255.0
switch(config-if)# standby 10 10.1.10.1
```

RouterB

```shell
switch(config)# interface vlan10
switch(config-if)# ip address 10.1.10.3 255.255.255.0
switch(config-if)# standby 10 10.1.10.1
```

### HSRP状态

| 状态      |      | 定义                                       |
| ------- | ---- | ---------------------------------------- |
| initial | 初始   | 初始状态，改变配置或端口刚启动时的状态                      |
| learn   | 学习   | 不知道虚拟IP，未看到活跃路由器发`hello`。等待活跃路由器发`hello`。 |
| listen  | 监听   | 路由器获取了虚拟IP，监听来自其他路由器`hello`报文            |
| speak   | 对话   | 周期的发送`hello`报文并积极的协商活跃路由或备用路由            |
| standby | 备份   | 时刻作为下一个活跃路由器的候选人，并周期发送`hello`报文          |
| active  | 活动   | 转发报文并发送给虚拟MAC地址，并周期发送`hello`报文           |

### 其他配置

```shell
> HSRP优先级设置
switch(config-if)# standby 10 priority <0-255>

> 抢占模式开启
switch(config-if)# standby 10 preempt

> HSRP的认证
switch(config-if)# standby 10 authentication xyz123

> 设置hello报文间隔与hold间隔（通常后者至少是前者的3倍），默认单位是秒，msec表示毫秒
switch(config-if)# standby 10 timer msec 200 msec 750

> 设置抢夺最小延迟时间（秒）
switch(config-if)# standby preempt delay minimum 300

> 查看standby状态
switch(config-if)# show standby brief
```

