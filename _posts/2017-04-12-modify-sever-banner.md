---
layout: article
title: 修改常见服务器的banner
key: 2017-04-12
tags: safe
categories: notes
created_date: 2017-04-12 10:35
date: 2018-01-25 00:41:28
---

## 干货写在前面
### IIS web.config配置 
```xml
<!-- 下面的配置修改 HTTP RESPONSE header 中的 Server 消息-->
<system.webServer>
  <rewrite>
    <outboundRules>
      <rule name="Modify RESPONSE_Server">
        <match serverVariable="RESPONSE_Server" pattern=".+" />
        <action type="Rewrite" value="XiandaWebServer" />  <!-- 修改Server值 -->
      </rule>
    </outboundRules>
  </rewrite>
</system.webServer>
<system.web>
  <sessionState cookieName="_Xianda" />  <!-- 修改ASP.NET_SessionId名称 -->
  <httpRuntime enableVersionHeader="false" />  <!-- 移除不必要的响应头 -->
</system.web>
```
使用IIS管理器，在HTTP响应头模块中可设置修改`X-Powered-By`的值。

### Apache httpd.conf配置

```ini
ServerTokens ProductOnly
ServerSignature Off
ProxyVia Block
```
### PHP php.ini配置

```ini
expose_php=Off
session.name=__Xianda
```

<!--more-->

***
`curl -I yourdomain.com` 能看到什么？ Server: Apache xxx PHP xxx XXX xxx ，明码实价，一字排开。这是干嘛，卖菜呢？

我们不妨看看 `curl -I www.google.com` 结果如何：
```ini
HTTP/1.1 302 Found
Cache-Control: private
Location: http://sorry.google.com/sorry/?continue=http://www.google.com/
date: Mon, 12 Jan 2009 06:57:41 GMT
Content-Type: text/html; charset=UTF-8
Server: GFE/1.3
Content-Length: 259
```
请注意这里 Google 的前端 Web Server 是 GFE/1.3 （Google Front Edge 1.3），至于它具体对应 Apache 1.3.x 还是 Windows 1.3，我们并不知晓。这样就起到了很好的信息隐藏作用，一旦网上发现 Apache 1.3.x 或者 Windows 1.3 的最新漏洞，黑客们并不会直接联想到 GFE/1.3，自然也就不会来多作尝试了。

所以，我们应该把这些不可告人的秘密都隐藏起来，哪怕放一段文字广告（如：` [AD: DangDang http://example.com/2dangdang ][ Your AD Here ][AD: Joyo http://example.com/2amazon ]`），也比卖菜似的一一详细罗列版本要好。


参考解决方案：

### 1. Lighttpd 1.4.20

`src/response.c:108` 改为：
```ini
buffer_append_string_len(b, CONST_STR_LEN("/r/nServer: [AD: DangDang http://example.com/2dangdang ][ Your AD Here ][AD: Joyo http://example.com/2amazon ]"));
```
输出 Header：
```ini
HTTP/1.1 404 Not Found
Content-Type: text/html
Content-Length: 345
date: Mon, 12 Jan 2009 13:54:02 GMT
Server: [AD: DangDang http://example.com/2dangdang ][ Your AD Here ][AD: Joyo http://example.com/2amazon ]
```

### 2. Nginx 0.7.30

`src/http/ngx_http_header_filter_module.c:48-49` 改为：
```ini
static char ngx_http_server_string[] = "Server: [AD: DangDang http://example.com/2dangdang ][ Your AD Here ][AD: Joyo http://example.com/2amazon ]" CRLF;
static char ngx_http_server_full_string[] = "Server: [AD: DangDang http://example.com/2dangdang ][ Your AD Here ][AD: Joyo http://example.com/2amazon ]" CRLF;
```
输出 Header：
```ini
HTTP/1.1 200 OK
Server: [AD: DangDang http://example.com/2dangdang ][ Your AD Here ][AD: Joyo http://example.com/2amazon ]
date: Mon, 12 Jan 2009 14:01:10 GMT
Content-Type: text/html
Content-Length: 151
Last-Modified: Mon, 12 Jan 2009 14:00:56 GMT
Connection: keep-alive
Accept-Ranges: bytes
```

### 3. Cherokee 0.11.6

`cherokee/version.c:93` 添加：
```ini
ret = cherokee_buffer_add_str (buf, "[AD: DangDang http://example.com/2dangdang ][ Your AD Here ][AD: Joyo http://example.com/2amazon ]");
return ret;
```
输出 Header：
```ini
HTTP/1.1 200 OK
Connection: Keep-Alive
Keep-Alive: timeout=15
date: Mon, 12 Jan 2009 14:54:39 GMT
Server: [AD: DangDang http://example.com/2dangdang ][ Your AD Here ][AD: Joyo http://example.com/2amazon ]
ETag: 496b54af=703
Last-Modified: Mon, 12 Jan 2009 14:33:19 GMT
Content-Type: text/html
Content-Length: 1795
```


