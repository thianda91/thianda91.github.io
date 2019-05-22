---
layout:       article
title:        亲手学Debian系统操作
key:          2018-07-30
tags:         Debian
categories:   notes
created_date: 2018-07-30 11:00:00
date:         2019-05-22 16:23:17
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
6. 初始学习直接使用 root 用户即可，在此建议安装完系统保存一份快照，快速恢复快照避免重装系统。

## 基本设置

### 查看系统基本信息

```sh
# 查看系统版本
cat /proc/version
uname -a
# 查看磁盘信息
fdisk -l
lsblk
df -h
mount | column -t
# 查看 CPU
lscpu
# 查看内存
free -h
# 查看指定目录使用情况
du -sh {目录}
# 启动时间
uptime -p
date -d "$(awk -F. '{print $1}' /proc/uptime) second ago" +"%Y-%m-%d %H:%M:%S"
cat /proc/uptime| awk -F. '{run_days=$1 / 86400;run_hour=($1 % 86400)/3600;run_minute=($1 % 3600)/60;run_second=$1 % 60;printf("系统已运行：%d天%d时%d分%d秒",run_days,run_hour,run_minute,run_second)}'
```

### 常用基本设置

```sh
# 添加配置
echo "alias ls='ls --color'" >>  ~/.bashrc
echo "alias ll='ls -l'" >>  ~/.bashrc
source ~/.bashrc
```

### 网络代理设置

安装时如果一直按照默认设置，VMware 会按照NAT分配网络，虚拟机则会按照 DHCP 设置好 ip 地址，我们可以使用命令查看网络情况：

```sh
ip address
```

>  新版 linux 系统不再支持`ifconfig`命令，取而代之的是`ip`

如果是网络环境需要配置代理，可以这样做：

```sh
echo 'export http_proxy=http://username:password@ip:port' >> ~/.bashrc
echo 'export https_proxy=http://username:password@ip:port' >> ~/.bashrc
source ~/.bashrc
```

其中的 username 和 password 可以省略。

路径中的`/`表示根目录，而默认的路径为`~`，表示用户根目录，即 `/home` 目录下对应用户名的目录。如 当前用户是 debi，`~`表示`/home/debi`。可执行`pwd`来查看当前所在的路径。

### 设置静态 ip

需要编辑 2 个文件

`/etc/network/interfaces`（配置 IP 和网关）

