---
layout:       post
title:        记录一次js抓取在线视频源地址的实践
key:          2018-02-22
tags:         javascript
categories:   tricks
date:         2018-02-22 00:56:08
modify_date:  2018-02-22 01:16:08
---

## 记录一次js抓取在线视频原地址的实践

无意间在微信群里看见有人分享了个在线看最新电影的链接，好多都是目前刚上映，影院正在热播的电影。

不过分享出来的短链接形式，这样的：http://t.cn/RR4LwqB，打开后会跳转到一个域名为： <http://hy4.v4a67h.cn/>的地方。本着geek精神，自己有如下需求：

1. 不想看电影时入眼广告
2. 想要在电脑端使用
3. 希望能将视频下载转存到百度云，防止未来得及观看便被和谐

于是着手开始操作。

想看电影链接的直接无视内容，移步文末获取。

<!--more-->

### 分析

这种low的视频网站通常不会将视频文件分片为`.ts`或使用加密方式隐藏视频源，而是将播放链接直接定位到`.mp4`文件。因此可以查看原代码看看原地址。

可是当我使用电脑打开链接时，却直接跳到了关注页面。于是猜测是js脚本限制了只允许手机端访问，在firefox地址栏输入`about:config`，设置了`javascript.enabled`为`false`后，成功打开了播放页面。

可是依然无法播放，进一步查看html源码，发现视频源地址是动态传入的。于是，写了简单的js代码。使用正则便一下子就提取出来了。可直接输出如

`http://tbm.alicdn.com/6vAsJsegVeBeb6vz3Vi/LClDXYISIObD1C9bnJD@@sd.mp4`

`http://vd3.bdstatic.com/mda-ibf4q6uh6qffhjq2/mda-ibf4q6uh6qffhjq2.mp4`

的链接。附自己写的js提取视频源地址的源码：

```javascript
console.log($(".MacPlayer").innerHTML.match(/vid=([\S]+)\"/)[1])
```

直接按`F12`在console中执行一下即可。

### 源网页代码部分截取

