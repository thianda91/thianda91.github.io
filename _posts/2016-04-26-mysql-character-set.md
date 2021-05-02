---
layout: article
title: MySQL字符集 GBK、GB2312、UTF8区别 解决 MYSQL中文乱码问题
key: 2016-04-26
tags: mysql
categories: database
created_date: 2016-04-26 22:32
date: 2016-04-26 22:32
---


MySQL中涉及的几个字符集

```
character-set-server/default-character-set：服务器字符集，默认情况下所采用的。
character-set-database：数据库字符集。
character-set-table：数据库表字符集。
优先级依次增加。所以一般情况下只需要设置character-set-server，而在创建数据库和表时不特别指定字符集，这样统一采用character-set-server字符集。
character-set-client：客户端的字符集。客户端默认字符集。当客户端向服务器发送请求时，请求以该字符集进行编码。
character-set-results：结果字符集。服务器向客户端返回结果或者信息时，结果以该字符集进行编码。
在客户端，如果没有定义character-set-results，则采用character-set-client字符集作为默认的字符集。所以只需要设置character-set-client字符集。
```

<!--more-->

> 转自：http://blog.csdn.net/zsm653983/article/details/7970179 本篇自己留存用

要处理中文，则可以将`character-set-server`和`character-set-client`均设置为`GB2312`，如果要同时处理多国语言，则设置为`UTF8`。

关于MySQL的中文问题

解决乱码的方法是，在执行SQL语句之前，将MySQL以下三个系统参数设置为与服务器字符集character-set-server相同的字符集。
character_set_client：客户端的字符集。
character_set_results：结果字符集。
character_set_connection：连接字符集。
设置这三个系统参数通过向MySQL发送语句：set names gb2312

### 关于GBK、GB2312、UTF8

UTF-8：Unicode Transformation Format-8bit，允许含BOM，但通常不含BOM。是用以解决国际上字符的一种多字节编码，它对英文使用8位（即一个字节），中文使用24为（三个字节）来编码。UTF-8包含全世界所有国家需要用到的字符，是国际编码，通用性强。UTF-8编码的文字可以在各国支持UTF8字符集的浏览器上显示。如，如果是UTF8编码，则在外国人的英文IE上也能显示中文，他们无需下载IE的中文语言支持包。

GBK是国家标准GB2312基础上扩容后兼容GB2312的标准。GBK的文字编码是用双字节来表示的，即不论中、英文字符均使用双字节来表示，为了区分中文，将其最高位都设定成1。GBK包含全部中文字符，是国家编码，通用性比UTF8差，不过UTF8占用的数据库比GBK大。

GBK、GB2312等与UTF8之间都必须通过Unicode编码才能相互转换：

```ini
GBK、GB2312－－Unicode－－UTF8
UTF8－－Unicode－－GBK、GB2312
```

对于一个网站、论坛来说，如果英文字符较多，则建议使用UTF－8节省空间。不过现在很多论坛的插件一般只支持GBK。

GB2312是GBK的子集，GBK是GB18030的子集
GBK是包括中日韩字符的大字符集合
如果是中文的网站 推荐GB2312 GBK有时还是有点问题
为了避免所有乱码问题，应该采用UTF-8，将来要支持国际化也非常方便
UTF-8可以看作是大字符集，它包含了大部分文字的编码。
使用UTF-8的一个好处是其他地区的用户（如香港台湾）无需安装简体中文支持就能正常观看你的文字而不会出现乱码。

gb2312是简体中文的码
gbk支持简体中文及繁体中文
big5支持繁体中文
utf-8支持几乎所有字符

首先分析乱码的情况

2.查询结果以乱码返回
究竟在发生乱码时是哪一种情况呢？
我们先在mysql 命令行下输入
show variables like '%char%';
查看mysql 字符集设置情况:
```sql
mysql> show variables like '%char%';
+--------------------------+----------------------------------------+
| Variable_name            | Value                                  |
+--------------------------+----------------------------------------+
| character_set_client     | gbk                                    | 
| character_set_connection | gbk                                    | 
| character_set_database   | gbk                                    | 
| character_set_filesystem | binary                                 | 
| character_set_results    | gbk                                    | 
| character_set_server     | gbk                                    | 
| character_set_system     | utf8                                   | 
      | /usr/local/mysql/share/mysql/charsets/ | 
+--------------------------+----------------------------------------+
```

> 在查询结果中可以看到mysql 数据库系统中客户端、数据库连接、数据库、文件系统、查询结果、服务器、系统的字符集设置在这里，文件系统字符集是固定的，系统、服务器的字符集在安装时确定，与乱码问题无关。乱码的问题与客户端、数据库连接、数据库、查询结果的字符集设置有关。

