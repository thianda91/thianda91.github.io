---
layout:       article
title:        mldonkey+aria2简介
key:          2019-03-08
tags:         mldonkey aria2
categories:   manual
created_date: 2019-03-08 17:52:43
date:         2019-03-09 15:14:54
---

磁力链接是个神奇的东西，能够链接到很多很多的资源。随着百度网盘被玩坏，百度网盘已割掉了离线下载中对磁力链接的支持。为了快速便捷的下载磁力链接不得不另寻它法。（无视迅雷）

<!--more-->

首先是我找到了 trackerslist ：

<https://github.com/ngosang/trackerslist>

据说它是用来解决下载 BitTorrent 无速度或速度慢的。

## Aria2

参考[这里](/notes/install-nextcloud.html#%E5%AE%89%E8%A3%85-aria2)。

## mldonkey

### 下载安装

直接 `apt install mldonkey `是不行的，因为它的软件包名称不是这样的。

搜索软件包：

```
apt search mldonkey
```

可以看到有 kmldonkey、mldonkey-gui、mldonkey-server 等。

执行安装

```sh
apt install mldonkey-server
```

会有对话框询问是否开机自动运行。可以选择`No`。省得占用资源。安装后会有提示信息，包含了安装位置等等。

安装后验证：

```sh
# 查看版本
mldonkey -v
# 我的当前是： MLDonkey 3.1.6 

# 启动: 3 种方式，推荐第一种
service mldonkey-server start
/etc/init.d/mldonkey-server start
mldonkey


```

### 使用 mldonkey

默认为 命令行操作，可访问 web UI：

```
http://127.0.0.1:4080
```



### 默认配置

下载文件保存路径：

```sh
/var/lib/mldonkey/incoming/files/
```

### 参考

<https://blog.csdn.net/crazw/article/details/8373423>