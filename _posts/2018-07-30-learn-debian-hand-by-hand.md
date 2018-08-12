---
layout:       article
title:        亲手学Debian系统操作
key:          2018-07-30
tags:         Debian
categories:   notes
date:         2018-07-30 11:00:00
modify_date:  2018-07-31 01:55:18
---

参照本文操作 Debian 需要有些英语基础，以及`linux`的基础。在不熟悉的情况下要会在每个步骤仔细阅读给出的提示（英文），按照提示即可完成。

<!--more-->

## 安装 Debian

初学 `Debian`，当然是用 VMware 安装。

1. 首先在官网下载最新的 ios 镜像：https://www.debian.org/distrib/ 。下载一个小型安装映像，文件几百兆大小，很快就能下载好。
2. 使用 VMware 安装时，选择典型配置，选择光盘映像文件为刚下载的 iso 文件。自动识别为 Debian 系统。确认好各项硬件配置即可启动虚拟机安装。
3. 虚拟机开机后按照提示安装即可，语言推荐选 English，防止使用过程中因翻译内容影响理解原本含义。
4. 大部分设置使用默认即可，但某些步骤需要你更换选项才能继续，我想这是确保一下用户真的阅读了此步骤的说明文字。
5. 安装时会要求设置 root 账户密码，以及新建一个额外的账户，完毕后会自动重启。
6. 初始学习直接使用root用户即可，在此建议安装完系统保存一份快照，快速恢复快照避免重装系统。

## 基本设置

### 网络代理设置

安装时如果一直按照默认设置，VMware 会按照NAT分配网络，虚拟机则会按照 DHCP 设置好 ip 地址，我们可以使用命令查看网络情况：

```sh
ip address
```

>  新版 linux 系统不再支持`ifconfig`命令，取而代之的是`ip`

如果是网络环境需要配置代理，可以这样做：

```sh
echo 'expoer http_proxy=http://username:password@ip:port' >> ~/.bashrc
source ~/.bashrc
```

其中的 username 和 password 可以省略。

路径中的`/`表示根目录，而默认的路径为`~`，表示用户根目录，即 `/home` 目录下对应用户名的目录。如 当前用户是 debi，`~`表示`/home/debi`。可执行`pwd`来查看当前所在的路径。

### 设置静态ip

需要编辑2个文件

`/etc/network/interfaces`（配置IP和网关）

```sh
auto lo # 开机自动连接网络
iface lo inet loopback
allow-hotplug ens33
iface ens33 inet static # static表示使用固定ip，dhcp表述使用动态ip
address 10.1.1.10 # 设置ip地址
netmask 255.255.255.0 # 设置子网掩码
gateway 10.1.1.1 # 设置网关
```

`/etc/resolv.conf`（配置DNS服务器）

```sh
nameserver 1.2.4.8
```

每个DNS一行。如果是由`dhcp`改成的 `static`，可能会保留 DHCP 获取来的 DNS。

最后重启网络

```sh
service networking restart
```

然后执行`ip add`查看ip是否生效。本人实际操作时未更新ip配置。执行`init 6`重启后成功。

### 更换源

当设置了 Debian 可以连接互联网之后，可以先使用`apt-get update`更新一下。更新过程可能过慢，我们需要设置更新源为国内的源，具体有哪些源可自行搜索。这里以163为例进行设置。

首先做个备份：

```
mv /etc/apt/sources.list /etc/apt/sources.list.bak
```

然后可在`/etc/apt/sources.list`添加如下内容：

```sh
# 在文件最前面，添加以下条目
deb http://mirrors.163.com/debian/ jessie main non-free contrib
deb http://mirrors.163.com/debian/ jessie-updates main non-free contrib
deb http://mirrors.163.com/debian/ jessie-backports main non-free contrib
deb-src http://mirrors.163.com/debian/ jessie main non-free contrib
deb-src http://mirrors.163.com/debian/ jessie-updates main non-free contrib
deb-src http://mirrors.163.com/debian/ jessie-backports main non-free contrib
deb http://mirrors.163.com/debian-security/ jessie/updates main non-free contrib
deb-src http://mirrors.163.com/debian-security/ jessie/updates main non-free contrib
```

由于最小化安装，只能使用`vi`命令进行文本编辑，但`vi`很不适合新手使用，于是可变通一下：

```sh
echo 'deb http://mirrors.163.com/debian/ jessie main non-free contrib' >> /etc/apt/sources.list
```

使用`echo`命令以及`>>`将文本追加到文件末尾。可逐行将上述信息填入`/etc/apt/sources.list`。

或者先安装vim，安装时提示版本过高，我们需要卸载后重新安装：

```sh
apt-get remove vim-common
apt-get install vim
```

这时我们再执行`apt-get update`即可看见访问的源已经变了。

安装个工具感受一下：

```sh
apt-get remove openssh-client
apt-get install openssh-client
apt-get install openssh-server
```

以上命令逐条执行，为后面操作做准备。执行时会有提示输入`Y/n`进行确认。

### 设置ssh

在虚拟机操作命令行的 Debian 很不方便。

- 不能复制粘贴
- 终端只能显示一屏的内容，没有滚动条

上述情况可能通过设置可以解决，但这里我们要设置ssh，让我们可以远程登录。

生成公钥秘钥：

```sh
ssh-keygen -d
```

默认会保存在`~/.ssh/`一个`id_rsa`和一个`id_rsa.pub`。

下面看一下 ssh 的配置文件：

``` sh
cat /etc/ssh/ssh_config
```

按需将配置修改即可。

```
Protocol 2
Port 22
IdentityFile ~/.ssh/id_rsa
PasswordAuthentication yes
RSAAuthentication yes
```

默认情况下 root 用户无法远程登录，需要在上面的配置文件中设置`PermitRootLogin yes`，但是实测无效。于是不在研究，而是使用安装系统时设置的额外的用户远程登录。登录后可使用`su`命令切换到 root 。

### 防火墙设置

默认已安装了`iptables`，需要了解如何配置。