### 4. Apache 2.2.11

`server/core.c:2784` 添加：

```ini
ap_add_version_component(pconf, "[AD: DangDang http://example.com/2dangdang ][ Your AD Here ][AD: Joyo http://example.com/2amazon ]");
return;
```
输出 Header：
```ini
HTTP/1.1 200 OK
date: Mon, 12 Jan 2009 14:28:10 GMT
Server: [AD: DangDang http://example.com/2dangdang ][ Your AD Here ][AD: Joyo http://example.com/2amazon ]
Last-Modified: Sat, 20 Nov 2004 20:16:24 GMT
ETag: "1920edd-2c-3e9564c23b600"
Accept-Ranges: bytes
Content-Length: 44
Content-Type: text/html
```

### 5. Squid 3.0 STABLE 11

`src/globals.cc:58` 改为：
```ini
const char *const full_appname_string = "[AD: DangDang http://example.com/2dangdang ][ Your AD Here ][AD: Joyo http://example.com/2amazon ]";
```
输出 Header：
```ini
HTTP/1.0 400 Bad Request
Server: [AD: DangDang http://example.com/2dangdang ][ Your AD Here ][AD: Joyo http://example.com/2amazon ]
Mime-Version: 1.0
date: Mon, 12 Jan 2009 15:25:15 GMT
Content-Type: text/html
Content-Length: 1553
Expires: Mon, 12 Jan 2009 15:25:15 GMT
X-Squid-Error: ERR_INVALID_URL 0
X-Cache: MISS from 'cache.hutuworm.org'
Via: 1.0 'cache.hutuworm.org' ([AD: DangDang http://example.com/2dangdang ][ Your AD Here ][AD: Joyo http://example.com/2amazon ])
Proxy-Connection: close
```

### 6. Tomcat 6.0.18

`java/org/apache/coyote/http11/Constants.java:56 和 java/org/apache/coyote/ajp/Constants.java:236` 均改为：
```ini
ByteChunk.convertToBytes("Server: [AD: DangDang http://example.com/2dangdang ][ Your AD Here ][AD: Joyo http://example.com/2amazon ]" + CRLF);
```
输出 Header：
```ini
HTTP/1.1 200 OK
Server: [AD: DangDang http://example.com/2dangdang ][ Your AD Here ][AD: Joyo http://example.com/2amazon ]
ETag: W/"7857-1216684872000"
Last-Modified: Tue, 22 Jul 2008 00:01:12 GMT
Content-Type: text/html
Content-Length: 7857
date: Mon, 12 Jan 2009 16:30:44 GMT
```

###7. JBoss 5.0.0 GA

a. `tomcat/src/resources/web.xml:40` 改为
```ini
[AD: DangDang http://example.com/2dangdang ][ Your AD Here ][AD: Joyo http://example.com/2amazon ]
```

b. 下载 JBoss Web Server 2.1.1.GA srctar （http://www.jboss.org/jbossweb/downloads/jboss-web/）
`
java/org/apache/coyote/http11/Constants.java:56 和 java/org/apache/coyote/ajp/Constants.java:236 `均改为：
```ini
ByteChunk.convertToBytes("Server: [AD: DangDang http://example.com/2dangdang ][ Your AD Here ][AD: Joyo http://example.com/2amazon ]" + CRLF);
```
将编译所得 jbossweb.jar 覆盖 JBoss 编译输出文件：
```ini
JBOSS_SRC/build/output/jboss-5.0.0.GA/server/all/deploy/jbossweb.sar/jbossweb.jar
JBOSS_SRC/build/output/jboss-5.0.0.GA/server/standard/deploy/jbossweb.sar/jbossweb.jar
JBOSS_SRC/build/output/jboss-5.0.0.GA/server/default/deploy/jbossweb.sar/jbossweb.jar
JBOSS_SRC/build/output/jboss-5.0.0.GA/server/web/deploy/jbossweb.sar/jbossweb.jar
```
输出 Header：
```ini
HTTP/1.1 200 OK
Server: [AD: DangDang http://example.com/2dangdang ][ Your AD Here ][AD: Joyo http://example.com/2amazon ]
X-Powered-By: [AD: DangDang http://example.com/2dangdang ][ Your AD Here ][AD: Joyo http://example.com/2amazon ]
Accept-Ranges: bytes
ETag: W/"1581-1231842222000"
Last-Modified: Tue, 13 Jan 2009 10:23:42 GMT
Content-Type: text/html
Content-Length: 1581
date: Tue, 13 Jan 2009 10:30:42 GM
```
