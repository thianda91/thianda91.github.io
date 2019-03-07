---
layout:       article
title:        视频格式互转--.m3u8文件
key:          2019-02-16
tags:         video m3u8
categories:   notes
created_date: 2019-02-16 23:26:35
date:         2019-03-08 00:31:43
---

使用`ffmpeg`，将 mp4 切片成 ts 格式文件，并生成 m3u8 列表。

<!--more-->

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