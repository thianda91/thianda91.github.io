---
layout:       article
title:        自搭建内网穿透与文件同步
key:          2018-11-08
tags:         nat fileSync
categories:   notes
created_date: 2018-11-08 00:27:02
date:         2018-11-08 02:27:11
---

本文收集一些 可在私有云自搭建的 内网穿透工具和文件同步的工具。

<!--more-->

## 推荐使用

内网穿透自搭建 frp。

文件同步还没决定用哪个。。

## 内网穿透相关

### ngrok

<https://ngrok.com/>，国外，服务被墙。服务端闭源，可以自搭建。

国内基于ngrok的服务：[Sunny-Ngrok](https://www.ngrok.cc/)、[ittun--ngrok](https://www.ittun.com/)。

### ZeroTier

<https://www.zerotier.com>，内网穿透工具，无公网 ip 搭建虚拟网络。Android 仅可在 google play 下载。

### frp

完全开源，项目地址：<https://github.com/fatedier/frp>。基于 go，国人开发，资料多。

### PageKite

完全开源，项目地址：<https://github.com/pagekite/PyPagekite>。基于 python2.7。不推荐。

### netapp

<https://www.netapp.com/cn/index.aspx>，存储服务，需注册官网账号。

### net123

<http://www.nat123.com/>，端口映射/内网穿透，支持 80、443。分免费线路和 vip 线路。

### 内网通

<http://www.51nwt.com>，类似飞鸽的局域网聊天软件 + 文件共享 + 远程协助功能。



## 文件同步相关

### FreeFileSync

<https://freefilesync.org/>，文件备份前可进行对比二进制对比，显示变化的文件。

### 威力同步

<http://www.verysync.com/>。 一款高效的数据传输工具。简单易用的多平台文件同步软件，惊人的传输速度是不同于其他产品的最大优势， 微力同步 的智能 P2P 技术加速同步，会将文件分割成若干份仅 KB 的数据同步，而文件都会进行 AES 加密处理。

### Resilio

国外，收费，被墙。现有很多类 resilio 的服务。需要 IE11 支持

### Seafile

window 系统下， 服务端安装需要 python2.7。

### ownCloud 

服务端仅支持 linux。客户端支持全平台。

### NextCloud

<https://nextcloud.com>，B/S 架构，国外，有 docker image。基于php，项目地址：<https://github.com/nextcloud>

### Syncthing

<https://syncthing.net>，类似 Resilio 的 p2p 同步。WebUI，单文件运行绿色可移植。

  