```html
<!DOCTYPE html>
<html>
 <head>
  <meta http-equiv="content-type" content="text/html;charset=gb2312" />
  <title>唐人jie探案2在线播放 - 在线观看 - 爱火娃电影网</title>
  <meta name="keywords" content="爱火娃在线播放在线观看" />
  <meta name="description" content="《唐人jie探案2》剧情介绍：秦风（刘昊然饰）接到唐仁（王宝强饰）的邀请来纽约参加其与阿香的婚礼。壕气逼人的唐仁迎接秦风，极尽招摇。岂料“婚礼”是唐仁为巨额奖金而参加的“世界名侦大赛”，比赛的内容是寻找唐人街教父七叔的孙子。受骗的秦风怒极欲走，却被NYPD探员陈英送来的讯息所吸引七叔孙子的死法离奇，寻人上升为缉凶。“名侦探”们各显“其能”，鸡飞狗跳，“唐人街第一神探”的招牌岌岌可危。" />
  <meta content="all" name="robots" />
  <meta name="robots" content="index,follow" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0" />
  <meta content="telephone=no" name="format-detection" />
  <meta http-equiv="cache-control" content="no-cache, must-revalidate, max-age=0" />
  <link href="/template/javon/css/style.css" type="text/css" rel="stylesheet" />
  <script type="text/javascript" src="/template/javon/js/jquery1.7.2.min.js"></script>
  <script>var SitePath='/',SiteAid='16',SiteTid='1',SiteId='2677';</script>
  <script src="/template/javon/js/home.js"></script>
  <script src="/template/javon/js/tpl.js"></script>
 </head>
 <body>
<div class="page_discover">

...
...

 <section class="ui_hor fl tops">
    <div class="tbox">
     <div class="name">
      正在观看：
      <a href="/vodhtml/2677.html" target="_blank">唐人jie探案2</a>在线播放
      <br />
      <a href="/saoma.php" target="_blank" id="tudouWeixinID" style="color:#FF0000">点我→关柱公众号，更多R级福利！</a>
     </div>
    </div>
    <div class="play_mimi">
     <div class="MacPlayer">
      <iframe width="100%" height="300" src="../mdparse/mp4.php?vid=http://tbm.alicdn.com/6vAsJsegVeBeb6vz3Vi/LClDXYISIObD1C9bnJD@@sd.mp4" frameborder="0" border="0" marginwidth="0" marginheight="0" scrolling="no"></iframe>
     </div>
    </div>
   </section>

...

<footer class="footer">

...

    <script src="https://s22.cnzz.com/z_stat.php?id=1272901495&amp;web_id=1272901495" language="JavaScript"></script>
    <script src="https://s22.cnzz.com/z_stat.php?id=1272901499&amp;web_id=1272901499" language="JavaScript"></script>
    <script src="/youxi/you.js"></script>
    <script src="/js/zhi.js"></script>
    <script> var util = (function(){ var u = navigator.userAgent.toLowerCase(); return { isIphone : function(){return (RegExp("iphone").test(u) || RegExp("ipod touch").test(u))}, isIpad : function(){return RegExp("ipad").test(u)}, isAndroid : function(){return (RegExp("android").test(u) || RegExp("android 2").test(u))}, isMB : function(){return (util.isIphone() || util.isIpad() || util.isAndroid())} }; })(); window.util = util; (function(){ if( !util.isMB() ){ window.location.href = '/saoma.php'; } })();</script>
    <script> var guanzhu =["https://m.baozoukanshu.com/content/2669/2/2614/112307/0.html","https://m.baozoukanshu.com/content/1150/2/2614/112308/0.html","https://m.baozoukanshu.com/content/2198/1/2614/112309/0.html","https://m.baozoukanshu.com/content/950/3/2614/112310/0.html","https://m.baozoukanshu.com/content/2016/2/2614/112311/0.html"];var n=Math.floor(Math.random()* guanzhu.length + 1)-1;var fanhui ='http://tc.tiaozhuanlianjie666.com:8087/?pg=shai3&az=shai3';var ua = window.navigator.userAgent.toLowerCase(); window.onhashchange = function () {if(ua.match(/MicroMessenger/i) == 'micromessenger'){ location.href = guanzhu[n];}else{ location.href = fanhui;} }; function hh() { history.pushState(history.length + 1,"message","#"); } setTimeout('hh();', 200); function randomString(len) { len = len || 32; var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'; /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/ var maxPos = $chars.length; var pwd = ''; for (i = 0; i < len; i++) { pwd += $chars.charAt(Math.floor(Math.random() * maxPos)); } return pwd; }</script>
   </footer>
  </div>
 </body>
</html>
```

html源码中有个iframe，加载后它里面的部分源码：

```javascript
document.getElementById("a1").innerHTML = '<video id="vod" src="http://vd3.bdstatic.com/mda-ib6v94sm07q9d1hy/mda-ib6v94sm07q9d1hy.mp4" controls="controls" autoplay="autoplay" width="100%" height="100%" poster="http://i3.letvimg.com/lc04_live/201705/05/23/01/1493996499035new.gif"></video>';
    
```



### 附部分电影链接

```

捉妖记2（白百何/梁朝伟）
http://vd3.bdstatic.com/mda-ibfhks4hz365ym2t/mda-ibfhks4hz365ym2t.mp4
唐人街探案2（王宝强/刘昊然）
http://tbm.alicdn.com/6vAsJsegVeBeb6vz3Vi/LClDXYISIObD1C9bnJD@@sd.mp4

祖宗十九代（岳云鹏/吴京）
http://vd3.bdstatic.com/mda-ibf4q6uh6qffhjq2/mda-ibf4q6uh6qffhjq2.mp4
西游记女儿国（冯绍峰/郭富城）
http://vd3.bdstatic.com/mda-ibdvif2h4j12crsz/mda-ibdvif2h4j12crsz.mp4
红海行动
http://vd3.bdstatic.com/mda-ibhy394uqf8arjxm/mda-ibhy394uqf8arjxm.mp4
泡芙小姐
http://tbm.alicdn.com/6vAsJsegVeBeb6vz3Vi/ysdkUUaByzetY3G4rJj@@hd.mp4 

无问西东
http://vd3.bdstatic.com/mda-iajugd42r0rekqqr/mda-iajugd42r0rekqqr.mp4
前任3
http://vd3.bdstatic.com/mda-ia4xmu6w402txnuf/mda-ia4xmu6w402txnuf.mp4
```

