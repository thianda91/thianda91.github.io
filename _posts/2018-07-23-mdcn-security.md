---
layout:       post
title:        DCN安全培训
key:          2018-07-23
tags:         MDCN
categories:   notes
date:         2018-07-23 10:24:27
modify_date:  2018-07-24 17:01:03
---

主要内容： 

1. 安全威胁和ACL
2. 局域网防御

<!-- more -->

## 网络攻击类型

### 极少情报

- 侦测
- 访问攻击
- Dos & DDos

### 更多情报

- 蠕虫病毒
- 特洛伊木马
- 应用层攻击
- 威胁管理协议

### 侦查攻击

- 数据包嗅探
- 端口扫描
- ping扫描
- 网络信息查询

抓包工具：Wireshark、Packet sniffer

### 侦查侦查的缓解

- 数据认证
- 数据加密
- 反嗅探工具
- 交换基础设施

## 访问攻击

访问攻击的目的

- 检索数据
- 活的访问权
- 提升访问权限

具体包括：

- Password attacks 密码攻击

- Trust exploitation 信任利用

- Port redirection 端口重定向

- Man-in-the-middle attacks 中间人攻击

- Buffer overflow 缓冲区溢出

攻击方式：

- Brute-force attacks 暴力破解

- Trojan horse programs 特洛伊木马

- IP spoofing IP地址欺骗

- Packet sniffers 数据包嗅探

### 密码攻击的缓解

- 不允许用户在多个系统使用同一个密码
- 设置登录次数限制，超出后锁定
- 不使用明文密码
- 使用强密码

## 信任利用

常见的信任模式：

| 系统    | 类型                     |
| ------- | ------------------------ |
| windows | Domain、Active Directory |
| Linux   | NIS、NIS+                |

### 信任利用的缓解

- 划分网络安全区域（DMZ）

- 端口重定向

## 中间人攻击

- 网络数据包嗅探
- 路由和传输协议

解决办法就是使用加密传输

## Dos攻击

破坏你的计算机系统或拒绝你和他人访问你的网络

DDos：许多分布源同时执行攻击

DOS和DDOS都可以使用IP欺骗

特征

- 不为获取信息
- 只需要很少的资源
- 难以消除，但可以减少伤害

### Dos攻击的缓解

- 使用反欺骗（Anti-spoof）工具
- 使用反Dos（Anti-Dos）工具
- ISP级别限速

## IP欺骗

黑客模仿可信任计算机攻击，使用外部或内部的可信IP。

- 将恶意数据或命令注入现有数据中
- 改变路由表将可信用户的数据包转发给黑客

IP地址只是更大规模攻击的一环。

### IP欺骗的环节

- Access control configuration访问控制
- Encryption加密
- RFC 3704 filtering过滤
- 不使用基于IP地址的身份验证

例如：Cryptographic 密钥，–Strong, two-factor, one-time passwords 强密码，两步验证或一次性密码

## 蠕虫、病毒、木马攻击的缓解

- 使用防病毒软件
- 及时了解最新的攻击方式
- 随时更新防病毒软件版本和病毒库
- 安装使用HOST-IPS (e.g., CSA)
- 预防、隔离、处理

## 应用层攻击的缓解

- 读取系统和应用程序的日志文件，分析攻击
- 订阅公告的漏洞邮件
- 更新补丁，修复系统和应用程序
- 使用IDS或IPS扫描已知的攻击

## 管理协议和漏洞

ssh、telnet、SNMP、Syslog、TFTP、NTP

推荐使用ssh、ssl加密技术，使用ACL限制管理IP，使用 out of band 带外数据

## 判断漏洞和威胁

使用工具来辅助发现漏洞与威胁

- PortScanner
- Microsoft Baseline Security Analyzer
- Nmap
- Kali

## ACL访问控制列表

### 为什么使用ACL

- 过滤数据
- 分类数据

ACL的作用：permit允许或deny拒绝packets经过路由器

| ACL类型  | 数字范围           | place close to |
| -------- | ------------------ | -------------- |
| standard | 1-99，1300-1999    | destination    |
| extended | 100-199，2000-2699 | source         |

```sh
Router(config)# access-list <number> <源地址> <通配符>
Router(config-if)# ip access-group <number> <in|out>
```

### 通配符

32位的二进制数组成，每8位一组，每2组之间用`.`分割开。然后将四组二进制分别转换成十进制表示，也被称为点分十进制表示。

在二进制格式中，`0`表示精确匹配，`1`表示任意数值。

```
172.30.16.0  0.0.15.255
```

