---
layout:       article
title:        linux 安全加固配置
key:          2019-05-24
tags:         security
categories:   notes
created_date: 2019-05-24 10:25:03
date:         2019-05-24 16:25:11
---

shi

记录 linux 系统安全加固方面的配置方法。均在 debian 上操作过。

<!--more-->

## 最小暴露原则

### 必须开放的端口

| 端口 | 服务 | 说明     |
| ---- | ---- | -------- |
| 22   | ssh  | 远程登录 |
|      |      |          |
|      |      |          |

### 必须开发的服务

| 服务   | 监听的端口 | 说明     |
| ------ | ---------- | -------- |
| frp    | 7000;888   | 内网穿透 |
| kcptun | 8110       | kcp 传输协议 |
| caddy  |            |          |



### 禁 ping

**临时**禁 ping 的 3 种方法（重启失效）：

```sh
iptables -A INPUT -p icmp --icmp-type 8 -s 0/0 -j DROP
echo 1 >> /proc/sys/net/ipv4/icmp_echo_ignore_all
sysctl -w net.ipv4.icmp_echo_ignore_all=1 
```

**永久**：在`/etc/sysctl.conf`文件中添加：

```
net.ipv4.icmp_echo_ignore_all = 1
```

然后执行 `sysctl -p`

### iptables

```sh
# 带行号显示
iptables -nL --line-number
```

### kcptun

```sh
# 服务端：
/usr/local/bin/kcptuns -t "127.0.0.1:8100" -l ":8110" -mode fast3 -nocomp -sockbuf 16777217 -dscp 46&

```

