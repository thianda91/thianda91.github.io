---
layout:       article
title:        自用 Tampermonkey 脚本整理
key:          2018-12-16
tags:         Tampermonkey
categories:   notes
date:         2018-07-09 10:56:23
modify_date:  2018-12-16 00:17:44
---

## 前言

[Tampermonkey](http://tampermonkey.net) 作为脚本管理器，可作为插件安装在众多主流浏览器上，并随着浏览器的账号同步安装到其他电脑上。但是`Tampermonkey`里安装的脚本不会随着浏览器账号而自动同步，需要自己手动同步。

Tampermonkey插件设置里的`实用工具`中支持导出到云、压缩包、文件。云支持`Google Drive `、`Dropbox`、`OneDrive`。可使用微软账户使用`OneDrive`来手动同步。但是这种使用第三方服务并且是手动的方式很不方便。基本想不起来备份。

在新电脑上，通常是想要用某个网站的时候搜索再安装，很是麻烦。记录此文，一键直达，为了方便自己在新的浏览器环境中安装下载。

## 自己收集并使用的脚本

### [Userscript+](https://greasyfork.org/zh-CN/scripts/24508)

自动发现合适脚本。如果没有安装脚本，用这个也算是便捷找脚本的方法吧。

### [AC-Baidu](https://greasyfork.org/zh-CN/scripts/14178)

优化百度、搜狗、谷歌搜索结果之重定向去除+去广告+favicon

### [弹窗阻止程序脚本](https://greasyfork.org/scripts/37654)

用于阻止所有类型弹窗的最有效用户脚本。为防范最狡猾的弹窗而设计，包括成人和流媒体网站上的弹窗。

### [网页限制解除(改)](https://greasyfork.org/zh-CN/scripts/28497)

通杀大部分网站,可以解除禁止复制、剪切、选择文本、右键菜单的限制。原作者cat73,因为和搜索跳转脚本冲突,遂进行了改动,改为黑名单制。

### [CSDN自动展开+去广告+净化剪贴板+免登陆](https://greasyfork.org/zh-CN/scripts/372452)

CSDN自动展开阅读，可以将剪贴板的推广信息去除，去除大多数广告。