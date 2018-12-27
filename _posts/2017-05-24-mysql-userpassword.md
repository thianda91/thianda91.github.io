---
layout: article
title: 详解MySQL的用户密码过期功能
key: 2017-05-24
tags: mysql
categories: notes
created_date: 2017-05-24 20:55:01
date: 2017-05-24 20:55:01
---

### 写在前面

wamp中的数据库为mysql，适用于本文的操作。
xampp中的数据库为MariaDB。请参考[MariaDB用户管理](/notes/mariadb-users-manage.html)

<!--more-->

---
在MySQL版本5.6.6版本起，添加了password_expired功能，它允许设置用户的过期时间。
这个特性已经添加到mysql.user数据表，但是它的默认值是”N”。可以使用ALTER USER语句来修改这个值。
下面是关于如何设置MySQL用户账号的到期日期一个简单例子：

```sql
mysql> ALTER USER 'testuser'@'localhost' PASSWORD EXPIRE;
```
一旦某个用户的这个选项设置为”Y”，那么这个用户还是可以登陆到MySQL服务器，但是在用户未设置新密码之前不能运行任何查询语句，而且会得到如下错误消息提示：

```sql
mysql> SHOW DATABASES;
ERROR 1820 (HY000): You must SET PASSWORD before executing this statement
Keep in mind that this does not affect any current connections the account has open.
```

当用户设置了新密码后，此用户的所有操作（根据用户自身的权限）会被允许执行：

```sql
mysql> SET PASSWORD=PASSWORD('mechipoderranen');
Query OK, 0 rows affected (0.00 sec)
mysql> SHOW DATABASES;
+--------------------+
| Database      |
+--------------------+
| information_schema |
| data        |
| logs        |
| mysql       |
| performance_schema |
| test        |
+--------------------+
6 rows in set (0.00 sec)
mysql>
```

DBA可以通过cron定时器任务来设置MySQL用户的密码过期时间。
从MySQL 5.7.4版开始，用户的密码过期时间这个特性得以改进，可以通过一个全局变量default_password_lifetime来设置密码过期的策略，此全局变量可以设置一个全局的自动密码过期策略。
用法示例： 
可以在MySQL的配置文件中设置一个默认值，这会使得所有MySQL用户的密码过期时间都为90天，MySQL会从启动时开始计算时间。my.cnf配置如下：

```ini
[mysqld]
default_password_lifetime=90
```

如果要设置密码永不过期的全局策略，可以这样：（注意这是默认值，配置文件中可以不声明）

```ini
[mysqld]
default_password_lifetime=0
```

在MySQL运行时可以使用超级权限修改此配置：

```sql
mysql> SET GLOBAL default_password_lifetime = 90;
Query OK, 0 rows affected (0.00 sec)
```

还可以使用ALTER USER命令为每个具体的用户账户单独设置特定的值，它会自动覆盖密码过期的全局策略。要注意ALTER USER语句的INTERVAL的单位是“天”。

```sql
ALTER USER ‘testuser'@‘localhost' PASSWORD EXPIRE INTERVAL 30 DAY;
```

禁用密码过期：

```sql
ALTER USER 'testuser'@'localhost' PASSWORD EXPIRE NEVER;
```

让用户使用默认的密码过期全局策略：

```sql
ALTER USER 'testuser'@'localhost' PASSWORD EXPIRE DEFAULT;
```

从MySQL 5.7.6版开始，还可以使用ALTER USER语句修改用户的密码：

```sql
mysql> ALTER USER USER() IDENTIFIED BY '637h1m27h36r33K';
Query OK, 0 rows affected (0.00 sec)
```

#### 后记
在MySQL 5.7.8版开始用户管理方面添加了锁定/解锁用户账户的新特性， related to user management is locking/unlocking user accounts when CREATE USER, or at a later time running the ALTER USER statement.
下面创建一个带账户锁的用户：

```sql
mysql> CREATE USER 'furrywall'@'localhost' IDENTIFIED BY '71m32ch4n6317' ACCOUNT LOCK;
Query OK, 0 rows affected (0.00 sec)
```

如下所示，新创建的用户在尝试登陆时会得到一个ERROR 3118错误消息提示：

```sql
$ mysql -ufurrywall -p
Enter password:
ERROR 3118 (HY000): Access denied for user 'furrywall'@'localhost'. Account is locked.
```

此时就需要使用ALTER USER … ACCOUNT UNLOCK语句进行解锁了：

```sql
mysql>ALTER USER 'furrywall'@'localhost' ACCOUNT UNLOCK;
Query OK, 0 rows affected (0.00 sec)
```

现在，这个用户已经解锁，可以登陆了：

```sql
$ mysql -u furrywall -p
Enter password:
Welcome to the MySQL monitor. Commands end with ; or g.
Your MySQL connection id is 17
Server version: 5.7.8-rc MySQL Community Server (GPL)
Copyright (c) 2000, 2015, Oracle and/or its affiliates. All rights reserved.
Oracle is a registered trademark of Oracle Corporation and/or its
affiliates. Other names may be trademarks of their respective
owners.
Type 'help;' or 'h' for help. Type 'c' to clear the current input statement.
mysql>
```

还可以这样锁定用户账户：

```sql
mysql> ALTER USER 'furrywall'@'localhost' ACCOUNT LOCK;
Query OK, 0 rows affected (0.00 sec)
```

以上就是为大家介绍的MySQL的用户密码过期功能的相关内容，希望对大家的学习有所帮助。
