---
layout:       article
title:        _h5ai 一个 php 目录列表程序
key:          2018-10-07
tags:         php
categories:   php
created_date: 2018-10-07 14:37:20 +08:00:00
date:         2018-10-07 14:59:54

---

_h5ai 一个 php 目录列表程序

<!--more-->

## _h5ai 简介

_h5ai 是一款比较好用的 php 目录浏览程序。由德国一个小哥 Lars Jung 主导开发。官网：<https://larsjung.de/h5ai/>

[下载](https://release.larsjung.de/h5ai/)及使用方法可参见官网。这里不再赘述。需要注意的是为了使子目录生效，配置时请使用绝对路径。

## 源码修改配置说明

1. 设置自己的 sha512: `\_h5ai\private\conf\options.json`中的`passhash`字段。

2. 默认为中文界面：`\_h5ai\private\conf\options.json`中搜索`l10n`并修改：

```json
"l10n": {
    "enabled": true,
    "lang": "zh-cn",
    "useBrowserLang": true
},
```

3. 设置访问密码：可将下面代码加入到：`\_h5ai\public\index.php`，然后在第一行，也就是【`<?php`】的下面（也就是第二行）插入`mima();`。

```php
function mima(){
    $user=array('[UserName]','[ThePassWord]');
    if(!($user[0]===$_SERVER['PHP_AUTH_USER'] && $user[1]===$_SERVER['PHP_AUTH_PW'])){
        header('WWW-Authenticate: Basic realm="[TITLE]"');
        header('HTTP/1.1 401 Unauthorized');
        die("please login");
	}
} 
```

`[UserName]、[ThePassWord]、[TITLE]`可自行修改。