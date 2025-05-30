---
layout:       article
title:        路由器刷固件 openwrt 记录 
key:          2021-01-29
tags:         openwrt
categories:   manual
created_date: 2021-01-29 22:58:13 +08:00:00
date:         2024-01-21 16:10:10 +08:00:00
---

记录一下小米路由器 R3G 刷固件的遇到的问题以及使用新固件时的一些设置。

<!--more--> 

## 相关设备

- 小米路由器 R1D
- 小米路由器 R3G

小米路由器 R1D，

> 1TB 2.5 英寸 HDD 硬盘。Broadcom BCM4709 双核 1GHz，256M DDR3-1600，USB 2.0

小米路由器 R3G，

> MT7621A MIPSle 双核 880MHz，256M DDR3-1200，128MB SLC Nand Flash，USB 3.0

## 刷机步骤

### 小米路由器 root

访问 http://www1.miwifi.com/miwifi_download.html，点击 右边的 ROM，找到对应型号的开发版固件，下载。通过 web 管理页面刷入开发板 ROM。

访问 http://d.miwifi.com/rom/ssh，需要账号登录，可查看 root 密码，并下载工具包。根据提示打开路由器的 ssh 功能。

### 备份

首先连接 SSH 输入 `cat /proc/mtd` 显示如下信息

```sh
root@XiaomiR3G:~# cat /proc/mtd
dev: size erasesize name
mtd0: 07f80000 00020000 "ALL"
mtd1: 00080000 00020000 "Bootloader"
mtd2: 00040000 00020000 "Config"
mtd3: 00040000 00020000 "Bdata"
mtd4: 00040000 00020000 "Factory"
mtd5: 00040000 00020000 "crash"
mtd6: 00040000 00020000 "crash_syslog"
mtd7: 00040000 00020000 "reserved0"
mtd8: 00400000 00020000 "kernel0"
mtd9: 00400000 00020000 "kernel1"
mtd10: 02000000 00020000 "rootfs0"
mtd11: 02000000 00020000 "rootfs1"
mtd12: 03580000 00020000 "overlay"
mtd13: 012a6000 0001f000 "ubi_rootfs"
mtd14: 030ec000 0001f000 "data"
```

我们需要备份前面 13 个分区（第 14 个分区可能提示占用而不能被备份）。在小米路由器上插入一个格式化为 FAT32 格式的 U  盘（你可以继续用之前解锁 SSH 的 U 盘），然后在终端执行 `df -h` 查看你的 U 盘的路径（通常形如  /extdisks/sdax）。我的是 /extdisks/sda1，下文以此为例。

在终端中依次输入下面的指令（别忘了修改为你的 U 盘的路径）：

```sh
mkdir /extdisks/sda1/backup
dd if=/dev/mtd0 of=/extdisks/sda1/backup/ALL.bin
dd if=/dev/mtd1 of=/extdisks/sda1/backup/Bootloader.bin
dd if=/dev/mtd2 of=/extdisks/sda1/backup/Config.bin
dd if=/dev/mtd3 of=/extdisks/sda1/backup/Bdata.bin
dd if=/dev/mtd4 of=/extdisks/sda1/backup/Factory.bin
dd if=/dev/mtd5 of=/extdisks/sda1/backup/crash.bin
dd if=/dev/mtd6 of=/extdisks/sda1/backup/crash_syslog.bin
dd if=/dev/mtd7 of=/extdisks/sda1/backup/reserved0.bin
dd if=/dev/mtd8 of=/extdisks/sda1/backup/kernel0.bin
dd if=/dev/mtd9 of=/extdisks/sda1/backup/kernel1.bin
dd if=/dev/mtd10 of=/extdisks/sda1/backup/rootfs0.bin
dd if=/dev/mtd11 of=/extdisks/sda1/backup/rootfs1.bin
dd if=/dev/mtd12 of=/extdisks/sda1/backup/overlay.bin
dd if=/dev/mtd13 of=/extdisks/sda1/backup/ubi_rootfs.bin
dd if=/dev/mtd14 of=/extdisks/sda1/backup/data.bin
```

