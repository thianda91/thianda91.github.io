---
layout: article
title: Apache+tomcat的整合
key: 2016-05-19
tags: apache
categories: apache
created_date: 2016-05-19 12:26
date: 2016-05-19 12:26
---

为什么要做这个整合呢？当然，首先想到是就是Apache和Tomcat的区别。正因为有区别，有各自的优缺点才需要整合，取二者所长，弃二者所短。

<!--more-->

*原文地址：http://blog.csdn.net/stefyue/article/details/6918542*

Apache和Tomcat都可以在他们的官网下载: http://www.apache.org

那么首先就来说下Apache和Tomcat的区别:

Apache只是一个Web服务器，可以作为独立的web服务器来运行，不过只支持静态网页，如(asp,php,cgi,jsp)等动态网页的就显得无能为力。

Tomcat也可以作为独立的web服务器来运行。但Tomcat也是应用（Java）服务器，它只是一个Servlet容器。

由于Apache解释静态页面要比tomcat快速而且稳定， 基于以上原因，一个现实的网站使用一个Apache作为Web服务器，为网站的静态页面请求提供服务；

并使用Tomcat服务器作为一个Servlet/JSP插件，显示网站的动态页面；


Apache+Tomcat整合的好处:

1. Apache主要用来解析静态文本,如html，tomcat虽然也有此功能，但apache能大大提高效率，对于并发数较大的企业级应用，能更好的显示apache的高效率；

2. Tomcat用来解析jsp,servlet等,所有的客户请求首先会发送到Apache，如果请求是静态文本则由apache解析，并把结果返回给客户端，如果是动态的请求，如jsp，apache会把解析工作交给tomcat，由tomcat进行解析（这首先要两者现实整合），tomcat解析完成后，结果仍是通过apache返回给客户端，这样就可以达到分工合作,实现负载均衡，提高系统的性能！而且因为JSP是服务器端解释代码的，这样整合可以减少Tomcat的服务开销。


## 0.Apache+Tomcat整合的原理

作为Apache下面的子项目，Tomcat 与 Apache之间有着天然的联系。在实际操作中，主要是Apache作为主服务器运行，当监听到有jsp或者servlet的请求时，将请求转发给tomcat服务器，由tomcat服务器进行解析后，发回apache，再由apache发回用户。

在tomcat中有两个监听的端口，一个是8080用于提供web服务,一个是8009用于监听来自于apache的请求。当apache收到jsp或者servlet请求时，就向tomcat 的8009端口发送请求，交由tomcat处理后，再返回给apache，由apache返回给客户。

Apache+Tomcat整合的步骤(结合我自己的情况，为大家解说一下整合的过程)

## 1.准备工作:

