---
layout: article
title: ThinkPHP在IIS下配置ISAPI伪静态去掉index.php
key: 2016-08-25
tags: thinkphp
categories: notes
date: 2016-08-25 22:19
modify_date: 2018-01-25 00:40:31
---

### rewrite语句

关于去掉index.php的方法，网上很多给出配置甚至官网给出的配置都有个问题，无法排除Public、Uploads等静态文件的路径，一股脑全都转交给`index.php`处理了，导致图片、CSS、JS都读取不到。（当然也有可能是服务器使用的ISAPI版本不一样，反正我用的ISAPI3.1是没有成功过）

<!--more-->

后来我参考了别人用的CI框架的重写规则，立马就解决了，具体如下：

```ini
RewriteRule /(?:index\.php|admin\.php|robots\.txt|favicon\.ico|Uploads|Public)/(.*) $0 [I,L]
```

### ISAPI_Rewrite 的使用方法

以下载本网站的破解版为例：将下载的`ISAPI_Rewrite3`解压，你会看到两个文件(分别是：ISAPI_Rewrite.dll 和httpd.conf)；把整个文件夹解压到安装在`C:\Program Files\ISAPI_Rewrite\`下

打开安装目录下的httpd.conf文件，在里面输入以下内容并保存，这样就没有使用天数的限制了
```ini
RegistrationName= wlqcwin
RegistrationCode= 2EAD-35GH-66NN-ZYBA
```
### IIS伪静态配置方法

我们打开Internet 信息服务(IIS)管理器，找到"网站"，右键打开"属性"选项卡;

选择"ISAPI 筛选器"选项卡，点击"添加"，弹出"添加/编辑筛选器属性"，"筛选器名称"写上`ISAPI_Rewrite`，这个可以自定义;"可执行文件"这里，通 过"浏览"找到伪静态组件安装目录下的`ISAPI_Rewrite.dll`文件即可，路径是`C:\Program Files\ISAPI_Rewrite\ISAPI_Rewrite.dll`

一路确定之后，我们重启下IIS管理器，之后再次打开网站属性的*"ISAPI 筛选器"*，看下是不是刚刚添加的`ISAPI_Rewrite`变为绿色向上的箭头呢?这样的话伪静态就配置成功了。

#### Windows2008的IIS 7.5

支持ISAPI_Rewrite的dll配置，即无需配置web.conf，直接在ISAPI筛选器添加ISAPI_Rewrite.dll，确保web根目录下有.htaccess文件即可。

#### Windows2012的IIS 8.5

不支持ISAPI_Rewrite的dll配置，需要安装rewrite模块。然后导入.htaccess文件即可
下载 Microsoft Web 平台安装程序： https://www.microsoft.com/web/downloads/

> .htaccess 支持目录级控制，
>
> 而web.config的rewrite目录控制异常，使用后无法正常访问esweb项目



