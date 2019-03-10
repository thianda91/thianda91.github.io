---
layout:       article
title:        基于 ffmpeg 的视频文件编辑操作
key:          2019-02-16
tags:         ffmpeg
categories:   notes
created_date: 2019-02-16 23:26:35
date:         2019-03-11 02:15:43
---

使用`ffmpeg`，将下载的视频文件进行格式转换等编辑操作。

ffmpeg 官方 Wiki 为 ：<https://trac.ffmpeg.org/>

<!--more-->

## 提取字幕

<https://blog.csdn.net/achang21/article/details/49128785>

```sh 
# 可提取多种格式
ffmpeg -i xx.mkv -map 0:s:0 xxx.srt
ffmpeg -i xx.mkv -map 0:s:0 xxx.ass
# 下面的方法需确保已知内置的字幕的格式，后缀名不匹配则报错，故推荐上面的方式
ffmpeg -i xx.mkv -an -vn -scodec copy xxx.ass
```

## 将字幕烧进视频文件

<https://trac.ffmpeg.org/wiki/HowToBurnSubtitlesIntoVideo>

```sh
ffmpeg -i xx.mkv -vf subtitles=xx.mkv output.mp4
ffmpeg -i xx.mkv -vf subtitles=xxx.ass output.mp4
```

此过程耗时较长

## m3u8 转 MP4 

即根据  m3u8 文件下载视频并合并成 MP4：

```sh
ffmpeg -i "http://xxx.xxx/xxx.m3u8" -codec copy output.mp4
```

## MP4 转 m3u8

### 最简单的方法

```sh
ffmpeg -i test.mp4 -c copy -f segment -segment_list playlist.m3u8 -segment_time 10 output%03d.ts
```

### 网上查到的

**1. 将 MP4 转成 ts**

```sh
ffmpeg -i test.mp4 -codec copy -bsf h264_mp4toannexb test.ts

ffmpeg -i test.mp4 -codec copy test.ts
```

**2. 将 ts 转成 m3u8**

`ffmpeg -i 待转换ts文件路径 -c copy -map 0 -f segment -segment_list 目标m3u8文件 -segment_time 单个切片时长 目标ts切片文件名称`

```sh
ffmpeg -i test.ts -c copy -map 0 -f segment -segment_list playlist.m3u8 -segment_time 10 output%03d.ts
```

### 其他不推荐的方法

```sh
ffmpeg -i test.mp4 -c:a aac -strict -2 -f hls -hls_list_size 0 -hls_list_size 5 ddd.m3u8
```

此方法直接将 mp4 文件切片，但是执行效率超级慢。而方法一瞬间完成。

## 截取片段

<https://trac.ffmpeg.org/wiki/Seeking>

```sh
ffmpeg -i input.wmv -ss 00:02:10.0 -to 00:02:20.0 -c copy output.wmv
ffmpeg -i input.wmv -ss 30 -t 10 -c copy output.wmv

# 值得注意的是，ffmpeg 为了加速，会使用关键帧技术， 所以有时剪切出来的结果在起止时间上未必准确。 通常来说，把 -ss 选项放在 -i 之前，会使用关键帧技术； 把 -ss 选项放在 -i 之后，则不使用关键帧技术。 如果要使用关键帧技术又要保留时间戳，可以加上 -copyts 选项：
ffmpeg -ss 00:01:00 -i video.mp4 -to 00:02:00 -c copy -copyts cut.mp4
```

## 修改编码格式

```sh
# 内部编码器
ffmpeg -i input.mp4 -vcodec h265 output.mp4
# 调用外部编码器
ffmpeg -i input.mp4 -c:v libx265 output.mp4
```

## 修改分辨率

这里收集了常用的命令：https://www.cnblogs.com/frost-yen/p/5848781.html>

`-vf` 表示使用过滤器，很多操作都属于过滤器的功能。

```sh
# 与原视频比例不一致会变形
ffmpeg -i input.mp4 -strict -2 -s 640x480 output.mp4
# -1 表示按比例缩放
ffmpeg -i input.mp4 -strict -2 -vf scale=-1:1080 output.mp4
ffmpeg -i input.mp4 -strict -2 -vf scale=1920:-1 output.mp4
```

## 修改码率

修改码率为 2000k：

```sh
ffmpeg -i input.mp4 -b:v 2000k -bufsize 2000k output.mp4
```

