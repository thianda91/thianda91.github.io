---
layout:       article
title:        使用 Jekyll 搭建自己的 Github Pages
key:          2017-10-30
tags:         jekyll
categories:   manual
date:         2017-10-30 16:46:38 +0800
modify_date:  2025-05-08 11:55:00 +0800
---

记录一下本人第一次搭建git pages的过程。谨以此文记录自己的操作过程。

<!--more-->


想要操作高级玩法，一定要仔细阅读[官方文档](http://jekyll.com.cn/docs/home/)。了解`liquid`语法，`yaml`语法，`jekyll`架构。以及相关的HTML，css，javascript基础。

因为需要使用ruby语言，本人之前从未接触过它，对此有很大的抵触。网上找了很多教程都是基于MAC或者Linux系统的，本人使用win10，很怕弄不会又没有相关资料，于是还特意折腾了虚拟机安装了centos。按照教程一步步来，结果实际情况还是和各种教程的描述不一致。搞得本人头很大。后来耐心的查阅了很多资料，对github pages、jekyll及其相关工具有了更深的认识，于是照猫画虎的搭建成功了。接下来打算慢慢的修改成自己想要的样子。


## jekyll 相关链接

[Jekyll/Liquid API 语法文档](http://alfred-sun.github.io/blog/2015/01/10/jekyll-liquid-syntax-documentation/)

[Liquid 模板语言 wiki](https://github.com/Shopify/liquid/wiki)

[Xianda选的模板](https://github.com/kitian616/jekyll-TeXt-theme)

[使用Jekyll搭建自己的博客-全教程-简书](http://www.jianshu.com/p/c04475ba80e4)

[搭建一个免费的，无限流量的Blog----github Pages和Jekyll入门](http://www.ruanyifeng.com/blog/2012/08/blogging_with_jekyll.html)

[jekyll-now](https://github.com/barryclark/jekyll-now)

[使用 GitHub, Jekyll 打造自己的免费独立博客](http://blog.csdn.net/on_1y/article/details/19259435)

[Jekyll搭建写作环境问题集锦](http://www.jianshu.com/p/12e7e1f8007e)

[Windows安装Jekll](https://segmentfault.com/a/1190000010195733)


## windows上使用jekyll

[windows 使用 ruby、jekyll 搭建 github pages](http://blog.csdn.net/u013009839/article/details/43742901)

推荐几个老外写的教程：

http://jekyll-windows.juthilo.com（本人遇坑时参考了这篇）

http://yizeng.me/2013/05/10/install-jekyll-3-on-windows/

### 安装Ruby

在[官网](https://rubyinstaller.org)下载 ruby，windows 系统推荐使用 [RubyInstaller](https://rubyinstaller.org/downloads/)（with Devkit）。会自动添加路径到 path 变量中。安装结束后会要求安装 **MSYS2**。

安装完毕可以输入`ruby -v`验证。

### 安装RubyGems、Bundler

*其实使用`RubyInstaller`会自动安装了`gem`。可直接输入`gem -v`验证。*

> 1. 官网下载[RubyGems](https://rubygems.org/pages/download)的zip包
> 2. 解压zip文件并在命令行（cmd/git bash均可）cd到该目录
> 3. 输入`ruby setup.rb`（管理员权限）

`gem`命令会把包安装在 类似`D:\Ruby[xx]-x64\lib\ruby\gems\[x.x.x]\gems`的目录中，安装了`jekyll`会自动安装很多它的依赖包。都在这个目录里。

使用`gem`会自动安装帮助文档（`ri`或`rdoc`格式），因为我们可以在线查看，不需要下载，因此可以在`~\.gemrc`文件中添加两行：

```ini
# nano ~/.gemrc
install: --no-document
update: --no-document
```

这样使用`gem`命令时不安装帮助文档（否则它通常安装在`D:\Ruby[xx]-x64\lib\ruby\gems\[x.x.x]\doc`目录）。

Gem 命令的其他操作：

```sh
# 查看通过gem已安装插件：
gem list
# 查看 RubyGems 配置详情
gem environment
# 查看gem的源：
gem sources list
# 可以添加/删除源：
gem sources --add https://gems.ruby-china.com/ --remove https://rubygems.org/
# 或者
gem sources --add https://mirrors.tuna.tsinghua.edu.cn/rubygems/ --remove https://rubygems.org/
# 清理旧的包：
gem cleanup
# 基于`Gemfile`指定的依赖包执行命令：
bundle exec <command>
```

##### 如果你使用 Gemfile 和 Bundler (例如：Rails 项目)

你可以用 Bundler 的 [Gem 源代码镜像命令](https://bundler.io/man/bundle-config.1.html#MIRRORS-OF-GEM-SOURCES)。

```bash
bundle config --global mirror.https://rubygems.org https://gems.ruby-china.com
# 或者
bundle config --global mirror.https://rubygems.org https://mirrors.tuna.tsinghua.edu.cn/rubygems/
```

接下来继续安装Bundler

```bash
gem install bundler # 安装bundler
```

安装完毕可以输入`bundle -v`验证。

设置指定安装路径：

```sh
bundle config --global path 'vendor/bundle'
bundle config path 'vendor/bundle'
```

现在我们可以根据项目根目录下`Gemfile`来安装/更新依赖：

```sh
bundle install
# 或者
bundle update
```

用于是通过 `bundle` 安装的依赖，所以执行命令都要通过`bundle exec xxx `来执行。比如：

```sh
bundle exec jekyll -v
bundle exec jekyll build --watch
bundle exec jekyll serve
```



### 安装Jekyll

执行`gem install jekyll`即可自动安装 jekyll 的所有依赖包。也许或弹出防火墙提示，允许即可。依赖包数量比较多安装过程会慢，耐心等待安装完毕即可。

安装完毕输入`jekyll -v`验证。


#### 如果安装jekyll出错

提示执行`ridk install`，则说明当前安装的是 Ruby 2.4.x。需要在 cmd 运行`ridk install`安装 [MSYS2 toolkit](http://www.msys2.org/) ，执行后输入`1`即可。如果下载过慢，可手动复制下载链接进行下载安装。

提示`make`不是内部或外部命令，则说明当前安装的是 Ruby2.0-2.3。需要安装`DEVELOPMENT KIT`。按照下面方式操作：

从[官网](https://rubyinstaller.org/downloads/)下载`DEVELOPMENT KIT`，它是个自解压文件，运行后推荐解压到`C:\RubyDevKit\`。然后用 git for windows 的 MingW64 执行

```sh
# 切换到 解压文件夹
cd /C/RubyDevKit
# 初始化安装，会自动检查Ruby的安装路径
ruby dk.rb init
```

不过上一步可能会检查不出来，提示如下：

```sh
Initialization complete! Please review and modify the auto-generated
'config.yml' file to ensure it contains the root directories to all
of the installed Rubies you want enhanced by the DevKit.
```

需要手动修改 `config.yml`文件，确保`config.yml`中包含

```yaml
- C:/Ruby23-x64
```

安装 DevKit 到 ruby

```sh
ruby dk.rb install
```

不出意外会提示：

```sh
[INFO] Updating existing gem override for 'C:/Ruby23-x64'
[INFO] Installing 'C:/Ruby23-x64/lib/ruby/site_ruby/devkit.rb'
```

然后再尝试安装jekyll

```
gem install jekyll
```

笔者使用Ruby2.4，Ruby2.3均运行成功。



### Jekyll 操作教程

想要读懂或编辑`jekyll`模板看这里：https://jekyllrb.com/docs/


```shell
jekyll build
# => 当前文件夹中的内容将会生成到 ./_site 文件夹中。

jekyll build --destination <destination>
# => 当前文件夹中的内容将会生成到目标文件夹<destination>中。

jekyll build --source <source> --destination <destination>
# => 指定源文件夹<source>中的内容将会生成到目标文件夹<destination>中。

jekyll build --watch

# => 当前文件夹中的内容将会生成到 ./_site 文件夹中，
# 查看改变，并且自动再生成。

jekyll serve

# => 当前文件夹中的内容将会生成到 ./_site 文件夹中。并搭建web服务。
# 可访问 http://localhost:4000 查看，方便本地调试。
```

### 搭建环境问题处理

搭建后执行jekyll命令如果出现报错，多为配置环境的问题。第一种方法通常是根据报错信息安装对应的依赖包即可，如：

````sh
gem install tzinfo-data
````

或者第二种方法，在根目录下的`Gemfile`文件里输入：

```ruby
gem 'tzinfo-data'
```

本人使用`gem install xxx`会出错，采用的第二种方法。

###　.svg 文件转 .png 和 .ico 文件工具

首先需要nodejs环境，官网下载即可。然后需要使用npm下载，npm服务器下载比较慢，可以选择淘宝镜像，具体操作见：<https://npmmirror.com/>

```bash
npm install -g cnpm --registry=https://registry.npmmirror.com

npm install svg2img png-to-ico
npm install svg-to-ico
```

也可使用 ImageMagick，https://imagemagick.org/script/download.php







## 拓展阅读

### 基于php的markdown博客搭建工具-gitblog

[gitblog官网](http://www.gitblog.cn/)， [github地址](https://github.com/jockchou/gitblog)

### 基于NodeJs的markdown博客搭建工具-hexo

[hexo官网](https://hexo.io/)，[github地址](https://github.com/hexojs/hexo)

### 基于NodeJs的jekyll翻版工具-darko

[github地址](https://github.com/dotnil/darko)

> <https://github.com/thx/thx.github.io/blob/master/README.md>



