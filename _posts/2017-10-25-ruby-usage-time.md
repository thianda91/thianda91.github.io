---
layout: post
title: Ruby 时间日期用法
key: 2017-10-25
categories: notes
tags: notes
---
### `Time`类相关
格式化应用实例：

```ruby
puts Time.now.strftime("%Y-%m-%d %H:%M:%S") #2012-03-06 15:28:08
puts Time.now.strftime("%x %I:%M %p") #03/06/12 03:39 PM
```

<!--more-->

===
所有`strftime`方法中可用的格式化符号：


```
%a 星期的缩写，如Wed
%A 星期的全称，如Wednesday
%U 本星期在全年中所属的周数
%W
%H 小时(24小时制)
%M 分钟
%S 秒
%I 小时(12小时制)
%p PM 或 AM
%b 月份的缩写,如 Jan
%B 月份的全称,如 January
%c 本地日期和时间，如 06/14/07 16:43:49
%d 日期 (1..31)
%j 本日在一年中所属的天 (1..366)
%m 月份 (1..12)
%w 星期的数字形式 (0..6)
%x 本地日期，如 06/14/07
%X 本地时间，如 16:43:49
%y 2位的年份表示，如07
%Y 4位的年份表示，如2007
%Z 时区名，如"中国标准时间"
%% 字面符号%
```

我们可以使用`Time`类来生成一个当前时间的对象:
```ruby
t = Time.new
```

或

```ruby
t = Time.now
```
`Time`类有类方法`mktime`(同义方法是local方法)来根据传入的参数生成时间对象，并且它使用的是当前的时区：

```ruby
t1 = Time.mktime(2001) # January 1, 2001 at 0:00:00
t2 = Time.mktime(2001,3)
t3 = Time.mktime(2001,3,15)
t4 = Time.mktime(2001,3,15,21)
t5 = Time.mktime(2001,3,15,21,30)
t6 = Time.mktime(2001,3,15,21,30,15) # March 15, 2001 9:30:15 pm
```

`Time.gm`(同义方法是`Time.utc`)方法基本上和上面的`mktime`用法相同，但它使用的是GMT或UTC时区
```ruby
t8 = Time.gm(2001,3,15,21,30,15)
t9 = Time.utc(2001,3,15,21,30,15)
```

生成的时间对象有一个to_a方法，可以把时间相关一信息转化成一个数组，数组中存放的信息格式如下：

```
seconds,
minutes,
hours,
day,
month,
year,
day of week (0..6),
day of year (1..366),
daylight saving (true or false),
and time zone (as a string)
```

因此，我们也可以这么用：

```ruby
t0 = Time.local(0,15,3,20,11,1979,2,324,false,"GMT-8:00")
t1 = Time.gm(*Time.now.to_a)
```

使用秒数来创建日期：

====================================================

在内部，日期存储为一个整数，代表从1970年开始到当前的秒数，我们可以获取这么秒数或则利用这个秒数来创建日期：

```ruby
epoch = Time.at(0) # Find the epoch (1 Jan 1970 GMT)
newmil = Time.at(978307200) # Happy New Millennium! (1 Jan 2001)
now = Time.now # 16 Nov 2000 17:24:28
sec = now.to_i # 974424268
```