---
layout:       article
title:        虚拟机管理+创建软路由
key:          2020-08-05
tags:         pve	
categories:   notes
created_date: 2020-08-05 10:25:59 +08:00:00
date:         2020-08-25 08:55:09 +08:00:00
---

本文记录一些主机云化、虚拟主机自主搭建的相关知识及教程。

<!--more-->

说到虚拟机，或者云主机，可能首先想到 vmware，其实还有好多。这里列举一些比较有名的：

个人版

- VMware Workstation
- Oracle VM VirtualBox
- Hyper-V（Windows 10 +自带）

服务器版

- vSphere ESXi（bare-metal hypervisor，虚拟机管理程序 ）

- Citrix XenDesktop

- Hyper-V Server

- **Proxmox** **V**irtual **E**nvironment（**PVE**），

  > complete open-source platform for enterprise virtualization

本文主要记录 **PVE** 的一些基本信息

## Proxmox 简介

Proxmox 官网：https://www.proxmox.com。它本质上是 Debian 系统，相比于 EXSi 的优点是可识别大多数的网卡。

### 使用

安装时设置登录密码（即 root 的密码），设置好 IP 地址，即可通过 web 访问控制：

```
https://ip:8006
```

注意是`https`。默认开启了 ssh，可通过 ssh 访问。

### 设置更新源

Proxmox 源自于 Debian，所以 Proxmox 也可以用 apt 的包管理。但是 Proxmox 维护了一套自己的软件源，如果没有订阅企业授权，在 apt update 的时候会报错。所以需要注释掉企业的 source list:

```ini
vi /etc/apt/sources.list.d/pve-enterprise.list
然后用 # 注释掉其中的地址
# deb https://enterprise.proxmox.com/debian/pve buster pve-enterprise
```

