---
layout:       article
title:        Python selenuim 自动测试工具搭建
key:          2019-01-05
tags:         notes
categories:   python
created_date: 2019-01-05 14:29:51
date:         2019-01-05 15:01:11
---

selenium 是自动测试的工具，用于 web 自动测试。本文记录一些工具和相关配置。

<!--more-->

## selenuim 用法

selenium 本身有多种语言的版本，这里仅用 Python 做测试。

支持的 Python 版本：Python 2.7, 3.4+

```sh
pip install -U selenium
```

selenium 官网 doc ：<https://selenium-python.readthedocs.io/>

## 浏览器驱动

selenuim 会调用本地的浏览器执行模拟操作。调用不同的浏览器需要对应的`驱动`。

在官网有列出各种浏览器的驱动下载地址：<https://www.seleniumhq.org/download/>

上面有驱动的版本与浏览器版本的对应关系：

[Mozilla GeckoDriver](https://github.com/mozilla/geckodriver/releases/)、[Google Chrome Driver](https://sites.google.com/a/chromium.org/chromedriver/)、[Microsoft Edge Driver](https://developer.microsoft.com/en-us/microsoft-edge/tools/webdriver/)。

最终的下载页面均来自：

|驱动|下载地址|备注|
|-|-|-|
|IEDriverServer|<http://selenium-release.storage.googleapis.com/index.html>||
|chromedriver|<http://chromedriver.storage.googleapis.com/index.html>||
|geckodriver|<https://github.com/mozilla/geckodriver/releases>||