```sh
auto lo # 开机自动连接网络
iface lo inet loopback
auto ens3
# allow-hotplug ens33 # 配置了 auto 就注释掉本行
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

然后执行`ip address`查看ip是否生效。本人实际操作时未更新ip配置。执行`init 6`重启后成功。

双网卡等情况手动配置路由

```sh
# 查看路由
ip route
# 默认路由
ip route add default via {ip} 
# 添加静态路由
ip route add 10.0.0.0/8 via {gateway} dev ens{XX}
```

### 修改源

当设置了 Debian 可以连接互联网之后，可以先使用`apt-get update`更新一下。

~~更新过程可能过慢，我们需要设置更新源为国内的源，具体有哪些源可自行搜索。这里以 163 为例进行设置。~~

使用最小化（debian-9.x.0-amd64-netinst.iso）安装 debian 时，会提示选择软件源，直接选择中国的 163 即可。下面的操作就可以略过了。

先备份

```sh
mv /etc/apt/sources.list /etc/apt/sources.list.bak
```

然后编辑`/etc/apt/sources.list`，前面添加：

```
deb http://ftp.debian.org/debian/ stretch main non-free contrib
deb http://ftp.debian.org/debian/ stretch-updates main non-free contrib
deb http://ftp.debian.org/debian/ stretch-backports main non-free contrib
deb-src http://ftp.debian.org/debian/ stretch main non-free contrib
deb-src http://ftp.debian.org/debian/ stretch-updates main non-free contrib
deb-src http://ftp.debian.org/debian/ stretch-backports main contrib non-free
```

163：

```
deb http://mirrors.163.com/debian/  stretch main non-free contrib
deb http://mirrors.163.com/debian/  stretch-updates main non-free contrib
deb http://mirrors.163.com/debian/  stretch-backports main non-free contrib
deb-src http://mirrors.163.com/debian/  stretch main non-free contrib
deb-src http://mirrors.163.com/debian/  stretch-updates main non-free contrib
deb-src http://mirrors.163.com/debian/  stretch-backports main non-free contrib
deb http://mirrors.163.com/debian-security/  stretch/updates main non-free contrib
deb-src http://mirrors.163.com/debian-security/  stretch/updates main non-free contrib
```

或者先安装vim，安装时提示版本过高，我们需要卸载后重新安装：

```sh
apt-get remove vim-common
apt-get install vim
```

这时我们再执行`apt-get update`即可看见访问的源已经变了。

安装个工具感受一下：

```sh
apt-get remove openssh-client -y
apt-get install openssh-client -y
apt-get install openssh-server -y
```

以上命令逐条执行，为后面操作做准备。执行时会有提示输入`Y/n`进行确认。

### 修改账户密码

```sh
# 当前用户
passwd
```

### 安装最新版 openssh-server

升级 openssh-server 前，为防止远程连接不上，可先安装 telnet 服务端。

```sh
apt install telnetd
# 顺带会安装这些包： libevent-2.0-5 libfile-copy-recursive-perl openbsd-inetd update-inetd
```

安装最新版 openssh-server 需要手动下载并编译。

首先到[官网](http://www.openssh.com/)下载源码：http://www.openssh.com/portable.html#http

进入其中一个镜像站，比如：<https://cloudflare.cdn.openbsd.org/pub/OpenBSD/OpenSSH/portable/>，下载最新版的压缩文件。

```sh
wget https://cloudflare.cdn.openbsd.org/pub/OpenBSD/OpenSSH/portable/openssh-8.0p1.tar.gz
tar zxf openssh-8.0p1.tar.gz
# 备份 /etc/ssh
mv /etc/ssh /opt/ssh.bak
cd openssh-8.0p1
# 编译 (缺依赖就安装)
./configure --sysconfdir=/etc/ssh
# 没有报错继续执行
make && make install
```

安装**编译的依赖包**：

> 出现这种问题的话，该如何下手找到原因呢？比如说：你是按什么思路来发现需要安装zlib1g-dev
>
> 头文件和静态库一般包含在dev包里面
>
> 一般这种包就叫zlib-dev，zlib[version]-dev，libzlib-dev，libzlib[version]-dev

```sh
apt search zlib
apt install gcc
apt install zlib1g-dev
apt install libssl-dev
# RHEL： yum install openssl-devel
apt install --reinstall make
```

### 设置 ssh

在虚拟机操作命令行的 Debian 很不方便。

- 不能复制粘贴
- 终端只能显示一屏的内容，没有滚动条

上述情况可能通过设置可以解决，但这里我们要设置ssh，让我们可以远程登录。

生成公钥秘钥：

```sh
ssh-keygen -t rsa
```

默认会保存在`~/.ssh/`一个`id_rsa`和一个`id_rsa.pub`。

下面看一下 ssh 服务器的配置文件：

``` sh
cat /etc/ssh/sshd_config
```

按需将配置修改即可。

```ini
PermitRootLogin yes
PrintLastLog yes
##################
Protocol 2
Port 22
IdentityFile ~/.ssh/id_rsa
PasswordAuthentication yes
RSAAuthentication yes
```

默认情况下 root 用户无法远程登录，需要在上面的配置文件中设置`PermitRootLogin yes`。也可以在安装系统时设置额外的用户进行远程登录。登录后可使用`su`命令切换到 root 。

卸载 telnetd：

```sh
service inetd stop
apt remove telnetd -y
apt autoremove
```



### 设置时区

```sh
echo "export TZ='Asia/Shanghai'"  >> /etc/profile
source /etc/profile
date -R
date
# 或者
tzselect
# 或者
dpkg-reconfigure tzdata
```

### 挂载硬盘

```sh
# 查看
fdisk -l
# 创建新硬盘
fdisk /dev/sdb
# p 命令显示硬盘的分区表信息
# n 添加新分区

# (1) n 添加新分区
# (2) e extended 添加扩展分区 number 1
# (3) First cylinder (1-13054, default 1)(第一个柱面,默认就行,直接会回车)
# (4) Last cylinder, +cylinders or +size{K,M,G} (1-13054, default 13054)(最后一个柱面,默认就行,直接会回车)
# (5) p 查看分区
# (6) w 把分区信息写入新硬盘的分区表

# 格式化
mkfs -t ext4 /dev/sdb1
# 挂载
mount /dev/sdb1 /usr
# 开机自动挂载
echo '/dev/sdb1 /usr ext4 defaults 0 0' >> /etc/fstab
```

## 工具安装

### 关闭 ipv6

使用 /proc

```sh
# 关闭所有接口的 IPv6 功能
echo "1" > /proc/sys/net/ipv6/conf/all/disable_ipv6

# 关闭指定网卡的 IPv6 功能
echo "1" > /proc/sys/net/ipv6/conf/ethx/disable_ipv6
```

### 网络相关

```sh
 # ifconfig、netstat
 apt-get install net-tools
 # nslookup、dig
 apt-get install dnsutils
 # traceroute
 apt-get install traceroute
 # manual 手册
 apt-get install man
```

### 小内存增加 SWAP

```sh
dd if=/dev/zero of=/home/swap bs=1024 count=1024000 # 生成SWAP空间文件1G(bs*count)
/sbin/mkswap /home/swap # 创建SWAP分区
/sbin/swapon /home/swap # 激活SWAP分区
echo '/home/swap swap swap defaults 0 0' >> /etc/fstab # 重启后可以自动挂载
```

### ~~解决中文乱码~~

```sh
apt-get install locales
dpkg-reconfigure locales
```

勾选 `en_US.UTF-8`、`zh_CN.UTF-8`。

检查当前的 locale ：`locale`或`locale -a`

正确配置下会显示：LANG =zh_CN.UTF-8

> debian 9 通常不会有此问题，若显示乱码可能是 ssh 客户端没有设置 UFT-8，需要修改客户端设置。

### 防火墙设置

默认已安装了`iptables`，需要了解如何配置。

