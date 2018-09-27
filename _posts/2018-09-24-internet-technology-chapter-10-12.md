---
layout:       article
title:        互联网技术 第十、十一、十二章
key:          2018-09-24
tags:         internet
categories:   internet
date:         2018-09-24 13:00:53 +08:00:00
modify_date:  2018-09-27 14:56:48
---

《互联网技术》教材 内容节选

<!--more-->

## 第10章 云计算架构与应用

云计算（Cloud Computing）特征：

按需获得的自助服务、广泛的网络接入方式、资源的规模池化、快捷的弹性伸缩、可计量的服务。

服务模式

**SaaS**，Software as a Service，软件即服务。开发商将软件部署在自己的服务器，客户按订购的服务多少和时长支付费用，通过互联网蝴蝶服务。客户无需购买及部署软件，也无需维护，所有的数据都存储在服务器。

如 Office Online，在线 CRM。

**PaaS**，Platform as a Service，平台即服务。以服务的方式提供应用程序开发和部署平台。主要面对应用开发者，这种服务模式中，开发者不需要购买硬件和软件，利用 PaaS 平台，创建、测试和部署应用和服务，并交付给最终用户。

如 Azure。

**IaaS**，Infrastructure as a Service，基础设施及服务。已服务的形式提供服务器、存储和网络硬件，以及相关软件。它是三层架构的最底层。

其他延伸的服务模式还有：数据即服务（Data as a Service，DaaS）、桌面即服务（Desktop as a Service，DaaS）、通信即服务（Communications as a Service，CaaS）、数据库即服务等（DataBase as a Service，DBaaS）。

云计算关键技术：分布式计算、分布式存储、服务器虚拟化、多租户、存储虚拟化、桌面虚拟化、云管理平台等。

服务器虚拟化架构：全虚拟化、半虚拟化、硬件辅助虚拟化。

存储虚拟化的 3 中实现方式：基于主机、基于存储设备、基于网络。

Docker 主要功能特性：内容无关性、硬件无关性、内容隔离和交互、自动化、高效、职责分离。

## 第11章 大数据技术及应用

大数据特征：4V

大容量（Volume）、多样性（Variety）、快速度（Velocity）、真实性（Veracity）。

**大数据技术**

文件系统、数据存储、数据分析、数据可视化、

Hadoop 技术架构

大数据应用发展



## 第12章 物联网

物联网 3 个主要特征：全面感知，可靠传输，智能处理。

物联网层次结构：感知层、传输层、应用层。

**自动识别技术**

条形码技术：一维条码、二维码

RFID 技术（Radio Frequency Identification）射频识别

NFC 技术（Near Field Communication）即近场无线通信技术，向下兼容 RFID

**NFC 3 种工作模式**

卡模式：相当于采用 RFID 技术的 IC 卡。

读卡器模式：可读写电子标签

点对点模式：两个具有 NFC 功能的设备可进行数据交换，实现点对点的数据传输。

**NFC 技术特点**

1. 与 RFID 比，NFC 传输距离比 RFID 小，采取了独特的信号衰减技术，具有距离近、带宽高、能耗低等特点。RFID 应用在生成、物流。跟踪、资产管理上，而 NFC 适用于门禁、公交车、手机支付等领域。
2. 和蓝牙相比，NFC 面向近距离交易，适用于交换财务信息或敏感的个人信息等重要数据；而蓝牙通信距离比 NFC 稍远，可达 10m，适用于较长距离数据通信。与红外线相比，NFC 比红外线更快，更可靠简单。
3. NFC 与现有非接触智能卡技术兼容。

IC 卡技术：IC 卡（Integrated Circuit Card）是集成电路卡，有些国家也成为智能卡（Smart Card）、智慧卡（Intelligent Card）、微电路卡（Microcircuit Card）。

生物计量识别技术：虹膜识别技术、指纹识别技术

传感器技术

无线传感器网络（Wireless Sensor Networks，WSN），由传感器节点、汇聚节点和任务管理单元组成。

定位系统：卫星定位、蜂窝基站定位、无线室内环境定位

**物联网接入技术**

M2M 接入技术：机器对机器的通信（Machine-toMeachine Communication，M2M），是物联网实现的关键。系统架构分 3 层：应用层、网络传输层和设备终端层。

WMMP 通信协议（Wireless M2M Protocol）

6LoWPAN 技术（IPv6 over LR_PAN），使用 IPv6 的低速无线个人局域网

NB-loT 技术

LoRa 技术

eMTC 技术

**物联网应用**

智能交通、智能物流、环境检测

**物联网中的信息安全与隐私保护**



