---
layout: article
title: 零基础搭建CMS内容管理系统
key: 2017-11-25
tags: cms
categories: manual
created_date: 2017-11-25
date: 2017-11-25 16:50:00
---

##  学习此教程的意义

搭建CMS，其实就是搭建一个[静态网站](https://baike.baidu.com/item/%E9%9D%99%E6%80%81%E7%BD%91%E7%AB%99/2776875)，目的是把精力更多放在如何更新内容（文字/图片等），而不是如何建站，设置格式等问题。让维护者专注于写作。

<!--more-->

```bash
优点：

- 有很多优秀的模板设计，网站的组建和网站的内容分离，可随时更换样式
- 不但可以处理文字，还可以处理图片、声频、视频等。
- 可分布式管理，在任何地方写作，然后直接发布。
- 面向搜索引擎友好，CMS为搜索引擎优化过，包含目录结构、文件名、标题、关键字等。
- 所有技术均开源，随时使用最新的技术，学习成本低，易使用。
```

> 本教程偏技术向，注重动手实践，具体操作会在课堂上带大家一步一步操作。涉及知识点很多，只需了解概念，会使用即可，深入了解对本教程内容无太大的作用。感兴趣可以点击链接自行拓展阅读。

### 什么是CMS

CMS(Content Management System)意为"内容管理系统"。 内容管理系统是企业信息化建设和电子政务的新宠，也是一个相对较新的市场。对于内容管理，业界还没有一个统一的定义，不同的机构有不同的理解。详细可参考：[百科词条](https://baike.baidu.com/item/%E5%86%85%E5%AE%B9%E7%AE%A1%E7%90%86%E7%B3%BB%E7%BB%9F)

实际工作中哪里能用到CMS？

静态网站（新闻类）、个人博客（个人笔记）、产品介绍（使用手册）、规章制度手册（章节类文字）、操作教程（图文资料发布）等。

### 学习成本

#### 必要的知识

- *markdown语法*
- *github.com网站的使用*

#### 基于github搭建所需知识点

- [Git for Windows](https://git-for-windows.github.io/)

#### 本地/私有搭建所需知识点

- [Ruby](http://www.ruby-lang.org/)
- [RubyGems](https://rubygems.org/pages/download)
- [Jekyll](https://jekyllrb.com/)

#### 额外可能涉及的知识点

- HTML/CSS
- JavaScript
- [Node.js](https://nodejs.org/)

### 立即动手做

英文好的同学可以直接移步到github上手操作：[jekyll-now](https://github.com/barryclark/jekyll-now)

## 步入本教程正题

### markdown语法

写作时采用[markdown](https://baike.baidu.com/item/markdown/3245829)语法，可以自动转换成相应的格式，并根据不同模板，显示为不同的样式。学习markdown可以参考[这篇文章](http://www.jianshu.com/p/q81RER)，还有这个：[怎样引导新手使用 Markdown？--知乎](https://www.zhihu.com/question/20409634)。

### 使用Jekyll

本教程基于jekyll，搭建在github，jekyll官网是<https://jekyllrb.com>，它是使用GitHub Pages服务的推荐工具。它有很多的免费模板：可到<http://jekyllthemes.org/>上查看并下载源码。

Jekyll 的核心其实是一个文本转换引擎。它的概念其实就是： 你用你最喜欢的标记语言来写文章，可以是 Markdown，也可以是 Textile,或者就是简单的 HTML, 然后 Jekyll 就会帮你套入一个或一系列的布局中。在整个过程中你可以设置URL路径, 你的文本在布局中的显示样式等等。这些都可以通过纯文本编辑来实现，最终生成的静态页面就是你的成品了。

#### jekyll目录结构

一个基本的 Jekyll 网站的目录结构一般是像这样的

```
.
├── _config.yml
├── _data
|   └── members.yml
├── _drafts
|   ├── begin-with-the-crazy-ideas.md
|   └── on-simplicity-in-technology.md
├── _includes
|   ├── footer.html
|   └── header.html
├── _layouts
|   ├── default.html
|   └── post.html
├── _posts
|   ├── 2007-10-29-why-every-programmer-should-play-nethack.md
|   └── 2009-04-26-barcamp-boston-4-roundup.md
├── _sass
|   ├── _base.scss
|   └── _layout.scss
├── _site
├── .jekyll-metadata
└── index.html # can also be an 'index.md' with valid YAML Frontmatter

```

来看看这些都有什么用：

| 文件 / 目录                                  | 描述                                       |
| ---------------------------------------- | ---------------------------------------- |
| `_config.yml`                            | 保存[配置](http://jekyll.com.cn/docs/configuration/)数据。很多配置选项都会直接从命令行中进行设置，但是如果你把那些配置写在这儿，你就不用非要去记住那些命令了。 |
| `_drafts`                                | drafts 是未发布的文章。这些文件的格式中都没有 `title.MARKUP` 数据。学习如何使用 [drafts](http://jekyll.com.cn/docs/drafts/). |
| `_includes`                              | 你可以加载这些包含部分到你的布局或者文章中以方便重用。可以用这个标签`\{\% include file.ext \%\} `来把文件 `_includes/file.ext` 包含进来。 |
| `_layouts`                               | layouts 是包裹在文章外部的模板。布局可以在 [YAML 头信息](http://jekyll.com.cn/docs/frontmatter/)中根据不同文章进行选择。 这将在下一个部分进行介绍。标签 `\{\{ content \}\}` 可以将content插入页面中。 |
| `_posts`                                 | 这里放的就是你的文章了。文件格式很重要，必须要符合: `YEAR-MONTH-DAY-title.MARKUP`。 The [permalinks](http://jekyll.com.cn/docs/permalinks/) 可以在文章中自己定制，但是数据和标记语言都是根据文件名来确定的。 |
| `_data`                                  | 格式良好的网站数据应放在这里，jekyll引擎会自动加载所有的yaml文件（文件后缀为`.yml`或者`.yaml`），在本目录中，如果有个名为`members.yml`的文件，则你可以通过`site.data.members`来访问内容。 |
| `_site`                                  | 一旦 Jekyll 完成转换，就会将生成的页面放在这里（默认）。最好将这个目录放进你的 `.gitignore` 文件中。 |
| `index.html` and other HTML, Markdown, Textile files | 如果这些文件中包含 [YAML 头信息](http://jekyll.com.cn/docs/frontmatter/) 部分，Jekyll 就会自动将它们进行转换。当然，其他的如 `.html`， `.markdown`， `.md`，或者 `.textile` 等在你的站点根目录下或者不是以上提到的目录中的文件也会被转换。 |
| Other Files/Folders                      | 其他一些未被提及的目录和文件如 `css` 还有 `images` 文件夹，`favicon.ico` 等文件都将被完全拷贝到生成的 site 中。 这里有一些[使用 Jekyll 的站点](http://jekyll.com.cn/docs/sites/)，如果你感兴趣就来看看吧。 |

#### 头信息

```yaml
---
layout: article
title: this_is_the_title
---
```

每个文章推荐使用`.md`为文件后缀来保存。每篇文章开头需加上头信息，预定义一些变量。接下来即可使用markdown语法来写文章了。

更多的jekyll使用方法可直接访问官网<https://jekyllrb.com>查看。

### 网站发布

如果是发布到github.com（需自己先注册一个github账号），又不想使用git命令，可在选择模板时直接这样做：

1. 选择模板并访问模板的github地址（<http://jekyllthemes.org/>）
2. fork该项目（这样自己才有权限编辑）
3. 转到自己fork的项目中修改项目名为`username.github.io`（`username`为你的github账户名）
4. 开启github pages 功能，然后即可访问 https://username.github.io。比如本人的：<https://yuxianda.github.io>

如果想对模板做一些修改，则可以讲模板下载到本地，修改后使用Git for windows推送到github。

如果是搭建在本地，或者私有的服务器上，具体可参考本人的另一篇文章：<https://yuxianda.github.io/notes/create-blog-by-using-jekyll.html>，主要步骤如下：

1. 按顺序依次安装ruby，rubygems，jekyll
2. 在目录中执行`jekyll build`生成网页文件到`_site`文件夹
3. 使用web容器发布网站

web容器可以选择可以选择apache、nginx、或者windows自带的IIS。到官方网站进行下载安装，简单配置即可。

> 本课程所有具体操作步骤在课上实际演示给大家。