当你运行到最后一个是可能会遇到以下报错提示：

```sh
dd: can't open '/dev/mtd14': Device or resource busy
```

这个无所谓，我们只需要备份前 13 个分区就行，最后一个分区没有备份的必要。

如果你还在使用 MIWIFI 的官方固件，需要还原上述备份，你可以使用下述指令；

**当然现在我们不需要执行这些操作**：

```sh
mtd write /extdisks/sda1/backup/Bootloader.bin Bootloader
mtd write /extdisks/sda1/backup/Config.bin Config
mtd write /extdisks/sda1/backup/Bdata.bin Bdata
mtd write /extdisks/sda1/backup/Factory.bin Factory
mtd write /extdisks/sda1/backup/crash.bin crash
mtd write /extdisks/sda1/backup/crash_syslog.bin crash_syslog
mtd write /extdis ks/sda1/backup/reserved0.bin reserved0
mtd write /extdisks/sda1/backup/kernel0.bin kernel0
mtd write /extdisks/sda1/backup/kernel1.bin kernel1
mtd write /extdisks/sda1/backup/rootfs0.bin rootfs0
mtd write /extdisks/sda1/backup/rootfs1.bin rootfs1
mtd write /extdisks/sda1/backup/overlay.bin overlay
mtd write /extdisks/sda1/backup/ubi_rootfs.bin ubi_rootfs
# 如果你备份了 data，你可以继续执行下面的指令还原 data
mtd write /extdisks/sda1/backup/data.bin data
```

### 刷入 breed

这个步骤是刷入 Bootloader 分区，就是类似安卓的 recovery，用来恢复备份系统的。就算固件刷坏了，Bootloader 没坏，都能刷回来，不会变砖。

前往：<http://breed.hackpascal.net/> 下载

在刷机资源包里的 **breed-mt7621-xiaomi-r3g.bin** 文件，通过 ssh 的 sftp 功能上传到 `/tmp` 目录。（最新版 更新日期为 2022-07-24 ）

执行命令：

```sh
mtd -r write /tmp/breed-mt7621-xiaomi-r3g.bin Bootloader
```

或者通过 U 盘，执行命令：（根据 U 盘的路径自行修改）

```sh
mtd -r write /extdisks/sda1/breed-mt7621-xiaomi-r3g.bin Bootloader
```

输入上方命令后，路由器会重启。重启完成后，我们拔掉电源，并用东西戳着路由器的 reset 键开机，看到路由器前面的灯在狂闪的时候松开戳 reset 键。

使用电脑连接路由器的任何一个 lan 口。电脑打开浏览器输入 http://192.168.1.1 回车进入 Breed 管理界面。

**以后只要 breed 页面可进，就可以随意刷机。**

我们可以在【固件备份】页面备份一下EEPRO和编程器固件，方便以后刷回官方。（虽然以后不会刷回去）

### 刷入 padavan 

参考：http://www.leftso.com/blog/752.html

访问 https://opt.cn2qq.com/padavan/，下载最新版，基本上每周都会更新，搜索关键字：R3G

备份完成后，切换到【小米R3G设置】里删除 `normal_firmware_md5` 一栏，然后保存。（这一步不操作好像也可以执行下面的操作。v1.2 版 breed 没有此项）

接下来切换到【固件更新】，勾选固件，将准备好的固件上传，更新完成后机器会自动重启。

如刷入老毛子，可以选择 MI-R3G_3.4.3.9-099.trx 上传。重启完成后，浏览器输入 http://192.168.1.1 弹出用户密码输入 admin  /  admin ，进入 padavan 界面。正常使用就好。

### 刷入 openwrt

官方：https://openwrt.org/zh/start

筛选 xiaomi_mi-router-3g：https://firmware-selector.openwrt.org/?version=24.10.0&target=ramips%2Fmt7621&id=xiaomi_mi-router-3g



