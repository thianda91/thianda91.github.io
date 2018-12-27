---
layout: article
title: MariaDB用户管理
key: 2017-05-25
tags: mysql
categories: notes
created_date: 2017-05-25 22:03:15
date: 2017-05-25 22:03:15
---

### 创建用户

前置条件：必须拥有`globalCREATE USER privilege`或者MySQL 数据库的`INSERT privilege`。

<!--more-->

例：
```sql
MariaDB>create user user@host identified by 'password';
```

其中：
 
`user`为用户名。  
`host`为主机。可以使用`localhost`、`ip地址`或者`hostname`，使用`%`表示不限制主机。`user@host`构成一个唯一用户。  
`password`为密码。

### 修改用户

前置条件：alteruser语句需要具备修改账号的权限并且对mysql库有insert权限。

例：
```shell
MariaDB>set password for user@host = PASSWORD('password');
```

其中：user’@’host’为需要设置密码的用户，不写for user为设置当前用户的密码，PASSWORD及OLD_PASSWORD对后面的明文‘password’进行加密处理，或者直接输入加密后的密码，如’*23AE809DDACAF96AF0FD78ED04B6A265E05AA257’。

### 删除用户

例：

```sql
MariaDB >drop user user@host;
```

### 限制账户资源

对单个账户可以设置的资源限制有

1. 每小时查询次数
2. 每小时更新次数
3. 每小时连接次数
4. 同时在线的连接个数

对应：

```sql
GRANTOPTION
  | MAX_QUERIES_PER_HOUR count
  | MAX_UPDATES_PER_HOUR count
  | MAX_CONNECTIONS_PER_HOUR count
  | MAX_USER_CONNECTIONS count
```

例：

```sql
MariaDB > GRANT ALL ON *.* TO user@host
IDENTIFIEDBY 'password'
WITHMAX_QUERIES_PER_HOUR 20
MAX_UPDATES_PER_HOUR 10
MAX_CONNECTIONS_PER_HOUR 5
MAX_USER_CONNECTIONS 2;
```

当账户的限制非0时则会给资源使用计数。Server运行时给每个账户的使用资源计数，如果达到了连接次数限制则下一个连接将会被拒绝。同样地若达到了查询、修改等次数限制则会产生一个error信息。

每个账户各自进行资源计数而不是针对客户端。可以全局重置当前的每小时使用的资源计数，也可以针对指定的账户重置计数：

1. 将所有账户计数器清零使用FLUSH USER_RESOURCES语句。重新加载权限表语句也会清零计数器（FLUSH PRIVILEGES或mysqladmin reload命令）
2. 给特定账户清零计数器使用GRANT USAGE语句指定一个与原来一样的限制次数

计数器清零对于max_user_connections无效，系统重启会将所有的计数器清零。

### 用户管理表user

用户信息存储在系统表mysql.user中，可以通过对user表的增删改查来实现对用户的管理。

User表字段及其含义：

| 字段名                 | 含义                                       |
| ---------------------- | :--------------------------------------- |
| Host                   | 表示容许该用户连接的客户端限制，取值有：’localhost’、IP地址、域名、’%’；其中%表示不限制 |
| User                   | 用户名                                      |
| Password               | 加密后的密码                                   |
| Select_priv            | 确定用户是否可以通过SELECT命令                       |
| Insert_priv            | 确定用户是否可以通过INSERT命令插入数据                   |
| Update_priv            | 确定用户是否可以通过UPDATE命令修改现有数据                 |
| Delete_priv            | 确定用户是否可以通过DELETE命令删除现有数据                 |
| Create_priv            | 确定用户是否可以创建新的数据库和表                        |
| Drop_priv              | 确定用户是否可以删除现有数据库和表                        |
| Reload_priv            | 确定用户是否可以执行刷新和重新加载MySQL所用各种内部缓存的特定命令，包括日志、权限、主机、查询和表。 |
| Shutdown_priv          | 确定用户是否可以关闭MySQL服务器。在将此权限提供给root账户之外的任何用户时，都应当非常谨慎 |
| Process_priv           | 确定用户是否可以通过SHOW PROCESSLIST命令查看其他用户的进程    |
| File_priv              | 确定用户是否可以执行SELECT INTO OUTFILE和LOAD DATA INFILE命令 |
| Grant_priv             | 确定用户是否可以将已经授予给该用户自己的权限再授予其他用户。例如，如果用户可以插入、选择和删除foo数据库中的信息，并且授予了GRANT权限，则该用户就可以将其任何或全部权限授予系统中的任何其他用户 |
| References_priv        | 目前只是某些未来功能的占位符；现在没有作用                    |
| Index_priv             | 确定用户是否可以创建和删除表索引                         |
| Alter_priv             | 确定用户是否可以重命名和修改表结构                        |
| Show_db_priv           | 确定用户是否可以查看服务器上所有数据库的名字，包括用户拥有足够访问权限的数据库。 |
| Super_priv             | 确定用户是否可以执行某些强大的管理功能，例如通过KILL命令删除用户进程，使用SET GLOBAL修改全局MySQL变量，执行关于复制和日志的各种命令。 |
| Create_tmp_table_priv  | 确定用户是否可以创建临时表                            |
| Lock_tables_priv       | 确定用户是否可以使用LOCK TABLES命令阻止对表的             |
| Execute_priv           | 确定用户是否可以执行存储过程。                          |
| Repl_slave_priv        | 确定用户是否可以读取用于维护复制数据库环境的二进                 |
| Repl_client_priv       | 确定用户是否可以确定复制从服务器和主服务器的位置                 |
| Create_view_priv       | 确定用户是否可以创建视图                             |
| Show_view_priv         | 确定用户是否可以查看视图或了解视图如何执行                    |
| Create_routine_priv    | 确定用户是否可以更改或放弃存储过程和函数                     |
| Alter_routine_priv     | 确定用户是否可以修改或删除存储函数及函数                     |
| Create_user_priv       | 确定用户是否可以执行CREATE USER命令                  |
| Event_priv             | 确定用户能否创建、修改和删除事件                         |
| Trigger_priv           | 确定用户能否创建和删除触发器                           |
| Create_tablespace_priv | 确定用户能否创建表空间                              |
| ssl_type               |                                          |
| ssl_cipher             |                                          |
| x509_issuer            |                                          |
| x509_subject           |                                          |
| max_questions          | 每小时可执行的查询命令                              |
| max_updates            | 每小时可执行的更新命令                              |
| max_connections        | 每小时的容许用户的最多连接次数                          |
| max_user_connections   | 每小时容许用户最大连接客户端个数                         |
| Plugin                 |                                          |
| authentication_string  | 认证字符串                                    |
| password_expired       | 密码是否已过期                                  |
| is_role                | 是否为角色                                    |
