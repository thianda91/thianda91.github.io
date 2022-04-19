---
layout:       article
title:        python 打包 exe 总结
key:          2021-05-02
tags:         python
categories:   python
created_date: 2021-05-02 02:20:14 +08:00:00
date:         2022-04-18 17:08:54 +08:00:00
---

pyinstaller 可以用来把 python 打包成可执行二进制文件，但是在打包会遇到很多问题，尤其在 windows 系统上打包 exe 时。

还可以使用 nuitka。把 python 脚本编译成 c ++。

<!--more-->

## nuitka 基本使用

### 安装语法

```sh
pip install nuitka
python -m nuitka xxx.py --standalone --onefile --windows-icon-from-ico=favicon.ico
```

### 常用参数

```ini
--standalone
# 可运行在没有 python 的环境中
--onefile
# 生成单文件
-windows-icon-from-ico=
# 打包 icon 文件（默认无图标）
```

### 其他参数

可使用 `python -m nuitka -h` 来查看，参数众多，有需要现查看即可。

### 运行过程

首次运行，会请求下载 gcc 编译相关文件。需要输入 yes 会直接按回车继续。如果下载慢可根据提示手动下载并放到指定的目录下。请求下载的文件有 2 个。再次编译则不再重新下载。

打包速度明细慢于 pyinstaller。且会将所有下载的 python 包全部打包，为了缩小体积，不得不用`pipenv`等虚拟环境。

打包后会生成 2 个文件夹： `xxx.build`、`xxx.onefile-build`。exe 文件在同目录。

## pyinstaller  基本使用

### 安装语法

```sh
pip install pyinstaller
pyinstaller -F xxx.py -i favicon.ico
```

### 常用参数

```sh
-D, --onedir
# 输入到文件夹（默认）
-F, --onefile
# 打包到单文件
-c
# windwos 下启动时打开命令行窗口（默认）
-w
# windwos 下启动时无命令行窗口
-i
# 打包 icon 文件（默认和 python.exe 一样）
-n
# 指定输出的文件/文件夹名（默认第一个脚本名）
```

### 不常用参数

```sh
--add-data <SRC;DEST or SRC:DEST>
--add-binary <SRC;DEST or SRC:DEST>
--version-file
--uac-admin
-r
-m, --manifest
```

执行`pyinstaller -h` 查看更多参数。

打包后会生成 `*.spec`文件、以及 `build`、`dist`文件夹。exe 文件在 `dist` 里。

### 配置文件

`.spec`是打包配置文件，在执行一次打包操作后会生成。如果打包后的 exe 无法运行缺少资源。可以修改它并再次打包。

```sh
pyinstaller xxx.spec
```

正常情况下 pyinstaller 会自动识别需要打包进去的资源，但有时候并不准，复杂的 import 关系识别不到，运行 exe 时会提示包不存在。比如在打包 PyQt 。

```python
# -*- mode: python ; coding: utf-8 -*-

block_cipher = None

add_files = [
('./data','data'),
('./imgs','imgs'),
('./setting','setting')
]

a = Analysis(['xxx.py'],
			pathex=['D:\\home\\pyqt_test'],
			binaries=[],
			datas=add_files,
			...
)
pyz = PYZ(...)

exe = EXE(pyz,
          ...
          name='xxx',
          ...
          console=False, icon='./dist/favicon.ico')
```

**`add_files` 是一个列表，列表里元素是元组。 元组第一项是要引用的外部资源的路径（可以是文件/文件夹），第二项是打包进 exe，在 exe 中的路径（所在文件夹）。**

### 设置文件版本信息

为了方便版本管控，最好是给每次打包发布的 exe 文件设置文件版本信息——右键点击 exe 查看属性中的详情信息中可以看到版本信息。

**方法一：**

进入 pyinstaller 的安装目录：`\Lib\site-packages\PyInstaller\utils\cliutils\`，找到

```ini
grab_version.py
set_version.py
```

其中的 `grab_version.py` 是用来捕获一个 `exe` 文件的版本信息并自动在同一目录下输出一个 `file_version_info.txt` 文件版本信息的，其中 `set_version.py` 是用来给一个 `exe` 文件赋值版本信息的，用法分别如下：

1. 进入 cmd 界面
2. 目录转移到 \Lib\site-packages\PyInstaller\utils\cliutils\ 下
3. 拷贝一个要获取版本信息的 exe 文件到这个目录下
4. 在 cmd 窗口键入：`python grab_version.py filename.exe`
5. 目录下会自动出现一个标准的 file_version_info.txt 文件，双击打开，按照相应的需求修改
6. 在cmd窗口键入：`python set_version.py file_version_info.txt youfilename.exe`即可

**方法二：**

1. 在打包的时候就已经准备好了版本信息文件：file_version_info.txt
2. 打包时用此参数 `--version-file` 即可：`pyinstaller --version-file file_version_info.txt xxx.py`



最后打包成 exe，可以右键点击 exe 文件查看详细信息，可以看到有文件版本信息。

### 设置管理员权限执行

如果需要用管理员权限执行，即双击 exe 文件运行时，需要弹出一个 uac 界面让用户授权。怎么做？

首先打包一次：

```sh
pyinstaller -F --uac-admin xxx.py
```

来到``目录，找到`*.manifest`文件，把它复制到 py 文件的同级目录下

```sh
pyinstaller -F --uac-admin -r xxx.exe.manifest,1 xxx.py
# 或直接执行：
pyinstaller -F --uac-admin -r build/xxx.exe.manifest,1 xxx.py
```

添加了参数：`-r xxx.exe.manifest,1`，打包后的 exe 带小盾牌图标了。双击运行弹出了uac 界面。

### 报错处理

如果执行打包后的 exe 文件闪退。可在 cmd 下执行，查看报错信息。

使用软件：[Dependency Walker](http://www.dependencywalker.com/)，可以自动搜素缺失的组件。可以为分析问题提供些帮助。

### 参考

手把手教你将pyqt程序打包成exe，<https://blog.csdn.net/tb_youth/article/details/105758308> 

Pyinstaller 打包发布经验总结，<https://blog.csdn.net/weixin_42052836/article/details/82315118> 

pyinstaller 打包 exe（含file version信息），<https://www.cnblogs.com/danvy/p/10505731.html> 

--uac-admin 选项不起作用，<https://blog.csdn.net/qq_26373925/article/details/105373124> 