*注：客户端是看访问mysql 数据库的方式，通过命令行访问，命令行窗口就是客户端，通过JDBC 等连接访问，程序就是客户端我们在向mysql 写入中文数据时，在客户端、数据库连接、写入数据库时分别要进行编码转换。在执行查询时，在返回结果、数据库连接、客户端分别进行编码转换。现在我们应该清楚，乱码发生在数据库、客户端、查询结果以及数据库连接这其中一个或多
个环节
接下来我们来解决这个问题
在登录数据库时，我们用mysql --default-character-set=字符集-u root -p 进行连接，这时我们
再用show variables like '%char%';命令查看字符集设置情况，可以发现客户端、数据库连接、
查询结果的字符集已经设置成登录时选择的字符集了
注：当在my.ini文件中设置以下编码时，（需要重启）

```ini
[client]

port=3306

[mysql]

default-character-set=utf8
```

相应地下面三个字符编码就会改变（如果是已经登录了，可以使用set names 字符集;命令来实现上述效果，等同于下面的命令：但是只是暂时的，在my.ini里设置的才是永久性的）

```ini
set character_set_client = 字符集
set character_set_connection = 字符集
set character_set_results = 字符集
```

如果是通过JDBC 连接数据库，可以这样写URL：
`URL=jdbc:mysql://localhost:3306/abs?useUnicode=true&characterEncoding=字符集`

JSP 页面等终端也要设置相应的字符集

数据库的字符集可以修改mysql 的启动配置来指定字符集，也可以在create database 时加上default character set 字符集来强制设置database 的字符集，
通过这样的设置，整个数据写入读出流程中都统一了字符集，就不会出现乱码了

为什么从命令行直接写入中文不设置也不会出现乱码？

可以明确的是从命令行下，客户端、数据库连接、查询结果的字符集设置没有变化，
输入的中文经过一系列转码又转回初始的字符集，我们查看到的当然不是乱码，
但这并不代表中文在数据库里被正确作为中文字符存储。

举例来说，现在有一个utf8 编码数据库，客户端连接使用GBK 编码，connection 使用默认的ISO8859-1（也就是mysql 中的latin1），
我们在客户端发送"中文"这个字符串，客户端将发送一串GBK 格式的二进制码给connection 层，connection 层以ISO8859-1 格式将这段二进制码发送给数据库，
数据库将这段编码以utf8 格式存储下来，我们将这个字段以utf8格式读取出来，肯定是得到乱码，也就是说中文数据在写入数据库时是以乱码形式存储的，
在同一个客户端进行查询操作时，做了一套和写入时相反的操作，错误的utf8 格式二进制码又被转换成正确的GBK 码并正确显示出来。

 

这几天查找了很多关于mysql对中文字符编码的处理，读了各种零散的文章，最后做了全面的总结，现和大家分享：

字符编码

MySQL字符编码 GBK、GB2312、UTF8区别:http://kongjian.baidu.com/wangzhe1945/blog/item/4a69226d4a095cf0421694e1.html

1.系统编码

>show variables like '%character%';  

`mysql> show variables like '%collation%';`

改变系统编码：修改my.ini中默认的编码选项[mysqld]下添加default-charcter-set=utf8  mysql 5.5以上版本换成了character-set-server=utf8 重新启动mysql
命令形式   mysql> SET NAMES 'utf8'; 重新启动mysql的时候所有的设置将失效

在my.ini文件中加入character-set-server=utf8 这样就能设置服务器编码了。

```ini
[mysqld]

# The TCP/IP Port the MySQL Server will listen on
port=3306
 
#Path to installation directory. All paths are usually resolved relative to this.
basedir="C:/Program Files/MySQL/MySQL Server 5.0/"

#Path to the database root
datadir="C:/Program Files/MySQL/MySQL Server 5.0/Data/"
character-set-server=utf8
```

2.数据库编码

查看数据库编码： `mysql> show create database db_name；`
修改数据库编码：

```mysql
mysql> ALTER DATABASE db_name ####这里修改整个数据库的编码`
 CHARACTER SET utf8
                    DEFAULT CHARACTER SET utf8
                    COLLATE utf8_general_ci
                    DEFAULT COLLATE utf8_general_ci;
```

在在建数据库的时候指定编码:
```mysql
mysql> CREATE DATABASE db_name
               CHARACTER SET utf8
               DEFAULT CHARACTER SET utf8
               COLLATE utf8_general_ci
               DEFAULT COLLATE utf8_general_ci ;
```

3.数据库表和字段编码

查看数据库表和字段编码： 

```mysql
mysql> show create table table_name；
ALTER TABLE table_name DEFAULT CHARACTER SET utf8;
```

修改字段编码：
```mysql
mysql> ALTER TABLE `table_name` CHANGE `dd` `dd` VARCHAR( 45 ) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL             #该命令就是将MYSQL数据库table_name表中 dd的字段编码改为utf8
```

4.命令行下插入汉字时指定编码：

```mysql
mysql> set names utf8;
```

有时候这一句很关键！

```mysql
mysql> insert into test(name) values('王东伟');
```

总之，不管采用那一种编码方式，只要做到完全统一将能达到相应的效果。 (注：mysql 需要根据客户端编码来编码相应的结果集，也就是说，客户端工具是什么编码，那么设置时，也应该用什么编码，这样在插入中文字符时就不会出现乱码或插入不进去的情况。详情请看下一篇《MySQL 中文显示乱码 》。）