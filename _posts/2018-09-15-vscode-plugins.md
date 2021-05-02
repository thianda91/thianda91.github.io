---
layout:       article
title:        vscode 自用的配置与插件整理
key:          2018-09-15 
tags:         vscode
categories:   coding
created_date: 2018-09-15 23:23:28 +08:00:00
date:         2018-09-16 03:16:09
---

记录一些使用 vscode 时的配置与自用的插件。方便在新环境安装 vscode 时快速配置使用。

<!--more-->

## 个性配置

**自定义** git 路径、命令行执行程序、php 验证路径、php 执行路径等。

```javascript
{
    "git.path": "D:/Git/bin/git.exe",
    "terminal.integrated.shell.windows": "D:/Git/bin/sh.exe",
    "php.validate.executablePath": "D:/xampp/php/php.exe",
    "php.suggest.basic": false,
}
```

## 快捷键配置

在 vscode 里`帮助=>快捷键参考`即可查看所有快捷键（英文），左下角点击设置图标再选择`键盘快捷方式`即可查看本地化的（中文）快捷键使用方法。

- `ctrl+l`已选择某变量时，匹配选择下一个同名的单词。用于修改变量名或函数名时可连同修改后续的引用。原来是`ctrl+d`
- `ctrl+d`删除当前行，与`notepadd++`一致。默认是`ctrl+shift+k`
- `alt+oem_2`触发建议。即`alt+/与`eclipse`一致。默认是`ctrl+space`

```javascript
// Place your key bindings in this file to overwrite the defaults
[
    {
        "key": "ctrl+l",
        "command": "editor.action.addSelectionToNextFindMatch",
        "when": "editorFocus"
    },
    {
        "key": "ctrl+d",
        "command": "-editor.action.addSelectionToNextFindMatch",
        "when": "editorFocus"
    },
    {
        "key": "ctrl+d",
        "command": "editor.action.deleteLines",
        "when": "textInputFocus && !editorReadonly"
    },
    {
        "key": "ctrl+shift+k",
        "command": "-editor.action.deleteLines",
        "when": "textInputFocus && !editorReadonly"
    },
    {
        "key": "alt+oem_2",
        "command": "editor.action.triggerSuggest",
        "when": "editorHasCompletionItemProvider && textInputFocus && !editorReadonly"
    },
    {
        "key": "ctrl+space",
        "command": "-editor.action.triggerSuggest",
        "when": "editorHasCompletionItemProvider && textInputFocus && !editorReadonly"
    }
]
```

## 插件整理

在欢迎页，可以直接下载针对不同编程语言的支持。`帮助=>欢迎使用`可打开欢迎页。

在插件页（点击左侧最下面的图标），可根据插件名直接搜索。其实，先用先搜索即可。

### Add jsdoc comments

选中js function的一行，按`ctrl+shift+P`（显示命令面板），或`ctrl+P`（快速打开）后输入`>`，再输入`Add Doc Comments`即可自动添加 function 的注释模板。（其实在命令面板下第一个就是它，直接按回车即可生成注释）

### ~~Document This~~

用于生成`TypeScript`函数的注释，选中函数名快捷键`ctrl+alt+D`按下**两遍**即可。不支持普通的`javascript`，暂时用不上。

### ESLint

检查代码格式规范和语法错误。需配置`.eslintrc.json`文件

### Markdown Preview Github Styling

将`.md`文件渲染成 github 风格的 html。

### PHP DocBlocker

在 class、function 上方输入`/**`即可自动补全注释。

### PHP Intelphense

使用`TypeScript`实现的 php 开发工具，并建议关闭 vscode 自带的建议，下面的 IntelliSense 同样建议：

```javascript
"php.suggest.basic": false
```

推荐本插件而不是下面的 *PHP IntelliSense*。

### ~~PHP IntelliSense~~

IntelliSense：智能感知。使用纯 PHP 实现的开发工具。需要 PHP7以上，在 vscode 中设置 `php.executablePath`。使用时略卡。

### Quokka.js

javascript 的活动的便签。可以实时显示 js 的计算结果。方便调试。输入变量名时、选中语句时、`console.log()`时，with access to your project’s files, inline reporting, code coverage and rich output formatting.

### Regex Previewer

实时显示正则表达式的匹配结果。快捷键 `ctrl+alt+M`

### minify for VS Code

压缩`js、css`文件。[具体介绍](https://marketplace.visualstudio.com/items?itemName=HookyQR.minify)