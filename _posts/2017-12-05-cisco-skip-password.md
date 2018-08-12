---
layout: article
title: 思科设备跳密码登录
key: 2017-12-05
tags: cisco
categories: mdcn
date: 2017-12-05 10:07:37
modify_date: 2017-12-05 16:47:56
---

cisco设备忘记登录密码，使用Console线连接设备，执行以下步骤

<!--more-->

### Cisco Router跳密码

1. 重启，在60秒内按`Ctrl + Break`键，进入`Rom Monitor`。

2. 依次执行`confreg 0x2142`、`reset`

   ```sh
   Rommon 1>confreg 0x2142
   Rommon 2>reset
   ```

3. 重启，执行：

   ```sh
   router#copy startup-config running-config
   ```

4. 修改或删除口令

   ```sh
   # 修改密码
   router(config)#enable password <PASSWORD>
   ```

5. 将配置注册号改回初始值

   ```sh
   router(config)#config-register 0x2102
   ```

6. 保存配置

7. 重启


### 模拟工具

> Cisco 设备模拟器：`Cisco Packet Tracer Student`

### Cisco Switch跳密码

1. 断电，按住`mode`键，接通电源，30秒后松手。进入底层OS。`Switch:`

2. ```sh
   Switch:flash_init
   ```

3. ```sh
   Switch:dir flash:
   PS: config.text
   ```

4. ```sh
   Switch:rename flash:config.text flash:config.xx
   # 交换机启动时加载.text文件作为运行配置
   ```

5. ```sh
   Switch:boot # 重启
   ```

6. ```sh
   Switch#rename flash:config.xx flash:config.text
   ```

7. ```sh
   Switch#copy flash:config.text system:running-config
   ```

8. 修改或删除口令，并保存配置

### 升级/更新IOS软件

> .../Day 1/Day 1下午/3-系统管理.ppt

### telnet操作

#### 会话挂起与恢复

telent到其他设备后，按`Ctrl+Shift+6`再按`X`即可挂起当前的telnet会话，并退回到原设备。

```sh
RouterX#show sesssions
# 查看会话
RouterX#resume 1
# 恢复会话1
RouterX#disconnect 1
# 中断会话 1
```

#### 当前设备vty用户连接查看与中断

``` sh
RouterX#show users
# 查看在线用户
RouterX#clear line 99 # 然后2次回车
# 清除会话
```