下载Apache (我下载的是apache-2.2.21)：(http://labs.renren.com/apache-mirror//httpd/httpd-2.2.21-win32-src.zip)

下载Tomcat (我下载的是tomcat-6.0) : (http://labs.renren.com/apache-mirror/tomcat/tomcat-6/v6.0.33/bin/apache-tomcat-6.0.33.zip)

下载JDK (我下载的是JDK5.0): (http://download.oracle.com/otn-pub/java/jdk/1.5.0_21//jdk-1_5_0_21-windows-i586-p.exe)

下载windows版本的mod_jk connector，这个是链接apache和tomcat的桥。是Apache接受到jsp或servlet时能将请求转发到tomcat。提别需要注意的是，下载的JK需要和你的apache版本相符合。请到 http://www.apache.org/dist/tomcat/tomcat-connectors/jk/binaries/ 下载和自己apache版本符合的JK.。

## 2.软件的安装

软件的安装顺序可以适当调整，但是JDK(JRE)一定要在Tomcat之前安装。安装JK：把 mod_jk.so 拷贝到 D:\Program Files\Apache2.2\modules 下(这是我的Apache安装目录)。至于其他软件的安装过程我便省略了。


## 3.服务器的配置

### 配置Tomcat：

1)bin\startup.bat:

```ini
set CATALINA_BASE = D:\Program Files\tomcat
set CATALINA_HOME = D:\Program Files\tomcat
set CLASSPATH = %CLASSPATH %;%CATALINA_HOME%\lib\servlet-api.jar
```

2) 在tomcat的conf目录下建一个workers.properties的文本文件，添加如下配置

### 让mod_jk模块知道Tomcat的安装路径 

```ini
workers.tomcat_home=D:\tools\apache-tomcat-6.0.32
```

### 让mod_jk模块知道jre的位置

```ini
workers.java_home=C:\Program Files\Java\jre1.5.0_18
ps=\
```

### 模块版本,这里是关键，名字要和httpd.conf的一致。如果这里改了httpd.conf也要改。

```ini
worker.list=ajp13
```

### 工作端口,tomcat的jk监听端口，可以查看Server.xml中有port="8009" 

```ini
worker.ajp13.port=8009 
```

### Tomcat所在机器，如果安装在与apache不同的机器则需要设置IP

```ini
worker.ajp13.host=localhost
```

### 通讯协议类型，好像不能改，会出问题 

```ini
worker.ajp13.type=ajp13 
```

### 负载平衡因子

```ini
worker.ajp13.lbfactor=1
```

3)tomcat的conf目录下，修改文件server.xml。配置在<host></host>中间加入以下语句以修改其默认的目录：

```
<Context path="" docBase="E:\wwwroot" reloadable="true" crossContext="true"/>
```

### 配置Apache：打开D:\Program Files\Apache2.2\conf下的httpd.conf。

1)在最后加入下面这段代码
```

### 此处mod_jk的文件为你下载的文件

​```ini
LoadModule jk_module modules/mod_jk.so
```

### 指定tomcat监听配置文件地址

```ini
JkWorkersFile "D:\tools\apache-tomcat-6.0.32\conf\workers.properties"
```

### 指定日志存放位置;以及日志级别

```ini
JkLogFile "D:\tools\apache-tomcat-6.0.32\logs\mod_jk2.log" 
JkLogLevel info
```

### add mod_jk(tomcat) end

### 让Apache支持对servlet传送，用以Tomcat解析

```ini
JkMount /servlet/* ajp13 
```

### 让Apache支持对jsp传送，用以Tomcat解析

```ini
JkMount /*.jsp ajp13 
```

### 让Apache支持对.do传送，用以Tomcat解析

```ini
JkMount /*.do ajp13 
```

2)此外需要修改文件中的相关配置。(可以在文件中找到原有的配置)

### 站点项目所在路径，应与tomcat中的目录设置相同，据说以上两个必须同时设置才可以生效，没有试过不同的时候会有什么情况

```ini
ServerName localhost
DocumentRoot "E:/wwwroot"
<Directory "E:/wwwroot">
DirectoryIndex index.html index.htm index.jsp
```

## 4.修改完所有的配置，那么现在可以重新启动Apache和Tomcat.

在地址栏中分别输入http://localhost/，与http://localhost:8080/若结果相同,Apache与Tomcat整合成功


希望此文能够对大家有所帮助。

============================补充的说明============================

> 1 Apache 做为 HttpServer，后面连接多个 tomcat 应用实例，并进行负载均衡。
> 2 为系统设定 Session 超时时间，包括 Apache 和 tomcat
> 3 为系统屏蔽文件列表，包括 Apache 和 tomcat 注：本例程以一台机器为例子，即同一台机器上装一个apache和4个Tomcat。Apache在前面最为http转发的“关口”，然后将访问负载均衡到后面的Tomcat服务器集群，这样就实现了负载均衡。加之客户端缓存(Cookie)和服务器端缓存(Session)。然后注意一些其他编程习惯和算法的应用。你的Web系统的整体性能就会得到比较好的保障。