参考：http://zszmm.com/archives/136/，https://www.right.com.cn/forum/thread-1141988-1-1.html

进入 padavan，在【固件更新】勾选“固件“，选择 openwrt-ramips-mt7621-xiaomi_mir3g-initramfs-kernel.bin 上传。确认刷入。
刷入后重启，这个是临时固件，断电数据不会保存，然后进入路由器管理页面 192.168.1.1
默认用户名 root 密码 password。

进去系统管理，更新固件，选择 openwrt-ramips-mt7621-xiaomi_mir3g-squashfs-sysupgrade.bin

之后会自动再次进入 breed。访问 192.168.1.1，在环境变量编辑里添加 `xiaomi.r3g.bootfw` 字段，值为 2，保存后重启即可完美进入 Openwrt。

## 自己编译 openwrt

源码仓库地址：https://github.com/coolsnowwolf/lede。需要准备一个 Ubuntu 最新版。准备过程略。

### 编译步骤

1. 按照源码中的 README 操作，先做前期准备

 ssh 登录 Ubuntu ，而不推荐在 Ubuntu 中直接使用 terminal。

2. 查看内存使用

```sh
free -m
```

内存 1G 不够，扩大内存或增加虚拟内存

```sh
dd if=/dev/zero of=/home/swap bs=1024 count=1024000
/sbin/mkswap /home/swap
/sbin/swapon /home/swap
```

再次执行 `free -m` 确认增加成功

3. 编译时要使用非 `root` 用户，新建

```sh
useradd xxx
passwd xxx
```

4. 赋予新用户 sudo 权限

编辑 `/etc/sudoers`：

```sh
nano /etc/sudoers
```

在这一行内容后面，

```sh
root ALL=(ALL:ALL) ALL
```

增加：

```sh
xxx ALL=(ALL:ALL) ALL
```

按 `Ctrl + x`输入`Y`，按回车，再按回车保存。

5. 执行系统更新

```sh
sudo apt update -y
```

6. 安装编译所需要的软件包

```sh
sudo apt install -y build-essential asciidoc binutils bzip2 gawk gettext git libncurses5-dev libz-dev patch python3 python2.7 unzip zlib1g-dev lib32gcc1 libc6-dev-i386 subversion flex uglifyjs git-core gcc-multilib p7zip p7zip-full msmtp libssl-dev texinfo libglib2.0-dev xmlto qemu-utils upx libelf-dev autoconf automake libtool autopoint device-tree-compiler g++-multilib antlr3 gperf wget curl swig rsync
```

7. 切换到新用户，依次执行

```sh
su xxx
cd ~
git clone https://github.com/coolsnowwolf/lede --depth=1
cd lede
# 更新列表
./scripts/feeds update -a
./scripts/feeds install -a
```

8. 固件配置

```sh
make menuconfig
```

根据需要选择，上下键切换选项，左右键切换按钮功能，空格键自动在 Y、M、N 直接切换。回车确认选择。

点击 Y 勾选需要编译进固件的应用，M 勾选只编译为 ipk 安装包，N 剔除不需要的应用。

选择 `HELP` 按钮可查看依赖，按 `/`可进行搜索。

我的选择记录在文章后面的**自定义配置**。

9. 预下载编译所需的软件包

```sh
make -j8 download V=s
```

10. 检查文件完整性

```sh
find dl -size -1024c -exec ls -l {} \;
```

此命令可以列出下载不完整的文件（根据我多次编译的经验得出小于 1k 的文件属于下载不完整），如果存在这样的文件可以使用

````sh
find dl -size  -1024c -exec rm -f {} \;
````

将它们删除，然后重新执行`make download`下载并反复检查，确认所有文件完整可大大提高编译成功率，避免浪费时间。

11. 开始编译

```sh
make -j1 V=s
```

编译的配置保存到 `.config` 文件。

编译生成的最终文件在 `bin/targets` 目录下。

二次编译：

