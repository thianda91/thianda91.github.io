---
layout:       article
title:        协同办公可自托管的应用收集
key:          2018-12-30
tags:         vps
categories:   notes
created_date: 2018-12-30 01:01:11
date:         2019-04-01 15:19:02
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

安装 docker，可参考[这里](../notes/vps-init.html#安装-docker)。

> Docker 镜像 <http://mirrors.ustc.edu.cn/help/dockerhub.html>
>
> Docker 镜像 <https://www.docker-cn.com/registry-mirror>

docker 安装完毕，安装 collabora，官方下载：<https://www.collaboraoffice.com/code/>

### 方式 1 拉取 docker

1. 拉取 collabora 镜像：<https://hub.docker.com/r/collabora/code/>。

```sh
docker pull collabora/code
# 此过程较慢
```

2. 运行 docker 版的 collabora，需配置 owncloud 的域名，以及 collabora 后台的账户和密码

> 下面命令 将域名设置为 yourdomain.com，用户名和密码设置为 collabora。

```sh
docker run -t -d -p 127.0.0.1:9980:9980\
        -e 'domain=yourdomain\\.com'\
        -e "username=collabora"\
        -e "password=collabora"\
        -e "extra_params=--o:ssl.termination=true"\
        --restart always\
        --cap-add MKNOD\
collabora/code
```

如果要让这个 Collabora Office 同时服务于多个域名的话，需要在两个不同域名之间加上\|，例如：

```sh
'domain=cloud\\.nextcloud\\.com\|second\\.nexcloud\\.com'
```

参考：[Collabora Online Development Edition ](https://www.collaboraoffice.com/code/)、[Setting up and configuring collabora/code Docker image](https://www.collaboraoffice.com/code/docker/)(官方)

### 方式 2 Univention App

访问：[Collabora Online Development Edition](https://www.univention.com/products/univention-app-center/app-catalog/collabora/)。

<https://www.univention.com/products/univention-app-center/collabora-online-development-edition-with-nextcloud/>

下载过程较慢，具体看网速，建议使用国外 vps 下载。

安装过程较慢，需要很多根据提示手动配置的部分，因为是虚拟机，设置完毕开始安装，约 1 个多小时。

### 配置文件分析

> 此部分用于后面的内容修改，但是实践时发现内容修改并不能满足我们的需求。实际操作请查看后面的**终极解决方案**。

这个 Univention App 为一个虚拟机，里面已经使用  docker 搭建好了  Collabora Online 和 nextcloud。

```sh
# 查看本地镜像
docker images
# 查看当前运行的容器
docker ps
```

可以看到 docker 的端口映射：

```ini
nextcloud: 0.0.0.0:40000->80/tcp
collabora: 0.0.0.0:9980->9980/tcp
```

web 服务器是 apache2。apache2 的配置文件保存在 `/etc/apache2/`。

可能需要如下修改操作以适应自己想需求：

| 功能            | 文件                                              | 操作     |
| --------------- | ------------------------------------------------- | -------- |
| 端口监听        | `/etc/apache2/ports.conf`                         | 修改端口 |
| 端口监听        | `/etc/apache2/ports.conf.debian`                  | 修改端口 |
| 站点            | `/etc/apache2/sites-enabled/000-default.conf`     | 修改端口 |
| 站点            | `/etc/apache2/sites-enabled/default-ssl.conf`     | 修改端口 |
| 绑定域名及https | `/etc/apache2/sites-enabled/univention-saml.conf` | 修改域名 |

其中：

`000-default.conf`配置了`:80`，包含了`/etc/apache2/ucs-sites.conf.d/*.conf`。

> 包含文件中配置了几条路由转发到 `:9980`，即 collabora

`default-ssl.conf`配置了`:443`包含了`/etc/apache2/ucs-sites.conf.d/*.conf`，并且将 `:443/nextcloud` 转发到了 `:40000/nextcloud`。

>包含文件中配置了几条路由转发到 `:9980`，即 collabora

`univention-saml.conf`配置了`:80`和`:443`，包含了`/etc/apache2/sites-available/univention-proxy.conf`，

> 包含文件中配置了一些 rewrite

### 修改内容

apache 绑定域名和设置 https 证书比较麻烦，于是打算用 caddy 辅助一下。假设已经安装好 caddy，并自定义了 caddy 的 http 和 https 端口。即：

```ini
# /etc/init.d/caddy
# do_start() 的 else 段落 添加：
export CLOUDFLARE_API_KEY=xxx
export CLOUDFLARE_EMAIL=xxx
nohup "$BIN" -http-port=14444 -https-port=34444 ...
```

继续操作：

```sh
mkdir /var/caddy
cd /var/caddy
echo '<h1>This is only for auto https!' > /var/caddy/index.html
echo 'yourdomain.com {
 root /var/caddy
 tls {
  dns cloudflare
 }
}' > /usr/local/caddy/Caddyfile
/etc/init.d/caddy restart
```

caddy 会自动申请 https 证书。证书保存在

```sh
~/.caddy/acme/acme-v02.api.letsencrypt.org/sites/
```

修改上面提到的配置文件

```sh
nano /etc/apache2/sites-enabled/default-ssl.conf
nano /etc/apache2/sites-enabled/univention-saml.conf
```

将证书路径修改一下，添加如下两行

```ini
SSLCertificateFile /root/.caddy/acme/acme-v02.api.letsencrypt.org/sites/{yourdomain.com}/{yourdomain.com}.crt
SSLCertificateKeyFile /root/.caddy/acme/acme-v02.api.letsencrypt.org/sites/{yourdomain.com}/{yourdomain.com}.key
```

若修改 端口，记得将上述配置文件中的监听端口一一修改，重启 apache2 并添加 iptables 策略

```sh
/etc/init.d/apache2 restart
iptables -I INPUT -m state --state NEW -m tcp -p tcp --dport 14444 -j ACCEPT
iptables -I INPUT -m state --state NEW -m tcp -p tcp --dport 34444 -j ACCEPT
```

上面是临时添加，重启后失效。若要永久保存，则需要找到 iptables 的配置文件：

```sh
/etc/security/packetfilter.d/10_univention-firewall_start.sh
```

编辑上述文件，仿造写下命令并保存：

```sh
iptables --wait -A INPUT -p "tcp"  --dport 14444 -j ACCEPT
iptables --wait -A INPUT -p "tcp"  --dport 34444 -j ACCEPT
```

然后重新运行上面的代码。

**其他可能用到的命令**

```sh
# 查找含有某字符串的所有文件
grep -rn "443" *
# 端口占用情况
netstat -apn | grep apache2
# 全部运行进程
ps -aux
ps -ux
```

修改端口时发现 ssl 端口监听配置在`/etc/apache2/mods-available/ssl.conf`的 line 11，在这里修改后重启 apache2 才生效。

### 终极解决方案

以上操作尝试后发现，docker 内的 app 已经固化了某些链接，他们是不带端口号的。所以 docker 内的 apache2 的监听端口修改会造成更多的问题。最后改成使用本机的 nginx 代理 docker 中的 apache2，再配合 caddy 实现自动 https 证书。

[官方的 nginx 配置](https://www.collaboraoffice.com/code/nginx-reverse-proxy/)。

**修改 collabora**

```sh
docker ps
# 进入到 docker 的内部
docker exec -it 8a43ecd80cc8 /bin/bash # 8a43ecd80cc8 是 CONTAINER ID
# 从 docker 中退出来
exit
# 在 docker 中修改配置，没有安装 nano/vim
apt update
apt install nano
nano /etc/loolwsd/loolwsd.xml
# 关闭 https
# 在 /etc/loolwsd/loolwsd.xml 搜索 ssl,设置为 false
# 授权可访问的域名配置在 /etc/loolwsd/loolwsd.xml 最后面

########################################
# 也可以将 loolwsd.xml 从 docker 中复制出来
docker cp 8a43ecd80cc8:/etc/loolwsd/loolwsd.xml loolwsd.xml
nano loolwsd.xml
# 修改完再复制到 docker
docker cp loolwsd.xml 8a43ecd80cc8:/etc/loolwsd/loolwsd.xml
# 进入到 docker 授权
docker exec -it 8a43ecd80cc8 /bin/bash 
chmod 644 /etc/loolwsd/loolwsd.xml
exit
docker restart 8a43ecd80cc8
```

