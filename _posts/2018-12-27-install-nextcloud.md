---
layout:       article
title:        debian 安装 nextcloud（自建网盘）
key:          2018-12-27
tags:         vps php
categories:   notes
created_date: 2018-12-27 13:22:28
date:         2018-12-29 23:29:04
---

## nextcloud 简介

nextcloud 是一种自托管的网盘。官网：<https://nextcloud.com/>

> **Nextcloud - Protecting your data**
>
> Building self-hosted products that allow you to be productive without losing control

<!--more-->

它基于 php，通常搭建在 linux 系统作为服务端。[客户端](https://nextcloud.com/install/#install-clients)在 PC 端有 windows、mac-os、Linux，移动端有 [安卓](https://f-droid.org/packages/com.nextcloud.client/)、[IOS](https://itunes.apple.com/us/app/nextcloud/id1125420102)。

服务端在官网下载存档文件（archive）,也可以下载一个 php，自己搭建好 http 服务，访问该 php 页面安装。

本文记录从搭建 虚拟机 debian 开始，一步一步搭建环境并安装 nextcloud 的过程。

## 安装 debian

可参考我之前的的[这篇文章](../notes/vps-init.html)，以及[这篇文章](../notes/learn-debian-hand-by-hand.html)。

可以在虚拟机下安装，若有云平台，如 ESX server 等，安装方法同在虚拟机安装。或者可以租个云主机/VPS。

主要涉及的是设置网络环境及 ssh、下面的操作都将在 ssh 登录 debian 后操作。

### ssh 客户端推荐

- SecureCRT，可百度搜个中文破解版
- MobaXterm，去官网下载，功能强大支持若干协议，内建 X server，英文界面。个人免费
- putty，绿色单文件运行、无法保存密码，可在 ssh 设置了 RSA 秘钥认证后实现“记住密码”

## 搭建 HTTP 服务

首先，养成一个习惯，在安装任何软件包之前，执行一下更新：

```sh
apt-get update
apt-get upgrade
```

### 安装 caddy

```sh
wget -N --no-check-certificate https://raw.githubusercontent.com/ToyoDAdoubi/doubi/master/caddy_install.sh && chmod +x caddy_install.sh && bash caddy_install.sh install http.filemanager,tls.dns.cloudflare
```

此步骤会附带安装插件：`http.filemanager`和`tls.dns.cloudflare`，以后会用到。

使用 caddy 作为 web 服务器，优点：

- 跨平台、自动申请 https 证书
- 原生 http/2，插件丰富
- 配置简单、无明显漏洞，安全

### 安装 php7

debian 默认无法安装 php7，首先要添加软件源：

`/etc/apt/sources.list` 写入`deb http://mirrors.163.com/debian/ testing main`

```sh
echo 'deb http://mirrors.163.com/debian/ testing main' >> /etc/apt/sources.list
```

注意使用`>>`，在文件最后添加，而不是使用``>`，将原来的信息覆盖。

以上的 `mirrors.163.com` 的软件源适合国内网络环境。若是国外 vps ，可查看 [debian 全球镜像站](https://www.debian.org/mirror/list)，选择一个 vps 所在国家的软件源。

软件源添加完毕，更新：

```sh
apt-get update
apt-get upgrade
```

查询一下软件包

```sh
apt-cache search php7
```

根据查询结果安装，这时可查询到`php7.3-fpm`。点击了解关于[php fpm](https://baike.baidu.com/item/php-fpm/10256166)。

```sh
apt-get install php7.3-fpm
```

安装时有对话框，选择`yes`即可。安装完毕，查看`phpinfo()`信息：

```sh
php -r "phpinfo();" | more
```

**安装 composer**

在本教程中用不到。Emmm...

```sh
curl -sS https://getcomposer.org/installer | php
mv composer.phar /usr/local/bin/composer
composer -V
```

**修改配置 php.ini**

根据 phpinfo 找到 php.ini

```sh
nano /etc/php/7.3/cli/php.ini
```

在最后添加：

```ini
date.timezone = Asia/Shanghai
expose_php = Off
max_execution_time = 300
upload_max_filesize = 200M
```

 

### 申请域名

若搭建在公网环境中，推荐使用域名访问。需要申请域名、设置 dns，申请并配置 https 证书。

可以在阿里万网、西部数据等等地方申请域名，主要用于开启 https，申请证书，传输加密。

这里介绍注册免费二级域名，使用期 1 年：<https://www.freenom.com>，教程可参考[这篇](https://coderschool.cn/2197.html)或自行百度。

目前该网站应该是屏蔽了中国大陆的 ip 地址，以及语言为中文的浏览器。所以想要体验免费二级域名，需要 FQ 并使用语言为非中文的浏览器（如英文版 firefox）。

### DNS 解析/CDN 设置

推荐将获得的域名的 Nameservers 更改到 Cloudflare，这样可以利用 caddy 的 插件 tls,dns.cloudflare 来自动申请/更新子域名的 https 证书。修改 Nameservers 需要到 购买域名的平台进行设置。设置后到 `dash.loudflare.com` add site。并设置 dns 解析，将域名指向自己的服务器。

## 安装 nextcloud

环境搭建好之后，可按照 nextcloud 官网安装。可查看[官网说明的系统需求](https://docs.nextcloud.com/server/15/admin_manual/installation/system_requirements.html#server)。

### 配置工作目录

caddy 的安装路径为 `/usr/local/caddy/，`在此新建 Caddyfile 的配置文件。

```sh
# 没有 vim 的请安装
apt-get install vim
vim /usr/local/caddy/Caddyfile
# 或者使用自带的　nano
nano /usr/local/caddy/Caddyfile
```

> 关于 vim 或 nano 的使用教程及快捷键，请自行百度。

在[这里](https://github.com/caddyserver/examples/)有各种 caddy 的配置样例。找到[nextcloud](https://github.com/caddyserver/examples/tree/master/nextcloud)的拿来改一改即可。可直接[在此](https://raw.githubusercontent.com/caddyserver/examples/master/nextcloud/Caddyfile)复制。

除域名外，我还将 php 的 tcp 套接字改成了 unix 套接字，并添加 tls 自动申请：

> `-` 表示删除的原配置，`+`表示修改后或新增的配置

```ini
- fastcgi / 127.0.0.1:9000 php {
+ fastcgi / /run/php/php7.3-fpm.sock php {

+    tls {
+        dns cloudflare         
+    }
     header / {
+        Referrer-Policy "no-referrer"
     }
```

创建文件夹，下载 web 安装文件：

```sh
mkdir -p /var/www/nextcloud
```

### 非 80/443 端口的特殊配置

caddy 默认监听 80/443 端口。若使用其他端口，且希望在访问 http 时自动跳转到 https，则需要一些额外的配置。

> Debian 系统中 使用 `update-rc.d` 命令来配置系统启动项。有关知识点可百度搜索"update-rc.d"，推荐[一篇博客](https://blog.csdn.net/lile777/article/details/76592509)。

修改 caddy 启动脚本`/etc/init.d/caddy`：（假设 http 端口为 1444，https 端口为 3444）

```ini
+ export CLOUDFLARE_API_KEY=xxx
+ export CLOUDFLARE_EMAIL=xxx
- nohup "$BIN" --conf="$CONF" -agree >> /tmp/caddy.log 2>&1 &
+ nohup "$BIN" -http-port=1444 -https-port=3444 --conf="$CONF" -agree >> /tmp/caddy.log 2>&1 &
```

在 Cloudflare ，右上角点击头像，选择 “My Profile” 查询自己账户的 API key，添加 Global API Key 到环境变量：

```sh
echo 'export CLOUDFLARE_API_KEY= xxx' >> ~/.bashrc
echo 'export CLOUDFLARE_EMAIL= xxx' >> ~/.bashrc
source ~/.bashrc
```

### 配置 MySQL

使用 nextCloud 会用到 mysql 数据库，推荐使用 mariadb-server:

```sh
apt-get install mariadb-server
```

添加数据库用户（远程用户）：

```sh
mysql -u root

MariaDB [(none)]> CREATE USER 'username'@'%' IDENTIFIED BY 'password';
MariaDB [(none)]> CREATE DATABASE nextcloud;
MariaDB [nextcloud]> USE nextcloud
MariaDB [nextcloud]> GRANT ALL PRIVILEGES ON nextcloud.* TO 'username'@'%';
MariaDB [nextcloud]> FLUSH PRIVILEGES;
MariaDB [nextcloud]> select User,Host from mysql.user;
```

**配置远程访问**

经查找 发现 mariadb 的`bind-address = 127.0.0.1`配置在这个文件：

```sh
/etc/mysql/mariadb.conf.d/50-server.cnf
```

可以直接在`/etc/mysql/my.cnf`中直接添加`bind-address = 0.0.0.0`：

```sh
echo 'bind-address = 0.0.0.0' >> /etc/mysql/my.cnf
service mysqld restart
```

命令行登录 mysql 会出错，Add “–no-defaults”

```sh
mysql --no-defaults -u[username] -p[password] [database]
```

> 原因：mysql client and server both read my.cnf mysql server is OK with bind-address, but the client doesn’t recognize it.

### 访问 web 安装

在 nextcloud 官网下载 web 安装文件：

```sh
wget -O "/var/www/nextcloud/setup-nextcloud.php" "https://download.nextcloud.com/server/installer/setup-nextcloud.php"
chmod +x /var/www/nextcloud/setup-nextcloud.php
```



启动 caddy：

```sh
service caddy restart
# 或
/etc/init.d/caddy restart
```

启动成功后

使用浏览器访问 web ：

```ini
https://your-nextcloud.domain:3444/setup-nextcloud.php
```

根据提示一步步操作：

**Step1**

```ini
Dependency check

Dependencies not found.
The following PHP modules are required to use Nextcloud:
zip
dom
XMLWriter
libxml
mb multibyte
GD
SimpleXML
curl

Please contact your server administrator to install the missing modules.
Can't write to the current directory. Please fix this by giving the webserver user write access to the directory.
```

依次安装依赖包，下面命令要逐行执行，不要全部复制，否则无效

```sh
apt-get install -y php7.3-zip
apt-get install -y php7.3-xml
apt-get install -y php7.3-curl
apt-get install -y php7.3-gd
apt-get install -y php7.3-mbstring
apt-get install -y php7.3-mysql
# 启动后查看日志有错误，安装下面的包解决
apt-get install -y php7.3-intl
/etc/init.d/php7.3-fpm restart
```

赋予“写”权限

```sh
# 执行`ps aux | php`，发现运行 php 的用户 是 www-data
# 且`su www-data`无法切换到该用户（用户不可用）
# 于是乎，授权：
chmod -R 747 /var/www/nextcloud/
# 官网教程执行如下：
chown -R www-data:www-data /var/www/nextcloud/
```

在 web 页面填写好管理员账号和数据库信息，可以使用了。

提示 "代码完整性检查出现异常，点击查看详细信息"。根据提示操作，将给出的代码粘贴到`php.ini`。

并添加同上面一样的内容：

```ini
date.timezone = Asia/Shanghai
expose_php = Off
max_execution_time = 300
upload_max_filesize = 200M
```

需要注意添加 opcache 要在 fpm 的 php.ini：

```sh
nano /etc/php/7.3/fpm/php.ini 

...
# 重启 php-fpm
/etc/init.d/php7.3-fpm restart
```

**step2**

填写数据库账号密码数据库名等信息。

接下来就开始愉快的玩耍吧~

### 应用推荐

登录 nextcloud 后，点击右上角头像，选择 app / 应用，可以下载安装插件，推荐几款：

> 若下载失败可手动下载到`/var/www/nextcloud/apps`，然后`tar -xzvf FILENAME`解压，刷新网页就可以看到了。手动下载后需要在 app / 应用 中 找到并点击“启动”，并输入密码验证。

| App name                 | 简介                 |      |
| ------------------------ | -------------------- | ---- |
| External storage support | 可关联外部存储。     |      |
| Files Right Click        | 右键菜单             |      |
| Collabora Online         | 在线编辑 office 文件 |      |
| Tasks                    | 创建任务             |      |
|                          |                      |      |

手动安装可能会出现权限问题或警告，授权解决：

```sh
chown -R www-data:www-data /var/www/nextcloud/apps/richdocuments
```



## debug 相关

```sh
apt install net-tools
netstat -apn
ps aux


/etc/init.d/caddy status
/etc/init.d/php7.3-fpm status
/etc/init.d/mysql status

/etc/init.d/caddy restart
/etc/init.d/php7.3-fpm restart
/etc/init.d/mysql restart

# nextcloud 更新
sudo -u www-data ./occ upgrade
```



