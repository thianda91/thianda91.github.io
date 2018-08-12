---
layout: article
title: 路由器的ACL与NAT地址转换
key: 2017-12-06
tags: acl NAT&PAT
categories: mdcn
date: 2017-12-06 10:07:37
modify_date: 2017-12-06 16:47:56
---

### ACL访问控制列表的应用

- 过滤
- 分类处理
- 出口控制（一般不可以在入口控制）

### ACL类型

- 标准ACL
  > 检测源地址

- 扩展ACL 
  > 检测源地址和目的地址

- 动态ACL
- 反射ACL
- 基于时间的ACL

### ACL的ip通配符匹配

转换成二进制，`IP 通配符`

> 0：精确匹配
> 1：任意匹配

比如：

```ini
# 匹配10.1.1.0/24的奇数IP
10.1.1.1 0.0.0.254

# 匹配 10.1.3.0、10.1.5.0、10.1.7.0
10.1.3.0 0.0.6.0
# 转成二进制：3->011、5->101、7->111 
# 精确匹配用0，任意匹配用1。-> 0.0.00000110.0

# 匹配10.1.1.0/24的前40位IP（.1--.40）
10.1.1.0 0.0.0.31
10.1.1.32 0.0.0.7
10.1.1.40 0.0.0.0
```

### Cisco设备 ACL配置

#### 协议

> tcp
> udp
> ip

#### 操作符

> ep 等于
> neq 不等于
> gt 大于
> lt 小于
> range [ ]

#### 标准ACL

```shell
access-list <num> <permit|deny> <**协议名称**> <源地址> <通配符> [**操作符 端口号**] <目的地址> <通配符> [**操作符 端口号**]
#
RouterX(config)# access-list 101 deny tcp 172.16.4.0 0.0.0.255 172.16.3.0 0.0.0.255 eq 21
RouterX(config)# access-list 101 deny tcp 172.16.4.0 0.0.0.255 172.16.3.0 0.0.0.255 eq 20
RouterX(config)# access-list 101 permit ip any any

RouterX(config)# interface Ethernet 0
RouterX(config-if)# ip access-group 101 out
```

#### 扩展ACL

在靠近源端设备配置

### 规划网络之地址转换

> NAT：Network Address Translation
>
> PAT：Port Address Translation

#### 配置NAT静态转译

```ini
#全局配置下
RouterX(config)# ip nat inside source static local-ip global-ip
#连接内网接口：
RouterX(config-if)# ip nat inside
#连接外网接口：
RouterX(config-if)# ip nat ouside

#查看
RouterX# show ip nat translations
```

#### 配置NAT动态转译

```ini
# 1. 配置地址池
RouterX(config)# ip nat pool name start-ip end-ip {netmask x.x.x.x | prefix-length xx}

# 2. 创建标准ACL
RouterX(config)# access-list access-list-number permit source [source-wildcard] 

# 3. 引用ACL配置动态NET转译地址池
RouterX(config)# ip nat inside source list access-list-number pool name 

# 4. 查看
RouterX# show ip nat translations
```

#### 配置PAT动态转译

```ini
# 1. 创建标准ACL
RouterX(config)# access-list <access-list-number> permit <source> <source-wildcard>

# 2. 引用ACL配置动态转译接口
RouterX(config)# ip nat inside source list <access-list-number> interface <interface> overload

# 3. 查看
RouterX# show ip nat translations

```

#### 清除NET转译表

```ini
RouterX# clear ip nat translation
RouterX# clear ip nat translation inside global-ip local-ip [outside local-ip global-ip]
RouterX# clear ip nat translation outside local-ip global-ip
RouterX# clear ip nat translation protocol inside global-ip global-port local-ip local-port [outside local-ip local-port global-ip global-port] 

```

