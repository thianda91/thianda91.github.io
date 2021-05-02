---
layout:       article
title:        linux 上使用 squid 搭建 web 代理
key:          2020-01-07
tags:         linux
categories:   system
created_date: 2020-01-07 11:22:20 +08:00:00
date:         2020-01-07 15:45:53 +08:00:00
---

简单的 web 代理。在 linux 上可以使用  squid。本文记录 squid 的配置。

让项目运行在一个独立的局部的 Python 环境中，使采用不同环境的项目互不干扰。

<!--more-->

参考链接：<https://www.cnblogs.com/bluestorm/p/9032086.html>

### 默认配置

squid 功能很强大，默认配置`/etc/squid/squid.conf`很长。去除注释掉的行，仅剩：

```ini
acl localnet src 0.0.0.1-0.255.255.255	# RFC 1122 "this" network (LAN)			
acl localnet src 10.0.0.0/8		# RFC 1918 local private network (LAN)		
acl localnet src 100.64.0.0/10		# RFC 6598 shared address space (CGN)		
acl localnet src 169.254.0.0/16 	# RFC 3927 link-local (directly plugged) machines			
acl localnet src 172.16.0.0/12		# RFC 1918 local private network (LAN)		
acl localnet src 192.168.0.0/16		# RFC 1918 local private network (LAN)		
acl localnet src fc00::/7       	# RFC 4193 local private network range			
acl localnet src fe80::/10      	# RFC 4291 link-local (directly plugged) machines			
acl SSL_ports port 443				
acl Safe_ports port 80		# http		
acl Safe_ports port 21		# ftp		
acl Safe_ports port 443		# https		
acl Safe_ports port 70		# gopher		
acl Safe_ports port 210		# wais		
acl Safe_ports port 1025-65535	# unregistered ports			
acl Safe_ports port 280		# http-mgmt		
acl Safe_ports port 488		# gss-http		
acl Safe_ports port 591		# filemaker		
acl Safe_ports port 777		# multiling http		
acl CONNECT method CONNECT				
http_access deny !Safe_ports				
http_access deny CONNECT !SSL_ports				
http_access allow localhost manager				
http_access deny manager				
include /etc/squid/conf.d/*				
http_access allow localhost				
http_access deny all				
coredump_dir /var/spool/squid				
refresh_pattern ^ftp:		1440	20%	10080
refresh_pattern ^gopher:	1440	0%	1440	
refresh_pattern -i (/cgi-bin/|\?) 0	0%	0		
refresh_pattern .		0	20%	4320
```

### 新增配置

其中有`include /etc/squid/conf.d/*	`

所以新增配置可在该文件夹添加新文件。如`/etc/squid/conf.d/xda.conf`

```ini
# 限制同一IP客户端的最大连接数
acl OverConnLimit maxconn 100
http_access deny OverConnLimit
# Safe_ports:允许安全更新的端口
# 邮箱服务
acl xSafe_ports port 993
acl xSafe_ports port 465
acl xSafe_ports port 143
acl xSafe_ports port 25
http_access deny !xSafe_ports
# 其他非标准 ssl
acl xSSL_ports port 3444
acl xSSL_ports port 63444
acl xSSL_ports port 4443
http_access deny CONNECT !xSSL_ports

visible_hostname xxx.xxx
cache_mgr xxx@xxx.com

# 以下是高匿的设置
request_header_access Via deny all
request_header_access X-Forwarded-For deny all
request_header_access From deny all
request_header_access Referer deny all
request_header_access User-Agent deny all
```

