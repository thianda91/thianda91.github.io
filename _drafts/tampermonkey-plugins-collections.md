---
layout:       post
title:        自用Tampermonkey脚本整理
key:          2018-07-09
tags:         Tampermonkey
categories:   notes
date:         2018-07-09 10:56:23
modify_date:  2018-07-09 10:56:29
---

## 前言

[Tampermonkey](http://tampermonkey.net) 作为脚本管理器，可作为插件安装在众多主流浏览器上，并随着浏览器的账号同步安装到其他电脑上。但是`Tampermonkey`里安装的脚本不会随着浏览器账号而自动同步，需要自己手动同步。

Tampermonkey插件设置里的`实用工具`中支持导出到云、压缩包、文件。云支持`Google Drive `、`Dropbox`、`OneDrive`。可使用微软账户使用`OneDrive`来手动同步。但是这种使用第三方服务并且是手动的方式很不方便。基本想不起来备份。

在新电脑上，通常是想要用某个网站的时候搜索再安装，很是麻烦。记录此文，一键直达，为了方便自己在新的浏览器环境中安装下载。

## 自己收集并使用的脚本

#### [Userscript+](https://greasyfork.org/zh-CN/scripts/24508-userscript-show-site-all-userjs)

自动发现合适脚本。如果没有安装脚本，用这个也算是便捷找脚本的方法吧。

#### [AC-Baidu](https://greasyfork.org/zh-CN/scripts/14178-ac-baidu-%E4%BC%98%E5%8C%96%E7%99%BE%E5%BA%A6-%E6%90%9C%E7%8B%97-%E8%B0%B7%E6%AD%8C%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E4%B9%8B%E9%87%8D%E5%AE%9A%E5%90%91%E5%8E%BB%E9%99%A4-%E5%8E%BB%E5%B9%BF%E5%91%8A-favicon)

优化百度、搜狗、谷歌搜索结果之重定向去除+去广告+favicon

#### [百度网盘直接下载助手改](https://greasyfork.org/scripts/35421)

#### [百度网盘直接下载助手修改版 ](https://greasyfork.org/scripts/39776)

功能如题

