---
layout:       article
title:        EOMS 故障处理工单(设备) 自动回单脚本
key:          2018-02-06
tags:         javascript
categories:   script
date:         2018-02-06 11:51:38
modify_date:  2018-02-22 01:43:56
---

EOMS 故障处理工单(设备) 自动回单脚本。直接复制粘贴底部的压缩版本即可一键回单。

<!--more-->

> 在IE9下，工单详细页按F12调试，点击控制台面板，下面即可输入  
> 在IE8下，工单详细页按F12调试，点击脚本面板，右侧控制台下面即可输入  

### 源码

```javascript
/**
// EOMS 故障处理工单(设备) 自动回单脚本
// 在IE9下，工单详细页按F12调试，点击控制台面板
// 直接复制粘贴底部的压缩版本即可。
// 一键回单
// Author Xianda
// version 1.0
/**/

var $o = function(arg) {
		return document.getElementById(arg);
	};
// 点击受理 按钮
$o("bpp_Btn_ACCEPT")&&$o("bpp_Btn_ACCEPT").click();
// 点击完成处理 按钮
$o("bpp_ActPanel").currentStyle.display=="none"&&$o("bpp_Btn_T2Finish").click();
// 点击完成处理按钮后延时填写
setTimeout(function() {
	// 滚动页面到最底部（点击完成处理后，页面内容变多，）
	window.scrollTo(0, 5000);
	var boolean = $o("ClearINCTime").value == "";
	if (boolean) {
		// 无清除时间自动添加为当前时间
		var xianda_t = function() {
			var now = new Date();
			var year = now.getFullYear();
			var month = now.getMonth() + 1;
			var date = now.getDate();
			var hour = now.getHours();
			var minu = now.getMinutes();
			var sec = now.getSeconds();
			if (month < 10) month = "0" + month;
			if (date < 10) date = "0" + date;
			if (hour < 10) hour = "0" + hour;
			if (minu < 10) minu = "0" + minu;
			if (sec < 10) sec = "0" + sec;
			var time = year + "-" + month + "-" + date + " " + hour + ":" + minu + ":" + sec;
			return time
		};
		$o("ClearINCTime").value = xianda_t()
	};	
	// 可自定义回复规则
	function sc(){
		$o("ReasonType").value = "传输线路";
		$o("ReasonSubType").value = "传输线路故障";
		$o("FinishDealDesc").value = "光缆质量下降，导致性能值不在标准范围内";
		$o("DealGuomodo").value = "更换或修复故障纤芯后，故障恢复。";
		$o("isHomeService").value = "否";
	}
	function other(){
		$o("ReasonType").value = "其他";
		$o("ReasonSubType").value = "其他原因";
		$o("FinishDealDesc").value = "告警自动恢复"; // 填写你的自定义故障原因
		$o("DealGuomodo").value = "告警已自动恢复"; // 填写你的自定义处理措施
		$o("isHomeService").value = "否";
	}
	// 写入回复
	sc();
	// 点击提交按钮
	if(boolean&&$o("AttachmentsList_tagDownloadTable").childNodes[1].childNodes[1].innerHTML.indexOf("无附件!")){
		if(confirm("确认无附件 提交？\n\n【确认】 提交，【取消】 返回")){
			ActionPanel.submit();
		}
	}else{
		ActionPanel.submit();
	}
}, 1000);
```

**为方便在IE9浏览器的调试模式执行。可使用压缩版本（单行），直接复制粘贴运行**

### 传输原因：

```javascript
var $o=function(b){return document.getElementById(b)};$o("bpp_Btn_ACCEPT")&&$o("bpp_Btn_ACCEPT").click();"none"==$o("bpp_ActPanel").currentStyle.display&&$o("bpp_Btn_T2Finish").click();setTimeout(function(){window.scrollTo(0,5E3);var b=""==$o("ClearINCTime").value;if(b){var g=$o("ClearINCTime"),a=new Date,h=a.getFullYear(),c=a.getMonth()+1,d=a.getDate(),e=a.getHours(),f=a.getMinutes(),a=a.getSeconds();10>c&&(c="0"+c);10>d&&(d="0"+d);10>e&&(e="0"+e);10>f&&(f="0"+f);10>a&&(a="0"+a);g.value=h+"-"+c+"-"+d+" "+e+":"+f+":"+a}$o("ReasonType").value="\u4f20\u8f93\u7ebf\u8def";$o("ReasonSubType").value="\u4f20\u8f93\u7ebf\u8def\u6545\u969c";$o("FinishDealDesc").value="\u5149\u7f06\u8d28\u91cf\u4e0b\u964d\uff0c\u5bfc\u81f4\u6027\u80fd\u503c\u4e0d\u5728\u6807\u51c6\u8303\u56f4\u5185";$o("DealGuomodo").value="\u66f4\u6362\u6216\u4fee\u590d\u6545\u969c\u7ea4\u82af\u540e\uff0c\u6545\u969c\u6062\u590d\u3002";$o("isHomeService").value="\u5426";b&&$o("AttachmentsList_tagDownloadTable").childNodes[1].childNodes[1].innerHTML.indexOf("\u65e0\u9644\u4ef6!")?confirm("\u786e\u8ba4\u65e0\u9644\u4ef6 \u63d0\u4ea4\uff1f\n\n\u3010\u786e\u8ba4\u3011 \u63d0\u4ea4\uff0c\u3010\u53d6\u6d88\u3011 \u8fd4\u56de")&&ActionPanel.submit():ActionPanel.submit()},1E3);
```

