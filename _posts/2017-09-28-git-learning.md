---
layout: post
title: Git简要教程
key: 2017-09-28
categories: ppt
tags: git
modify_date: 2017-10-23
---

文章首发于 http://blog.csdn.net/xianda9133/article/details/78121349

<!--more-->

本文作为自己的笔记留存。从安装到基本使用，满足日常的需求。

大家想系统学习我推荐这个：[史上最浅显易懂的Git教程！](https://www.liaoxuefeng.com/wiki/0013739516305929606dd18361248578c67b8067c8c017b000)

或者阅读[官方教程](https://git-scm.com/book/zh)，中文的。

## Git安装配置

### 1. 下载安装git-for-windows

在windows安装时选择如下选项：

- Use Git from Git Bash only
- Use the OpenSSL libriary
- Checkout as-is,commit as-is
- Use MinTTY
- 其他默认即可

安装路径建议为`C:/Git/`或者`D:/Git/`。

使用之前可在git安装目录新建名为`home`的文件夹。并将此路径添加到环境变量`HOME`中，添加到用户变量即可。这样在使用git时产生的所以配置文件均会保存到此目录中，并且加快`git bash`的启动速度。

否则环境变量中无`HOME`的变量，则会将配置信息以及生成的ssh密钥保存在当前登录用户的根目录，比如`C:/Users/administrator/`。

### 2. 常用命令：

#### 初始化git版本库：

```shell
git init
```

#### 克隆版本库：

```shell
git clone <dir>
```

#### 配置联网的代理服务器：

bash的`ssh`命令可在`~/.ssh/config`文件中配置如下一行，即可测试`ssh -T git@github.com`

```ini
ProxyCommand connect -H xxxx:8080 %h %p
```

配置`git`命令使用代理

```bash
git config --global http.proxy http://xxxx:8080
git config --global http.proxy user:password@http://xxxx:8080 # 需验证用户密码时这样写
git config --global https.proxy http://xxxx:8080 # 设置git访问https协议所使用的代理
git config --get http.proxy # 检查是否设置成功
git config --global http.sslVerify false # 解决https证书错误的问题
# 经测试，在内网环境使用代理后使用 git协议 (git@github.com:xxx...) 无法依然使用，需要修改为 https 协议，每次push都需要输入账户密码，比较麻烦
git config --global credential.helper wincred # 设置使用window凭据缓存账号密码，用于https方式push
# 当前git bash窗口有效
export http_proxy="http://127.0.0.1:8087"
export https_proxy="http://127.0.0.1:8087"
# cmd 代理设置
set http_proxy=http://proxy.yourname.com:8080
set http_proxy_user=
set http_proxy_pass=
```

#### 取消git联网的代理服务器：

```bash
git config --global --unset http.proxy
```

#### 配置用户：

```bash
git config --global user.email "You@example.com"
```

#### 配置邮箱：

```bash
git config --global user.name "Your Name"
```

#### 添加远程仓库：

```bash
git remote add origin git@github.com:thianda/dangjian.git
```

#### 添加文件：

``` bash
git add <filename>
git add . # 添加所有文件
```

#### 提交：

```bash
git commit -m '<comment>'
git commit -am '<comment>' # 若无增删文件，可这样使用，代替`git add .`&`git commit -m '<comment>'`
```

如果忘了加`-m`参数，会进入到linux的vim编辑界面，在输入了comment后按ESC，输入`:wq`按回车即可。

#### 查看状态：

```bash
git status   # 在任何环节均可以查看状态。
```

#### 查看所有分支

```bash
git branch --all 
```

#### 新建分支：

```bash
git checkout -b <branch>
```

等同于：

```bash
git branch <branch>
git checkout <branch>
```

#### git 本地分支与远程分支关联：

##### 1) github上已经有master分支 和dev分支

```bash
git checkout -b dev   # 新建并切换到本地dev分支
git pull origin dev   # 本地分支与远程分支相关联
```
##### 2) 在本地新建分支并推送到远程

```bash
git checkout -b test
git push origin test   # 这样远程仓库中也就创建了一个test分支
```

#### 发布dev分支

发布dev分支指的是同步dev分支的代码到远程服务器，与新建分支并推送类似

```bash
git push origin dev:dev  # 这样远程仓库也有一个dev分支了
```

#### 在dev分支开发代码

```bash
git checkout dev  # 切换到dev分支进行开发
# 开发代码之后，我们有两个选择
# 第一个：如果功能开发完成了，可以合并主分支
git checkout master  # 切换到主分支
git merge dev  # 把dev分支的更改和master合并
git push  # 提交主分支代码远程
git checkout dev  # 切换到dev远程分支
git push  # 提交dev分支到远程
# 第二个：如果功能没有完成，可以直接推送
git push  # 提交到dev远程分支
# 注意：在分支切换之前最好先commit全部的改变，除非你真的知道自己在做什么
```

#### 删除分支

```bash
git push origin :dev  # 删除远程dev分支，危险命令哦
# 下面两条是删除本地分支
git checkout master  # 切换到master分支
git branch -d dev  # 删除本地dev分支
```

#### 标签

```bash
git tag # 查看标签
git tag -l 'v1.4.2.*' # 搜索特定模式列
git tag -a v1.4 -m 'my version 1.4' # 添加标签 -a 标签名字 -m 标签说明
git show v1.4 # 查看标签版本信息
git tag v1.4-lw # 直接给出标签名称 创建轻量标签
git tag -v [tag-name] # 验证已经签署的标签 (git tag -s v1.4)
git tag v1.2 9fceb02 # 对早先的某次提交加注标签
git push origin --tags # 推送所有标签 默认 git push 不会推送标签到远端
git tag -d v1.4-lw # 删除标签
```

#### 其他命令：

```bash
git push -u origin master
git log
git reflog
ssh-keygen -t rsa -C "yxd9721@qq.com"
```

#### 一些alias

可将下面的配置手动保存到`~/.gitconfig`文件中

```ini
[alias]
	lg = log --color --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit
	lgg = log --no-merges --color --graph --date=format:'%Y-%m-%d %H:%M:%S' --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cd) %C(bold blue)<%an>%Creset' --abbrev-commit
	ls = log --no-merges --color --stat --graph --date=format:'%Y-%m-%d %H:%M:%S' --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Cblue %s %Cgreen(%cd) %C(bold blue)<%an>%Creset' --abbrev-commit
```

效果等同于执行：

```bash
git config --global alias.lg log --color --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit
git config --global alias.lgg log --no-merges --color --graph --date=format:'%Y-%m-%d %H:%M:%S' --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cd) %C(bold blue)<%an>%Creset' --abbrev-commit
git config --global alias.ls log --no-merges --color --stat --graph --date=format:'%Y-%m-%d %H:%M:%S' --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Cblue %s %Cgreen(%cd) %C(bold blue)<%an>%Creset' --abbrev-commit
```

### 3. 使用github.com

#### 设置ssh key

```bash
// 1. 创建 ssh key，出现提示一路按回车
ssh-keygen -t rsa -b 4096 -C "yxd9721@qq.com"
// 2. 让 ssh-agent 在后台运行 (start the ssh-agent in the background)
eval $(ssh-agent -s)
// 3. 指定密钥给本地ssh-agent
ssh-add ~/.ssh/id_rsa
// 4. 复制公钥，然后粘贴到github->Setting->SSH and GPG keys->New SSH key
clip < ~/.ssh/id_rsa.pub
// 5. 验证ssh key
ssh -T git@github.com
```

**使用方法**

> 在git-bash中使用ssh协议的链接进行clone和push，即可基于ssh key免输密码。

#### 设置启动git bath后自动运行ssh-agent

将下面的代码保存到`~/.profile` 或者 `~/.bashrc`，`~`表示当前用户的用户目录。或者是前文提到的新建的`home`文件夹。

```bash
env=~/.ssh/agent.env

agent_load_env () { test -f "$env" && . "$env" >| /dev/null ; }

agent_start () {
    (umask 077; ssh-agent >| "$env")
    . "$env" >| /dev/null ; }

agent_load_env

# agent_run_state: 0=agent running w/ key; 1=agent w/o key; 2= agent not running
agent_run_state=$(ssh-add -l >| /dev/null 2>&1; echo $?)

if [ ! "$SSH_AUTH_SOCK" ] || [ $agent_run_state = 2 ]; then
    agent_start
    ssh-add
# 若要 ssh-agent 运行一段时间后自动停止，可将上面一行改成 ssh-add -t <seconds>
# 比如本人设置成了 ssh-add -t 1800
elif [ "$SSH_AUTH_SOCK" ] && [ $agent_run_state = 1 ]; then
    ssh-add
fi

unset env
```


#### 详细讲解：

第1步：创建SSH Key。在用户主目录下，看看有没有.ssh目录，如果有，再看看这个目录下有没有id_rsa和id_rsa.pub这两个文件，如果已经有了，可直接跳到下一步。如果没有，打开Shell（Windows下打开Git Bash），创建SSH Key：

```bash
$ ssh-keygen -t rsa -C "youremail@example.com"
```

你需要把邮件地址换成你自己的邮件地址，然后一路回车，使用默认值即可，由于这个Key也不是用于军事目的，所以也无需设置密码。

如果一切顺利的话，可以在用户主目录里找到.ssh目录，里面有id_rsa和id_rsa.pub两个文件，这两个就是SSH Key的秘钥对，id_rsa是私钥，不能泄露出去，id_rsa.pub是公钥，可以放心地告诉任何人。

第2步：登陆GitHub，打开“Account settings”，“SSH Keys”页面：

然后，点“Add SSH Key”，填上任意Title，在Key文本框里粘贴id_rsa.pub文件的内容：
![廖雪峰的blog图片](https://www.liaoxuefeng.com/files/attachments/001384908342205cc1234dfe1b541ff88b90b44b30360da000/0)

> 图片来自： [廖雪峰的官方网站](https://www.liaoxuefeng.com/wiki/0013739516305929606dd18361248578c67b8067c8c017b000/0013752340242354807e192f02a44359908df8a5643103a000)

点“Add Key”，你就应该看到已经添加的Key。


### 参考：

[generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent](https://help.github.com/articles/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent/)  
[adding-a-new-ssh-key-to-your-github-account](https://help.github.com/articles/adding-a-new-ssh-key-to-your-github-account/)  
[working-with-ssh-key-passphrases](https://help.github.com/articles/working-with-ssh-key-passphrases/)  
[CMD 和 Git 中的代理设置](http://www.cnblogs.com/terrylin/p/3296428.html)   

### 拓展阅读

[git pull介绍](http://www.yiibai.com/git/git_pull.html)

[在线学习git命令](https://learngitbranching.js.org/)

