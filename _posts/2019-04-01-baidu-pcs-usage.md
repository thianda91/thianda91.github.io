---
layout:       article
title:        百度网盘使用技巧
key:          2019-04-01
tags:         baiduPan
categories:   notes
created_date: 2019-04-01 02:00:34
date:         2019-04-01 03:03:41
---

 百度网盘变得让我们又爱又恨，非会员限速，但又没有合适的免费替代品。本文记录一些使用百度网盘的技巧。

<!--more-->

## 背景

想要获得极致的服务，又不想充钱。

因为对于非土豪，或不常使用百度网盘的用户来说，充会员很不划算，现在甚至还出现了超级会员。

非会员的功能还算可以接受，毕竟能够上传下载，可以简单分享也就可以了。但是下载速度实在不敢恭维。几百 k 每秒，等起来真的很纠结。并且，稍微大一点的文件就需要使用客户端，至于客户端，emmm，占系统资源，弹广告等等。很不符合极客精神（就是不想用官方的客户端）。

## 解决方案1

[BaiduPCS-Go](https://github.com/iikira/BaiduPCS-Go)。这个软件很火。go 语言写的，跨平台，可在 linux 使用。直接到 Release 页面下载即可。

另有基于此的 [BaiduPCS-Go web 版](https://github.com/liuzhuoling2011/baidupcs-web)。

过度使用可能被封或限速，充钱开会员，或者等几天再用，可能会恢复。

在此记录一些有用的 issuse：

1. 错误代码 4，No permission。<https://github.com/iikira/BaiduPCS-Go/issues/387>
2. 或者 403 Forbidden, 重试 1/3。<https://github.com/iikira/BaiduPCS-Go/issues/460>



```bash
# BaiduPCS-Go 最新版（v3.5.6）appid
BaiduPCS-Go config set -appid=266719
# 巧借用百度输入法
cd /apps/baidu_shurufa
BaiduPCS-Go config set -appid=265486
```

获取有效的 appid：<https://gist.github.com/pcmid/5818b1165bc3f5f2088e19299278a613>

## 解决方案2

[bypy](https://github.com/houtianze/bypy)。一个 python 写的命令行。未使用，暂未研究。

## 其他解决方案

下列关键字请自行百度或直接上 github 搜索：

- pandownload，window 客户端。
- proxyee-down，一个 java 的 jar 包，跨平台。

- BaiduCdp，release 中仅有 window 客户端。

## 自己搭建百度网盘

详细请参考我的另一篇[文章](/notes/install-nextcloud.html)。