---
layout:       article
title:        win7 远程桌面时开启 aero 主题
key:          2019-03-21
tags:         notes
categories:   system
created_date: 2019-03-21 00:23:21
date:         2019-03-21 00:34:18
---

 win7 远程桌面时开启 aero 主题的方法。

<!--more-->

**什么版本的远程桌面连接上可以启用AERO？**

<https://social.technet.microsoft.com/Forums/en-US/753eccfd-b532-4579-8919-e6d028cb387a/20160200402925626412303403682831243267003875436830255091997821?forum=window7betacn>

win7 的 RDP 为 RDP7.1，需要升级到 RDP8.0 以上。

**查看版本**

打开远程桌面程序（mstsc），点击左上角图标，选择”关于“，即可看到版本信息。

**先安装这个（KB2574819）**：<https://www.microsoft.com/zh-cn/download/details.aspx?id=35388>

“组合套餐“：<https://www.microsoft.com/zh-cn/download/details.aspx?id=40986>

> 包含
>
> 01 KB2574819
> 02 KB2857650 
> 03 KB2830477  已经更新到rdp8.1
> 04 KB2913751

**RDP8.0（KB2592687）下载**：<https://www.microsoft.com/zh-cn/download/details.aspx?id=35387>。

下载后运行补丁程序若出现`此更新不适用于您的计算机`，则采取下面的操作：

```sh
# 解压补丁
expand –F:* D:\init\Windows6.1-KB2592687-x64.msu D:\init\www
# 使用 dism
dism.exe /online /Add-Package /PackagePath:D:\init\www\Windows6.1-KB2592687-x64.cab
# 注意修改对应的目录及文件名
```

安装补丁后需要重启，重启后需要修改组策略（gpedit.msc）。

开始运行：gpedit.msc，打开路径到：计算机配置\管理模板\Windows 组件\远程桌面服务\远程桌面会话主机\远程会话环境。配置“启用远程桌面协议8.0“和”配置RemoteFX“。配置后重启以生效