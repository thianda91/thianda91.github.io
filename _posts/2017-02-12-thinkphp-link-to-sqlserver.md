---
layout: post
title: thinkphp5.0.6 连接SQLServer2008r2 配置总结
key: 2017-02-12
tags: thinkphp 
categories: notes
date: 2017-02-12 19:42
modify_date: 2017-02-12 19:42
---

### thinkphp连接SQLServer2008数据库配置

本人使用的环境是Windows 2008 x64位系统，安装了IIS7.0，自己搭建了xampp，内含Apache2.4，PHP5.6.21，MySQL(10.1.13-MariaDB)。我只使用了IIS配合php，使用thinkphp5.0.6搭建的网站，原本使用的MySQL数据库，现在需要连接SQLServer2008读写一些数据。网上找了大量的资料并实践，现总结一下。

<!--more-->

> PHP连接MSSQL2008/2005数据库与以往的连接mssql2000是不一样的，连接mssql2008/2005是需要自己添加PHP对MSSQL连接的驱动扩展了，而我们常用的hp.ini中的extension=php_mssql.dll扩展只适用连接于MSSQL2000哦

### 下载一个SQL Server Driver for PHP

这是一个扩展包，我是在这里下载的 <http://www.microsoft.com/en-us/download/details.aspx?id=20098>   
根据你的php版本选择对应的安装包。由于我的PHP版本是5.6，所以我下载的是	
SQLSRV32.EXE, 运行后选择解压目录为 xampp/php/ext/ 
打开该目录，里面出现了

```ini
php_pdo_sqlsrv_52_nts.dll
php_pdo_sqlsrv_52_ts.dll
php_pdo_sqlsrv_53_nts_vc6.dll
php_pdo_sqlsrv_53_nts_vc9.dll
php_pdo_sqlsrv_53_ts_vc6.dll
php_pdo_sqlsrv_53_ts_vc9.dll
php_sqlsrv_52_nts.dll
php_sqlsrv_52_ts.dll
php_sqlsrv_53_nts_vc6.dll
php_sqlsrv_53_nts_vc9.dll
php_sqlsrv_53_ts_vc6.dll
php_sqlsrv_53_ts_vc9.dll
SQLServerDriverForPHP.chm（手册，英文够好可以看看）
SQLServerDriverForPHP_License.rtf
SQLServerDriverForPHP_Readme.htm（自述文件）
等等。。。
```

### 配置php.ini

（1）在php.ini中添加如下两条扩展：

```ini
extension=php_sqlsrv_56_ts.dll
extension=php_pdo_sqlsrv_56_ts.dll
```

（2）将`;extension=php_pdo.dll`前面的;去掉，开启pdo连接扩展··

>（我猜这个dll是旧版本php需要配置的，我的5.6版本没有这个dll，我也没有添加这行配置，也配置成功了）

（3）重新启动apache或者IIS，我是直接结束掉了进程中的pgp-cgi.exe就实现了php配置刷新。
备注：不要用***_nts.dll的文件，这样就会失败

```ini
extension=php_sqlsrv_56_nts.dll
extension=php_pdo_sqlsrv_56_nts.dll
```

（4）这时候你在phpinfo()中的PDO配置中会看见已经存在sqlsrv了。

> 这里如果使用的php版本是64位的话，官网的 `php_sqlsrv_xx_ts.dll `和 `php_pdo_sqlsrv_xx.tl.dll` 不起作用，网友收集了对应的64位版本dll，请到
> http://pan.baidu.com/s/1kUCP7EJ
> 下载选择对应版本即可。

### 下载安装一个Microsoft® ODBC Driver 11 for SQL Server

<https://www.microsoft.com/download/details.aspx?id=36434>  

我不知道选择语言有什么用处。反正我安装的是简体中文。

>To access data in a SQL Server 2005 or later database using the Microsoft Drivers for PHP for SQL Server (SQL Server 2008 or later if using version 3.2 or 3.1), you must have the following components installed on your computer:

### 结语

配置的难点在于确定php版本以及SQL Server Driver for PHP的对应关系。
[查看Microsoft官网的介绍](https://docs.microsoft.com/en-us/sql/connect/php/system-requirements-for-the-php-sql-driver)

### 附录

SQLServer 查询当前配置的字符编码：

```sql
SELECT  COLLATIONPROPERTY('Chinese_PRC_Stroke_CI_AI_KS_WS', 'CodePage')
```

下面是查询结果对应表：

| 返回值   | 编码信息          |
| ----- | ------------- |
| 936   | 简体中文GBK       |
| 950   | 繁体中文BIG5      |
| 437   | 美国/加拿大英语      |
| 932   | 日文            |
| 949   | 韩文            |
| 866   | 俄文            |
| 65001 | unicode UFT-8 |

