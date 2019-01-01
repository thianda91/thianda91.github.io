---
layout:       article
title:        协同办公可自托管的应用收集
key:          2018-12-30
tags:         vps
categories:   notes
created_date: 2018-12-30 01:01:11
date:         2019-01-01 17:15:59
---

小型团队需要协同办公。不想使用第三方服务，希望成本最低，希望把数据掌握在自己手中（自托管）。

本文收集了一些适合的应用或软件，自己可以搭建。

<!--more-->

## 使用需求

通常，需求的使用场景如下：

1. 多人编辑同一个文件、在线编辑
2. 文件版本控制
3. 文件共享、在线预览
4. 工作流
5. 待办提醒、任务提醒
6. 即时通信、留言/便签

需求的优先级由高到低，以此来寻找合适的软件/应用。

## 参考信息

收集资料时参考了如下信息：

<http://www.jcodecraeer.com/plus/view.php?aid=8174>

<http://next.36kr.com/posts/collections/21>

<https://github.com/3xxx>，<https://blog.csdn.net/hotqin888/>



## 应用收集

下面介绍几款已存在的协同办公的应用/软件。排名不分先后。

### OPMS



### Feng Office



### kodexplorer



### ONLYOFFICE document server



### Collabora online





## 安装 Collabora online

安装 doeker，可参考[这里](../notes/vps-init.html#安装-docker)。

docker 安装完毕，再进行下一步：

拉去 collabora 镜像

```sh
docker pull collabora/code
# 此过程较慢
```

请将 cloud\.orgleaf\.com 替换为自己的域名（即用于访问 Nextcloud 的域名），注意主机名后面有一个"/"。

```sh
docker run -t -d -p 127.0.0.1:9980:9980 -e 'domain=cloud\\.orgleaf\\.com' --restart always --cap-add MKNOD collabora/code
```

如果要让这个 Collabora Office 同时服务于多个域名的话，需要在两个不同域名之间加上\|，例如：

```sh
'domain=cloud\\.nextcloud\\.com\|second\\.nexcloud\\.com'
```



### 