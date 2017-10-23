---
layout: post
title: windows系统git服务器自己搭建（gitblit or gogs）
key: 2017-09-26
categories: ppt
tags: git
modify_date: 
---


### 写在前面
git是当前最先进的分布式版本控制系统。本文主要记录 在windows系统搭建git服务的过程。使用 Gitblit 如何配置 and 使用Gogs如何配置。

git教程推荐： [廖雪峰的Git教程](https://www.liaoxuefeng.com/wiki/0013739516305929606dd18361248578c67b8067c8c017b000)

### 使用Gitblit 
Gitblit 运行需要JRE [Java Runtime Environment](https://www.java.com/zh_CN/download/manual.jsp)

Gitblit 下载：http://www.gitblit.com/ 或者 https://gitblit.github.io/gitblit/

下载后解压，比如解压到：D:\gitblit\，根目录里有几个目录和几个cmd文件

<!--more-->

| 目录/脚本              | 功能                                      |
| ------------------ | --------------------------------------- |
| /data              | gitblit的配置文件，默认的repository存储位置/data/git |
| gitblit.cmd        | 运行gitblit                               |
| gitblit-stop.cmd   | 停止gitblit                               |
| installService.cmd | 安装为window服务（运行前需编辑配置）                   |
配置文件为 `/data/gitblit.properties`
里面仅有一行`include = defaults.properties`
打开 defaults.properties ，里面是它的默认配置。
笔者重点关注了以下几个参数
```php
 git.repositoriesFolder = ${baseFolder}/git	
#git库的存储位置 默认值表示/data/git
 git.daemonPort = 9418
#git协议的默认git端口号，即使用git://YOUR_URL.git访问时访问的端口号
 git.sshPort = 29418
#git协议的默认ssh端口号，即使用ssh://YOUR_URL.git访问时访问的端口号
 git.acceptedPushTransports = HTTP HTTPS SSH
#可使用的传输协议，默认支持HTTP,HTTPS,SSH，还有另外一种为GIT 
 server.httpPort = 60020
#HTTP协议端口，默认为0，表示禁用此协议，为了安全性起见可禁用此协议
 server.httpsPort = 8443
#HTTPS协议端口 默认8443
 server.httpBindInterface =
#设定服务器的IP地址。访问http协议用
 server.httpBindInterface = localhost
#设定服务器的IP地址。访问https用
 server.certificateAlias = localhost
#证书别名，该别名是一主机名，使用该别名后只能通过该主机名进行访问Web页面
 server.storePassword = gitblit
#服务端KeyStore密码，该密码在生成服务器证书时需要使用
```
按照实际需求配置上面的参数，把它们写在`gitblit.properties`后面即可。

设置gitblit为Windows Service
在Gitblit目录下，找到`installService.cmd`文件。用“记事本”打开。修改ARCH，32位系统：SET ARCH=x86；64位系统：SET ARCH=amd64。添加CD为程序目录 SET CD=D:\Git\Gitblit-1.6.0(你的实际目录)。修改StartParams里的启动参数，给空就可以了。
```
SET ARCH=amd64
SET CD=D:\Gitblit
...
...
...
	--StartParams="" ^
```
然后以管理员身份运行`installService.cmd`，即可在windows服务里看见名为 gitblit的服务。并且在gitblit根目录下多出个/logs文件夹。

启动服务后就可以访问了，浏览器访问：http://localhost:60020，登录用户、密码均为admin。

之后的操作和GitHUB差不多，页面很友好。

git客户端可以选择[git for windows](https://git-for-windows.github.io/)，想用GUI界面，可以选择[Git Extensions](http://gitextensions.github.io/)或者[TortoiseGit](https://tortoisegit.org/)
推荐使用git for windows。

第一次使用 设置一下自己的用户名和email地址
在git bath中安装提示操作即可：
```
*** Please tell me who you are.

Run

  git config --global user.email "you@example.com"
  git config --global user.name "Your Name"

to set your account's default identity.
Omit --global to set the identity only in this repository.
```
然后设置服务器提交地址
```
git remote add origin ssh://admin@localhost:29418/dangjian.git
```
剩下的按照git教程操作即可。

gitblit docs
在/docs里存放的是gitblit的离线帮助文档，找到index.html即可查看。
从如何配置gitblit到如何使用。有英文基础的都可看懂。
> ps基本写完了，剩下的官方文档都有介绍。

### 使用Gogs

未完待续...

