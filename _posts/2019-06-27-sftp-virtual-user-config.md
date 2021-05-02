---
layout:       article
title:        搭建sftp/ftp服务并配置虚拟用户
key:          2019-06-27
tags:         sftp
categories:   system
created_date: 2019-06-27 10:58:23
date:         2019-06-27 16:58:33 +08:00:00
---

linux 的文件传输可以使用 sftp，sftp 基于 openssh 通过 ssh 通道进行数据传输，使用 linux 的系统用户来鉴权，访问操作权限也与系统用户一致。

有时我们需要提供虚拟用户来供他人访问，本文总结sftp/ftp搭建与虚拟用户的配置方法。

<!--more-->

## Linux 下的 ftp 服务器

vsftpd：`apt install vsftpd`

proftpd：`apt install proftpd-basic`

pure-ftpd：`apt install pure-ftpd`

mysecureshell：`apt install mysecureshell`

下面只记录使用过的一个。

## vsftpd - 搭建 ftp 服务

### 安装

```sh
apt install vsftpd -y
apt install db-util -y
```

### 推荐配置

`nano /etc/vsftpd.conf`

```ini
listen=YES
anonymous_enable=NO
local_enable=YES

rsa_cert_file=/etc/ssl/certs/ssl-cert-snakeoil.pem
rsa_private_key_file=/etc/ssl/private/ssl-cert-snakeoil.key
ssl_enable=YES

utf8_filesystem=YES

listen_port=2222

pasv_min_port=30000
pasv_max_port=30999

idle_session_timeout=120
data_connection_timeout=300
accept_timeout=60
connect_timeout=60
anon_max_rate=50000

# use virtual users
guest_enable=YES
# virtual users's host username
guest_username=www-data
# virtual users's privs is like its host username
virtual_use_local_privs=YES
# virtual users's config (one file each virtual user)
user_config_dir=/etc/vsftpd/vconf

```

### 新建文件夹

```
mkdir /etc/vsftpd/
mkdir /etc/vsftpd/vconf/

```

### 新建虚拟用户

```sh
nano /etc/vsftpd/vir_user

username_1
passwd_1
username_2
passwd_2
# 奇数行用户名、偶数行密码
```

### 生成数据库

```sh
db_load -T -t hash -f /etc/vsftpd/vir_user /etc/vsftpd/vir_user.db
```

### 设置验证方式

编辑 `/etc/pam.d/vsftpd`

```sh
nano /etc/pam.d/vsftpd
# 注释掉其他内容，添加下面2行：
auth required pam_userdb.so db=/etc/vsftpd/vir_user
account required pam_userdb.so db=/etc/vsftpd/vir_user
```

### 创建虚拟用户的配置

```sh
nano /etc/vsftpd/vconf/username_1
# 文件名要与前面新建的用户名一致


local_root=/usr/username_1		# 虚拟用户的个人目录
anonymous_enable=NO
write_enable=NO
#local_umask=022
anon_upload_enable=NO
anon_world_readable_only=NO
anon_mkdir_write_enable=NO
#idle_session_timeout=600
#data_connection_timeout=120
max_clients=10
max_per_ip=5
local_max_rate=10485760		# 限速 100M/s

```

### 登录验证

使用 客户端 filezilla，或者 FlashFXP，进行登录测试。

若设置了`ssl_enable=YES`，则在登录方式处可选择 `ftp over tls` 或 `ftp over ssl(主动被动均可)`。这一点很灵活，反正都是加密传输。:monkey: