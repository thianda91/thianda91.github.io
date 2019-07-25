---
layout:       article
title:        python虚拟环境的创建
key:          2019-07-25
tags:         python
categories:   notes
created_date: 2019-07-25 15:05:32 +08:00:00
date:         2019-07-25 15:44:13 +08:00:00
---

让项目运行在一个独立的局部的 Python 环境中，使采用不同环境的项目互不干扰。

<!--more-->

## virtualenv

`pip install virtualenv`

### 创建

```sh
# 创建名为 ENV 的虚拟环境
virtualenv ENV
```

创建后在当前路径下生成名为`ENV`的文件夹。

### 可选参数

```sh
# 指定 Python 版本
-p
# 继承系统三方库
--system-site-packages

```

### 进入/退出

**进入**虚拟环境可执行`ENV/Script/activate`脚本。

```sh
# linux
cd ENV
source bin/activate
# windows
ENV/Script/activate.bat
```

**退出**时执行`ENV/Script/deactivate`脚本。

```sh
# linux
deactivate
# windows
ENV/Script/deactivate.bat
```

### 删除

直接删除对应的目录即可。

### 项目交付

方案一：

- 连同虚拟环境和项目一起拷贝给他人

方案二：

- 在虚拟环境中，冻结依赖需求文本
- 把项目和依赖需求文本给他人
- 他人在本地创建一个新的虚拟环境，并根据依赖需求文本安装相关库

```sh
# 冻结项目需求文本
pip freeze > requirements.txt
# 安装项目依赖库
pip install -r requirements.txt
```

## virtualenvwrapper

`pip install virtualenvwrapper`

对 virtualenv 的使用封装，更加方便的去使用 virtualenv。包的安装及虚拟环境的操作依然是分离的。并未具备对项目包的依赖管理及需求文本的生成操作封装。

### 创建并激活

```sh
mkvirtualenv venv1
```

### 虚拟环境中切换

```sh
workon venv2
```

### 关闭

```sh
deactivate
```

### 删除

```sh
rmvirtualenv env1
```

### 列出所有已创建

```sh
lsvirtualenv
```

## pipenv

`pip install pipenv`

基于项目的虚拟环境管理。

1. 是  pip + virtualenv 结合体，解决了 virtualenvwrapper 弊端
2. 自动帮你创建虚拟环境，以及安装三方库
3. 自动的记录你的项目依赖的所有三方库
4. 使用 pipfile 和 pipfile.lock取代了 requirements.txt

### 创建

```sh
# cd 到项目文件夹
pipenv --two 
# 或者
pipenv --three

# 查看位置：
pipenv --where
# 查看虚拟环境位置：
pipenv --venv
# 查看解析器信息：
pipenv --py
```

### 激活

```sh
# 项目文件夹下
pipenv shell
```

激活后使用`pipenv`代替`pip`，如：

```sh
pipenv install requests
```

安装依赖后会生成`Pipfile`和`Pipfile.lock`文件。

### 查看依赖结构

```sh
pipenv graph
```

### 退出

```sh
exit
# 或者直接关闭 shell
```

### 删除

```sh
# cd 进 pipfile 文件的目录
pipenv --rm
```

### 项目交接

**上传：**

应该包括文件有：

1. 包和模块源码
2. Pipfile 和 Pipfile.lock

**拿到共享：**

1. cd 进入获取的项目文件夹目录内
2. 检查项目是否具有Pipfile 和 Pipfile.lock 文件 
3. 执行命令：`pipenv install`