### ACL配置准则

- 标准或扩展指示每一个接口只能过滤一个ACL
- 每个接口，每个协议允许，每个方向只允许匹配一条ACL
- ACL语句按顺序匹配，因此，最常用的语句位于列表的顶部
- 最后的ACL测试总是隐式否定所有其他状态。因此，每个列表需要至少一个许可
- ACL需要在全局模式下创建，然后应用到入站或出站的业务接口
- ACL可以过滤通过路由器的流量，或者根据路由器的使用情况来访问路由器和来自路由器的流量
- 标准的ACL放在靠近目的端，扩展的ACL放在靠近源端

```markdown
### ACL Configuration Guidelines

- Standard or extended indicates what can be filtered.

- Only one ACL per interface, per protocol, and per direction is allowed.

- The order of ACL statements controls testing, therefore, the most specific statements go at the top of the list.

- The last ACL test is always an implicit deny everything else statement, so every list needs at least one permit statement.

- ACLs are created globally and then applied to interfaces for inbound or outbound traffic.

- An ACL can filter traffic going through the router, or traffic to and from the router, depending on how it is applied.

- When placing ACLs in the network:
	- Place extended ACLs close to the source
	- Place standard ACLs close to the destination

```

```sh
标准访问列表
access-list access-list-number <permit|deny|remark> source [mask]
Router(config)# interface ethernet 0/0
Router(config-if)# ip access-group 1 out

扩展访问列表
access-list <number> <permit|deny> <协议名称> <源地址> <通配符> [<操作符> <端口号>] <目的地址> <通配符> [<操作符> <端口号>]]
Router(config)# int e0
Router(config-if)# ip access-group <in|out>
```

### 操作符

| 操作符 | 含义 |
| ------ | ---- |
| eq     | =    |
| neq    | <>   |
| gt     | >    |
| lt     | <    |
| range  | []   |

协议名称不是tcp或udp，后面就不能加`[<操作符> <端口号>]`。

##  MAC地址攻击

### MAC地址泛洪攻击

交换机在收到未知mac地址的数据帧时，会从除接收接口之外的其他所有激活接口中发送出去。

### 端口安全性

绑定交换机接口以及计算机的mac地址

```sh
SwitchX(config-if)#switchport port-security [  mac-address mac-address | mac-address sticky [mac-address] | maximum value | violation {restrict | shutdown}] 

SwitchX(config)#interface fa0/5
SwitchX(config-if)#switchport mode access
SwitchX(config-if)#switchport port-security
SwitchX(config-if)#switchport port-security maximum <number>
SwitchX(config-if)#switchport port-security mac-address <HHHH.HHHH.HHHH|sticky>
SwitchX(config-if)#switchport port-security violation shutdown
```

**switchport port-security maximum 最大值** 132

**switchport port-security violation 选项**

shutdown：关闭处理，自动生成SNMP告警日志

protect：保护处理，自动过滤违规数据，不生成告警日志

restrict：限制处理，自动过滤违规数据，同时生成告警日志

配置出错后的自动恢复周期

```sh
SwitchX(config)# errdisable recovery cause psecure-violation
SwitchX(config)# errdisable recovery interval <seconds>
```

查看端口安全性

```sh
SwitchX# show port-security
SwitchX# show port-security address
```

## DHCP欺骗

可发起中间人攻击。

设置dhcp监听（`dhcp snooping`）来防范

```sh
# 开启监听
SwitchX(config)# ip dhcp snooping
# 绑定vlan
SwitchX(config)# ip dhcp snooping vlan 10,20
# 关闭dhcp的option82
SwitchX(config)# no ip dhcp snooping information option
# 设置授信接口
SwitchX(config-if)# ip dhcp snooping trust
# 限制下联口的速率
SwitchX(config-if)# ip dhcp limit rate 50
# 验证
SwitchX# show ip dhcp snooping
```

## ARP欺骗

设置动态ARP检测（`DAI`），是基于`dhcp snooping`的，需先设置dhcp监听。

```sh
# 绑定vlan
SwitchX(confi)# ip arp inspection vlan 10,20
# 设置授信接口
SwitchX(config-if)# ip arp inspection trust
```

## IP欺骗

设置 IP源地址保护`IP source guard`

```sh
# 基于 dhcp snooping，DAI，port-security
SwitchX(config-if)# ip verify source port-security
# 未配置以上3个设置，手动绑定
SwitchX(config-if)# ip verify source
SwitchX(config-if)# ip source binding 00E0.1E85.0431 vlan 1 10.0.0.2 int Fa0/2
```

