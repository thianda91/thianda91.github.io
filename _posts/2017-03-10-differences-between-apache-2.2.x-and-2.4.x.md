---
layout: article
title: Apache2.4.x与Apache2.2.x的一些区别
key: 2017-03-10
tags: apache
categories: apache
created_date: 2017-03-10 01:06
date: 2017-03-10 01:06
---

 自己总结的一些配置区别

<!--more-->

简单对比，2.2.x常见配置格式如下

```ini
<VirtualHost *:80>
    DocumentRoot  "D:/www/Apache24/htdocs"
    ServerName localhost
    <Directory D:/www/Apache24/htdocs>
        DirectoryIndex index.html index.php
    Order Deny,Allow
    Allow from all
    </Directory>
</VirtualHost>
```
但是这样的配置在2.4.x下是不行的，应该将设置改成如下：
```ini
<VirtualHost *:80>
DocumentRoot "D:/www/sphinx/api"
ServerName www.mysphinx.com
<Directory "D:/www/sphinx/api">
Options FollowSymLinks Indexes
Require all granted
</Directory>
</VirtualHost>
```

这样就算大功告成了。


其中的一些指令已经无效，如：
```ini
Order Deny,Allow
Deny from all
Allow from al
```
取而代之的是：

```ini
Deny from all
```
变成
```ini
Require all denied
```

```ini
Allow from all
```
变成
```ini
Require all granted
```