```sh
cd lede
git pull
./scripts/feeds update -a && ./scripts/feeds install -a
make defconfig
make -j8 download
make -j$(($(nproc) + 1)) V=s
```

如果需要重新配置：

```sh
rm -rf ./tmp && rm -rf .config
make menuconfig
make -j$(($(nproc) + 1)) V=s
```

### 注意事项

实测：使用最新的 Ubuntu 24.04 LTS，全程使用梯子，可顺利编译成功。

遇到的问题：

- 若使用 debian (精简版)，在第一步前期准备时就提示无法找到包。
- 使用 Ubuntu ，使用国内源镜像执行 `apt`，会提示无法找到包。使用默认的美国源一切正常。感觉速度慢就使用梯子，可加快速度。
- 编译时最后一步 `make -j1 V=s` 操作会执行很久，首次编译会下载大量源码，并生成中间产物，如果没用梯子，编译进度可能会因网络不通，在不断地尝试网络连接中而无法继续执行。
- 修改配置可能导致编译时报错奇奇怪怪，即使编译成功， 刷机后无法使用，获取不到 IP 或有线连接周期性（40秒）显示网线已拔出。猜测是再次修改勾选的内容变少导致。这种情况下删除所有源码，重新 `clone`，重新编译吧。

- 上一个问题也可以通过执行 `make clean` ，删除产生的object文件（后缀为“.o”的文件）及可执行文件。
- 建议第一次编译使用单线程 `make -j1 V=s`，再次编译可使用多线程 `make -j$(nproc) V=s`。

### 一些额外包的添加方式

wg-quick

```sh
git clone https://github.com/gngpp/wg-quick package/network/utils/wg-quick --depth=1
make menuconfig # choose Network->VPN->wg-quick
make V=s
```

实测编译后并不包含，在 `bin/packages/mipsel_24kc/base/` 下生成了 ipk 的包，可安装后使用。



### 自定义配置

首先举例一些 ssh 登录后的命令操作

```sh
uci set network.lan.ipaddr=192.168.31.1

uci set network.wan.proto=static
uci set network.wan.ipaddr=192.168.1.31
uci set network.wan.gateway=192.168.1.1
uci set network.wan.dns=192.168.1.1
uci commit
```

勾选所有包不太现实。受路由器本身的 Flash 存储空间和性能的限制。由于包之间有依赖关系，选择某个包会自动勾选它的依赖。有些包功能重复，如果勾选重复了，在编译时会报错。

根据报错信息重新固件配置 `make menuconfig`。

默认选项中不包含以下的 package，我需要手动勾选。找的好辛苦，做个记录：

> 源码版本不同，内容存差异。当前 git 文件时间：2023.05.02

| 包路径                          | 名称                                    | 是否保留 |
| ------------------------------- | --------------------------------------- | -------- |
| Target System                   | MediaTek Ralink MIPS                    |          |
| Subtarget                       | MT7621 based boards                     |          |
| Target Profile                  | Xiaomi Mi Router 3G                     |          |
| Base system                     | busybox                                 | y        |
| Base system > Customize busybox | Coreutils - nohup                       | y        |
| **Utilities > coreutils**       | coreutils-nohup                         |          |
| Base system > Customize busybox | Init Utilities - init                   | y        |
| Base system > Customize busybox | Linux System Utilities - fdisk          | y        |
| Base system > Customize busybox | Networking Utilities - wget(勾选子选项) | y        |
| Administration                  | htop                                    | y        |
| Extra packages                  | automount                               | y        |
| Extra packages                  | autosamba                               | y        |
| Extra packages                  | ipv6helper                              | y        |
| Languages > Python              | python3-pip                             | y        |
| LuCI > 3. Applications          | luci-app-aria2                          | y        |
| LuCI > 3. Applications          | luci-app-commands                       | y        |
| LuCI > 3. Applications          | luci-app-diskman (Include lsblk)        | y        |
| LuCI > 3. Applications          | luci-app-frpc                           | y        |
| LuCI > 3. Applications          | luci-app-frps                           | y        |
| LuCI > 3. Applications          | luci-app-syncdial                       | y        |
| LuCI > 3. Applications          | luci-app-ttyd                           | y        |
| LuCI > 3. Applications          | **luci-app-unblockmusic**               | N        |
| LuCI > 3. Applications          | **luci-app-vlmcsd(KMS授权服务器)**      | N        |
| LuCI > 3. Applications          | luci-app-webadmin                       | y        |
| LuCI > 3. Applications          | luci-app-wireguard                      | y        |
| Network > BitTorrent            | qbittorrent                             | M        |
| Network > File Transfer         | curl                                    | y        |
| Network > Filesystem            | davfs2                                  | y        |
| Network->VPN                    | wg-quick                                | y        |
| Network > Web Servers/Proxies   | nginx-all-module                        | y        |
| Network                         | iftop                                   | y        |
| Network                         | iperf3                                  | y        |
| Network                         | wg-installer-client                     | y        |
| Utilities > Editors             | nano-full                               | y        |
| Utilities > Filesystem          | ntfs-3g                                 | y        |
| Utilities > Terminal            | screen                                  | y        |
| Utilities                       | file                                    | y        |
| Utilities                       | tar                                     | y        |
| Utilities                       | whereis                                 | y        |

## openwrt 使用技巧

openwrt 功能强大， 以下记录一些注意事项。固件版本：OpenWrt  R23.5.1。内核版本：5.4.242

### 设置 wireguard 与 PPPoE 共存

单线上联光猫时，若光猫改桥接，可从 openwrt 拨号并添加 wireguard。若从光猫拨号，则需要设置光猫下行口透传 2 个 vlan，一个是 untaged （vlan 1）的宽带，一个是自定义 vlan （比如 vlan 10），用于运行 wireguard。

在 网络 -> 接口，添加新端口，起名 **wan_wg**，协议选静态地址。

> 基本设置：设置 ip 和掩码。
>
> 高级设置：取消勾选“使用内置的 IPv6 管理”。
>
> 物理设置：接口 选”自定义接口“，填写`wan.10`，表示 WAN 口的 vlan 10 子接口。
>
> 防火墙设置：区域选 wan。

ssh登录，使用命令生成 私钥、预共享秘钥（可选）

```sh
mkdir wg
cd wg
# 配置创建密钥的权限
umask 077
# 创建预共享密钥
wg genpsk > sharekey
# 创建服务端公钥和私钥
wg genkey | tee server_privatekey | wg pubkey > server_publickey

# 获取服务端私钥复制保存
cat server_privatekey
# 获取服务端公钥复制保存
cat server_publickey
```

回到 web 端，继续添加新端口。起名 **wg0**，协议选 wireguard VPN。

> 基本设置：私钥填写刚才生成的 ，设置监听端口和 ip。
>
> 高级设置：取消勾选“使用内置的 IPv6 管理”。
>
> 防火墙设置：区域选 wan。

下面 peer 点击“添加”，填写对端信息。

在 网络 -> 静态路由，添加相关路由，至少要包括与 allow ips 一致的地址段。allow ips 添加路由时选择接口 **wg0**，网关填写 **wan_wg** 的 ip。

> 设置路由后，最好重启（先关闭再打开）对应的接口。刷新路由使其生效。

可在 状态 -> WireGuard 状态，查看收发包情况。

### 设置多播

网络 -> 多线多播，启动，设置多播类型，虚拟 WAN 接口数量。

注意在接口设置里，配置 vwan1、vwan2 等等虚拟接口，物理设置，接口分别设置为对应的 macvlan。

为了访问光猫的管理页面，在 网络 -> 接口，接口总览页，”添加新接口”，协议选择 DHCP 客户端。

### 作为主路由使用 ipv6

 网络 -> 接口，每一个接口都需要在高级设置中，取消勾选“使用内置的 IPv6 管理”。

