---
layout:       article
title:        编写 python 库并打包分发到 pypi
key:          2019-01-12
tags:         python
categories:   notes
created_date: 2019-01-12 16:38:47
date:         2019-01-13 14:24:52
---

Python 有非常丰富的第三方库可以使用，很多开发者会向 [pypi](https://pypi.org/) 上提交自己的 Python 包。要想向 pypi 包仓库提交自己开发的包，首先要将自己的代码打包，才能上传分发。

<!--more-->

## 概述

Python 库打包分发主要工作是 setup.py 的编写。

官方 Guides： <https://packaging.python.org/guides/distributing-packages-using-setuptools/>

## setuptools 简介

[setuptools](https://baike.baidu.com/item/setuptools/678556) 是 distutils 增强版，不包括在标准库中。其扩展了很多功能，能够帮助开发者更好的创建和分发 Python 包。大部分 Python 用户都会使用更先进的 [setuptools](https://setuptools.readthedocs.io) 模块。

Setuptools 有一个 fork 分支是 **distribute**。它们共享相同的命名空间，因此如果安装了 distribute，`import setuptools` 时实际上将导入使用 distribute 创建的包。Distribute 已经合并回 setuptools。

还有一个大包分发工具是 **distutils2**，其试图尝试充分利用distutils，detuptools 和 distribute 并成为 Python 标准库中的标准工具。但该计划并没有达到预期的目的，且已经是一个废弃的项目。

因此，setuptools 是一个优秀的，可靠的 Pthon 包安装与分发工具。以下设计到包的安装与分发均针对 setuptools，并不保证 distutils 可用。

## 打包源代码

根据官方的 Guides，可以很轻松的打包并发布。

首先安装依赖

```sh
pip install twine
```

配置要发布的项目，编写`setup.py`。

```python
#!/usr/bin/env python
# -*- coding: utf-8 -*-

from __future__ import print_function
from setuptools import setup, find_packages
import sys
setup(
    name="xdaLibs",
    version="0.0.1",
    author="xda",
    author_email="thianda91@outlook.com",
    description="A helping-tool library for self-use",
    license="MIT",
    url="https://github.com/thianda/xdaLibs",
    # packages=['iniConfig'],
    packages=find_packages(exclude=['tests*']),
    classifiers=[
        # How mature is this project? Common values are
        #   3 - Alpha
        #   4 - Beta
        #   5 - Production/Stable
        'Development Status :: 4 - Beta',
        'Intended Audience :: Developers',
        'License :: OSI Approved :: MIT License',
        'Natural Language :: English',
        'Operating System :: MacOS',
        'Operating System :: Microsoft',
        'Operating System :: POSIX',
        'Operating System :: Unix',
        "Topic :: Software Development :: Libraries :: Python Modules",
        'Programming Language :: Python :: 3',
    ],
    zip_safe=False,
    install_requires=[
        'configparser>=3.5.0'
    ]
)

```

参考上面的填写自己要打包的信息。

执行打包命令

**若打包`source distribution`**

```sh
python setup.py sdist
```

**若打包 [Wheels](https://packaging.python.org/guides/distributing-packages-using-setuptools/#id73)** 

代码必须是纯 python，不可以带有 C扩展。

```sh
pip install wheel
```

代码支持 python2 和 python3，打包为 [Universal Wheels](https://packaging.python.org/guides/distributing-packages-using-setuptools/#id74) ，这样可以被`pip`安装在任何位置

``` 
python setup.py bdist_wheel --universal
```

也可以将参数 `universal` 设置在`setup.cfg`

```ini
[bdist_wheel]
universal=1
```

否则，代码不通用（不同时支持 python2 和 python3）,则打包为[Pure Python Wheels](https://packaging.python.org/guides/distributing-packages-using-setuptools/#id75) 

```sh
python setup.py bdist_wheel
```

## 发布到  pypi

当运行了上面的命令后，会生成 `dist/`的文件夹。在[官方指引](https://packaging.python.org/guides/distributing-packages-using-setuptools/#id77) 中，明确给出了警告：在其他参考文献中会推荐这两个命令：`python setup.py register`和`python setup.py upload`，使用它们会造成账号密码通过 http 明文传输，或使用未验证的 https 传输，进而可能造成账号泄露。

首先去官网[注册账号](https://pypi.org/account/register/)，将账号信息写入到 `~/.pypirc`

```ini
[pypi]
username = <username>
password = <password>
```

上传打包的包

```sh
twine upload dist/*
```

如果上传成功，可以访问 `https://pypi.org/project/{projectNAME}`查看。

比如我的：<https://pypi.org/project/xdaLibs/>



(本文完)

参考链接：http://blog.konghy.cn/2018/04/29/setup-dot-py/