### 其他原因：

```javascript
var $o=function(b){return document.getElementById(b)};$o("bpp_Btn_ACCEPT")&&$o("bpp_Btn_ACCEPT").click();"none"==$o("bpp_ActPanel").currentStyle.display&&$o("bpp_Btn_T2Finish").click();setTimeout(function(){window.scrollTo(0,5E3);var b=""==$o("ClearINCTime").value;if(b){var g=$o("ClearINCTime"),a=new Date,h=a.getFullYear(),c=a.getMonth()+1,d=a.getDate(),e=a.getHours(),f=a.getMinutes(),a=a.getSeconds();10>c&&(c="0"+c);10>d&&(d="0"+d);10>e&&(e="0"+e);10>f&&(f="0"+f);10>a&&(a="0"+a);g.value=h+"-"+c+"-"+d+" "+e+":"+f+":"+a}$o("ReasonType").value="\u5176\u4ed6";$o("ReasonSubType").value="\u5176\u4ed6\u539f\u56e0";$o("FinishDealDesc").value="\u544a\u8b66\u81ea\u52a8\u6062\u590d";$o("DealGuomodo").value="\u544a\u8b66\u5df2\u81ea\u52a8\u6062\u590d";$o("isHomeService").value="\u5426";b&&$o("AttachmentsList_tagDownloadTable").childNodes[1].childNodes[1].innerHTML.indexOf("\u65e0\u9644\u4ef6!")?confirm("\u786e\u8ba4\u65e0\u9644\u4ef6 \u63d0\u4ea4\uff1f\n\n\u3010\u786e\u8ba4\u3011 \u63d0\u4ea4\uff0c\u3010\u53d6\u6d88\u3011 \u8fd4\u56de")&&ActionPanel.submit():ActionPanel.submit()},1E3);
```

#### 设备故障

```javascript
var $o=function(b){return document.getElementById(b)};$o("bpp_Btn_ACCEPT")&&$o("bpp_Btn_ACCEPT").click();"none"==$o("bpp_ActPanel").currentStyle.display&&$o("bpp_Btn_T2Finish").click();setTimeout(function(){window.scrollTo(0,5E3);var b=""==$o("ClearINCTime").value;if(b){var g=$o("ClearINCTime"),a=new Date,h=a.getFullYear(),c=a.getMonth()+1,d=a.getDate(),e=a.getHours(),f=a.getMinutes(),a=a.getSeconds();10>c&&(c="0"+c);10>d&&(d="0"+d);10>e&&(e="0"+e);10>f&&(f="0"+f);10>a&&(a="0"+a);g.value=h+"-"+c+"-"+d+" "+e+":"+f+":"+a}$o("ReasonType").value="\u5176\u4ed6";$o("ReasonSubType").value="\u5176\u4ed6\u539f\u56e0";$o("FinishDealDesc").value="\u8bbe\u5907\u6545\u969c";$o("DealGuomodo").value="\u544a\u8b66\u5df2\u81ea\u52a8\u6062\u590d";$o("isHomeService").value="\u5426";b&&$o("AttachmentsList_tagDownloadTable").childNodes[1].childNodes[1].innerHTML.indexOf("\u65e0\u9644\u4ef6!")?confirm("\u786e\u8ba4\u65e0\u9644\u4ef6 \u63d0\u4ea4\uff1f\n\n\u3010\u786e\u8ba4\u3011 \u63d0\u4ea4\uff0c\u3010\u53d6\u6d88\u3011 \u8fd4\u56de")&&ActionPanel.submit():ActionPanel.submit()},1E3);
```

在线js压缩工具： https://tool.lu/js/

### 后续

仔细阅读了源码，发现 [神州泰岳](http://www.ultrapower.com.cn)（emos系统的开发厂家）自己封装了一些Util类，于是乎我可以进一步优化代码，使用封装类精简我的源码，比如已知有如下用法：

```javascript
// 获取类
F(a).G();	//获取选择器为a的元素的值（通常为input的value）
F(a).S(value);	//设置id为a的input的value
// 扩展了Date类的原型，给Date原型的函数pattern传入格式参数即可自动返回格式化的时间字符串。
(new Date()).pattern("yyyy-MM-dd hh:mm:ss")

```
代码片段也发布在了[这里](https://gitee.com/yuxianda/codes/bums2hl3q0a97jk56gzdy42#EOMS%20%E6%95%85%E9%9A%9C%E5%A4%84%E7%90%86%E5%B7%A5%E5%8D%95(%E8%AE%BE%E5%A4%87)%20%E8%87%AA%E5%8A%A8%E5%9B%9E%E5%8D%95%E8%84%9A%E6%9C%AC%202.0-%E6%9C%AA%E9%AA%8C%E8%AF%81%E3%80%82)。

