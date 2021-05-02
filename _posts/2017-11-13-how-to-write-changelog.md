---
layout: article
title: 如何记录开发项目的更新日志
key: 2017-11-13
created_date: 2017-11-13 11:43:39
tags: git
categories: coding
date: 2018-08-10 16:58:49
---

开发项目写代码，离不开版本发布。如何记录更新历史高效简洁，将是本文所表达的。

<!--more-->

## CHANGELOG.md

在项目的根目录下，新建文件`CHANGELOG.md`，然后根据时间倒序记录更新历史。即最新的版本更新记录写在最前面。

{% highlight markdown %}
#### v1.1.0 (2017-11-13)

- 【增强】 新增xxx
- 【优化】 修改xxx/移动xxx/xxx更名
- 【修复】 select为null的异常问题 (#21)

#### v1.0.2 (2017-11-01)

- 【增强】xxx
- 【优化】xxx
- 【修复】xxx

详情参考

- [3c7723e](https://github.com/thianda/thianda.github.io/commit/3c7723e) update some posts  (#ISSUE_ID)

#### v0.1.0 (2015-10-27)

初始发布

- Initial release
{% endhighlight %}


以上为例子，可以看出其特点。书写规范是本人仿的[weui](https://github.com/Tencent/weui/blob/master/CHANGELOG.md)。  
其实规范并不是一成不变，满足需求，适合自己的习惯即可。

## github release

在github的repository中，可以发布一个release。

点击`Create a new release`，输入Tag version，Release title，Description，在文本框中可以上传添加图片等文件，在下方还可以上传添加二进制文件。

点击`Publish release`按钮，发布后如下：

![release截图](/statics/images/how-to-write-changelog/release.png)

图片直接显示在`description`中，`docx`等文件显示为链接，而二进制文件则显示在版本发布的`download`下。

## 一点儿建议

开发时将每次提交的变化记录在`CHANGELOG.md`中，积累到一定程度，在发布版本的时候将`CHANGELOG.md`的内容合并为一个release书写，然后在github上发布release。

## 用途

为开发做总结，留下里程碑，方便外人查看。

