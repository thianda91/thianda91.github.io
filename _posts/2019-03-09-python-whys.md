---
layout:       article
title:        学习 python 遇到的十万个为什么
key:          2019-03-09
tags:         python
categories:   notes
created_date: 2019-03-09 22:46:42
date:         2019-03-10 21:37:51
---

 收集 python 中的一些常识。

<!--more-->

## `.py`文件开头的声明

```python
#!/usr/bin/env python
# -*- coding: utf-8 -*-
```

**第一行**，`.py` 文件的开头一般都有上述声明，或较为类似的声明。第一行用于在 linux 系统中直接执行 `.py`文件时。

如已知 demo.py 

```sh
./demo.py
```

此时 shell 会使用当前环境中的 `python` 命令来执行文件`demo.py`。若执行`python demo.py`，则此声明无效。有些会写成

```python
#!/usr/bin/python
```

此时 shell 会使用 `/usr/bin/python` 来执行文件，若 `python` 不在 `/usr/bin/`目录下 ，安装在其他路径，或存在多个版本的 `python`，则可能无法执行。这样的代码可移植性差。

**第二行**，声明文件的编码为 `utf-8`。因为默认编码格式为 ASCII，文件写中文会乱码。

官方文档中 PEP-0263 有提及：https://www.python.org/dev/peps/pep-0263/

主要内容：

1. 编码必须在第一行或第二行。

2. 可选格式（3 种） ：

    ```python
    # coding=<encoding name>  
    # -*- coding: <encoding name> -*-  
    # vim: set fileencoding=<encoding name> :  
    ```

3. 满足下面这个正则表达式的字符串都有效：`\%^.*\n.∗\?#.*coding[:=]\s*[0-9A-Za-z-_.]\+.*$  `

第 1 种方式支持更多的编辑器，移植性好。

## 2to3.py

Python 2 程序都需要一些修改才能正常地运行在 Python 3 的环境下。

python 3 自带了一个 `2to3.py` 文件。通常在 python 安装目录下的 `\Tools\scripts` 文件夹。如：

```
D:\Program Files\Python37\Tools\scripts\2to3.py
```

使用 `2to3.py` 即可进行转换，转换到 python 3 的形式后，源文件内容会备份到 `*.bak` 文件，

```sh
# 查看使用帮助
python 2to3.py --help
# 转换目录或转换文件
python 2to3.py -w "D:\home\python-ipy\"
python 2to3.py -w "D:\Program Files\Python37\Lib\site-packages\IPy.py"
```