然后添加非订阅的源，修改 `vi /etc/apt/sources.list`: [1](http://einverne.github.io/post/2020/03/proxmox-install-and-setup.html#fn:non)

```ini
# PVE pve-no-subscription repository provided by proxmox.com,
# NOT recommended for production use
deb http://download.proxmox.com/debian/pve buster pve-no-subscription
```

国内的 Proxmox 镜像：

```ini
deb https://mirrors.tuna.tsinghua.edu.cn/proxmox/debian buster pve-no-subscription
```

设置 Debian 国内镜像

Proxmox 基于 Debian 的软件源都可以替换成国内的镜像：

```ini
deb https://mirrors.tuna.tsinghua.edu.cn/debian/ buster main contrib non-free
# deb-src https://mirrors.tuna.tsinghua.edu.cn/debian/ buster main contrib non-free
deb https://mirrors.tuna.tsinghua.edu.cn/debian/ buster-updates main contrib non-free
# deb-src https://mirrors.tuna.tsinghua.edu.cn/debian/ buster-updates main contrib non-free
deb https://mirrors.tuna.tsinghua.edu.cn/debian/ buster-backports main contrib non-free
# deb-src https://mirrors.tuna.tsinghua.edu.cn/debian/ buster-backports main contrib non-free
deb https://mirrors.tuna.tsinghua.edu.cn/debian-security buster/updates main contrib non-free
# deb-src https://mirrors.tuna.tsinghua.edu.cn/debian-security buster/updates main contrib non-free
```

然后更新 `apt update`，然后升级 `apt upgrade`

### 移除 “没有有效订阅”的弹窗提升

修改文件：`/usr/share/javascript/proxmox-widget-toolkit/proxmoxlib.js`

找到

```javascript
if (data.status !== 'Active') {
```

一行，修改为：

```js
if (false) {
```

刷新网页即可。

### 虚拟机迁移

新建虚拟机直接在web 操作即可。若将 VMWare 或 ESXi 的虚拟机迁移到 Proxmox，有 2 种方法：

#### 方法1：OVF 导入

 使用 VMWare  Workstation，在 【文件】——【导出为 ovf】（使用 esxi 也是类似的方法）。如果导出的是ova，解压就行，ova 是 ovf + vmdk + mf 文件的压缩包，。

通过 ssh 的 sftp 服务上传至 pve。

导入虚拟机命令：

```sh
qm importovf <vm id> <**.ovf>  <storage pool> -format <disk-fs>
# vmid 就是虚拟的ID
# ovf 就是ovf文件
# storage pool 就是PVE面板里vm储存池的名称（例local-lvm）。你想把虚拟机储存在那个位置,就填哪个
# <disk-fs>就是虚拟机的磁盘格式，有raw/qcow2/vmdk
```

比如：

```sh
qm importovf 101 'Ubuntu 64 位.ovf' local-storage-1 -format vmdk
```

转换进度到 100%，即可在 web 面板上看到，配置 vm，缺少了网络的设置，手动设置即可。

#### 方法2：vmdk导入

在 web 面板新建一个 vm，查看附带的硬盘的文件名，为替换做准备。

寻找镜像储存库，大概 物理位置为 `/dev/pve/xxx/`。可以先查看一下目录`/dev/pve`里有哪些文件。查看是否是快捷方式指向它处。

在面板删除 vm 的硬盘。需要先分离，然后找到未使用磁盘，再删除。

这里同样的，下载 vmdk 到 pve 上。找到 vmdk 文件。将镜像移到到镜像储存库。

至此我没有找到正确的存储路径，移动一个超大的 vmdk 文件会提升空间不足，因此放弃了操作，使用了方法1。

若导入成功，将 vm 连接磁盘：

```sh
qm set 101 --scsi1 local-storage-1:101/ubuntu.vmdk
```

在面板上或者 ssh 终端上设置 vm 的引导顺序：

```sh
qm set 100 --boot c --bootdisk scsi1
# qm set <vmid> --boot c --bootdisk <diskid>
# diskid 就是上面添加的scsi1。
```

## 软路由 pfSense

### pfSense 简介

pfSense 是一个基于FreeBSD，专为防火墙和路由器功能定制的开源版本。它被安装在计算机上作为网络中的防火墙和路由器存在。

VMWare WorkStation 自带 NAT 网络功能，无需额外搭建 NAT 网络。这里记录使用 EXSi 时，搭建 pfSence 实现 NAT 路由功能。

pfSense 官网：https://www.pfsense.org/

下载 CD Image (ISO) ，搭建一台 pfSense 虚拟机，可作为 NAT 路由器，为其他虚拟机提供路由，防火墙等功能。

### 创建虚拟网络环境

已 EXSi 7.0b 为例，在网络管理中：

1. 选择【虚拟交换机】标签页，添加标准虚拟交换机，不添加上行链路，设置好交换机名称后直接创建。
2. 选择【端口组】标签页，添加端口组，设置好名称，在虚拟交换机处选择刚才新建的交换机。

>  这里假设之前已设置好其他带有上行链路的虚拟交换机以及端口组。

### 创建 pfSense

和创建普通虚拟机一样，这里我分配了 1 vCPUs，256M 内存，4GB 硬盘。配置 2 个网卡，分别连接可联网的端口组（稍后配置为 WAN）以及刚才新建的端口组（稍后配置为 LAN）。

通过 iso 文件启动会，按照提示一步一步安装即可。在设置 WAN 口和 LAN 口的对应关系时，可查看虚拟机设置里网卡的 mac 地址进行区分。

通常会设置 WAN 口的 IP 地址为 static，LAN 口开启 dhcp，这样一台路由器就搭建成功了。

### 使用

将其他虚拟机的网络设置为新建的端口组，就相当于连接到了 pfSense，可通过 dhcp 获取到 pfSense 分配的 IP 地址。并上网。

在浏览器访问 LAN 口的的 IP 地址，即网关地址，可打开 pfSense 的 web 管理页面。和设置自家的路由器差不多，但是功能更强大。默认的账户密码为 `admin/pfsense`

> 默认 LAN 地址是 192.168.1.1。若未开启 dhcp，可手动配置同一段的 IP 地址。

实际中测试在 WAN 口分配了公网 IP 地址，其他虚拟机可通过这个 IP 实现 NAT 方式连接网络，达到节省 IP 地址的目的。

其他更多的功能自己去体验吧。

## 爱快路由系统

https://www.ikuai8.com/component/download

简单易上手

## openWrt

https://openwrt.org/zh/start

### 下载固件

https://firmware-selector.openwrt.org/

### 虚拟机硬盘格式转换工具

https://www.starwindsoftware.com/starwind-v2v-converter