在 LAN 接口设置中，下面的 ipv6 设置，**路由通告服务** 设置为混合模式，**DHCPv6 服务** 设置为禁用，**NDP 代理** 设置为禁用。

网络 -> DHCP/DNS，高级设置，取消勾选“禁止解析 IPv6 DNS 记录”。

### 作为二级路由使用 ipv6

 网络 -> 接口，每一个接口都需要在高级设置中，取消勾选“使用内置的 IPv6 管理”。

设置 LAN 和 WAN 的 协议为 静态地址，这样才能出现 dhcp 的 ipv6 设置，下面 ipv6 设置全部选择中继模式。

ssh 登录，在 `/etc/config/dhcp` 文件中查找到 wan 口配置，在下面加一行 `option master '1'`

在路由器下面的随便一个接口点击保存&应用，上面的改动就生效了。客户端可以获取到 ipv6地址了。

### 配置 ssh 的安全

系统 -> 管理权，修改 Dropbear 实例 的接口为 lan。可阻止来自外部的访问。

### 对外打开防火墙

设置了 nginx 等服务，发现外面无法访问。

网络 -> 防火墙，在区域设置中，将 WAN 区域的入站数据规则修改为接受。

### 挂载 ntfs 格式的移动硬盘

```sh
mkdir /uusr
mount -t ntfs-3g /extdisks/sda1 /uusr
```

### 设置文件共享

网络存储 -> 网络共享，添加共享目录。编译时如果勾选了 automount，autosamba，会自动挂载自动分享为 SMB。

### 设置 DDNS

首先将域名迁移到 dnspod.cn。用于配置 DDNS 的域名必须设置三级域名，先手动创建三级域名，解析的 IP地址随便写。

在 dnspod 上创建 token，可参考：<https://support.dnspod.cn/Kb/showarticle/tsid/227/>。

需要记住 id 和 token。

把下面的 shell 脚本放到 openwrt 上：

```ini
https://github.com/anrip/dnspod-shell/
```

根据 README，配置好 id 和 token。赋予可执行权限。就可以测试使用了。

最后设置为脚本定时执行。

### 手动更新某些组件

小米路由器 R3G，下载可执行的二进制文件，选择 mipsle 架构。

### nano 没有语法高亮

编译前通过勾选 `nano-full`解决。

找到一台有语法高亮的系统，拷贝 `/usr/share/nano/*` 到 openwrt，

然后设置 `~/.nanorc`

```ini
include /usr/share/nano/*
```

  如果保存时提示 `segmentation fault`，执行 `unset LANG` 。

**另一种思路**

```sh
find /usr/share/nano/ -iname "*.nanorc" -exec echo include {} \; >> ~/.nanorc
# 如果您的.nanorc文件中有一个拒绝接受通配符的nano版本，则此方法有效:
find /usr/share/nano -name '*.nanorc' -printf "include %p\n" > ~/.nanorc
```

> `find`命令搜索指定目录内的文件或目录。
>
> - `-iname`标志告诉它只查找名称以`.nanorc`结尾的文件。
> - `-exec`标志定义了在每个找到的文件上执行的命令。
> - `{}`被替换为文件名。
> - `\;`用于表示要执行到`find`命令的命令的结尾。
> - 最后，`>> ~/.nanorc`会将输出附加到您的`~/.nanorc`文件。

### 设置 openwrt 为旁路由

网络 - > 接口，修改 LAN：

物理设置，勾选 **桥接接口**，在下面的接口里勾选标记 WAN，LAN 的接口。

协议切换为 **DHCP 客户端**，或切换为**静态地址**。

删除多余的接口，只需保留 LAN。

## 实际效果

将小米路由器 R1D 的内置硬盘拆下来，买个 sata 转 USB 3.0 的工具。连接到一起后插到小米路由器 R3G 的 USB 接口。配置好硬盘挂载和文件共享。在局域网下的电视就可以在网络共享中访问。

为了提升读写性能，最好将硬盘格式化成 ext4 格式。

