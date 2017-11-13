---
layout: post
title: PHP中获取当前页面的完整URL
key: 2016-05-18
tags: php
categories: notes
date: 2016-05-18 23:54
modify_date: 2016-05-18 23:54
---

假设我们当前的测试网址是: http://localhost/blog/testurl.php?id=5

<!--more-->

```php
//获取域名或主机地址 
echo $_SERVER['HTTP_HOST']."<br>"; #localhost

//获取网页地址 
echo $_SERVER['PHP_SELF']."<br>"; #/blog/testurl.php

//获取网址参数 
echo $_SERVER["QUERY_STRING"]."<br>"; #id=5

//获取用户代理 
echo $_SERVER['HTTP_REFERER']."<br>"; 

//获取完整的url
echo $_SERVER["REQUEST_SCHEME"].'://'.$_SERVER['HTTP_HOST'].$_SERVER['REQUEST_URI'];
echo $_SERVER["REQUEST_SCHEME"].'://'.$_SERVER['HTTP_HOST'].$_SERVER['PHP_SELF'].'?'.$_SERVER['QUERY_STRING'];
#http://localhost/blog/testurl.php?id=5

//包含端口号的完整url
echo $_SERVER["REQUEST_SCHEME"].'://'.$_SERVER['SERVER_NAME'].':'.$_SERVER["SERVER_PORT"].$_SERVER["REQUEST_URI"]; 
#http://localhost:80/blog/testurl.php?id=5

//只取路径
$url='http://'.$_SERVER['SERVER_NAME'].$_SERVER["REQUEST_URI"]; 
echo dirname($url);
#http://localhost/blog
```
