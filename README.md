## X.Da 的博客

- 基于 jekyll 的博客
- [jekyll-TeXt-theme](https://github.com/kitian616/jekyll-TeXt-theme) 主题，并做自定义改动

## 修改内容

### favicon.ico

根据 F12 修改对应路径下的 `.ico` 和 `.png`

> /asset/ 目录下

打开 `_includes/svg/logo.svg`，修改颜色：

```svg
.st0{fill:#00ce00;}
```



### header

`_includes\header.html` line 17 增加`sub-title`显示`site.description`

```html
<div class="site-sub-title">{{ site.description }}</div>
```

`_sass\components\_header.scss` line 83 增加样式

```scss
& > .site-sub-title {
      padding-left: 20px;
      display: inline-block;
      font-size: map-get($base, font-size-h4-xs);
      line-height: 1.5;
}
```

导航 删除 `.html`后缀

修改 `_data/navigation.yml`：

```yaml
# 添加 
  - titles:
      zh      : &ZH_HANS  主页
    url: /
# 删除 归档和 关于的 .html 后缀
```

修改 `_config.yml`：（默认`none`，带 `.html`后缀）

```yaml
permalink: /:categories/:title # none
```

### 主题风格

`_sass\skins\_default.scss`中改成绿色：

```
$main-color-1：#50cf4d;
```

`_sass\common\_variables.scss`中：

```
content-max-width: 1050px;
```

`_includes\tags.html` line 22， `Show All` 改成 `全部`

### footer

模板`_inclides\atticle-footer.html`

将`<footer>`中的`<span> dateModified`（page.modify_date）复制到

模版`_layouts\article.html`的`<div class="layout--article">`里面。需要包含 `{%- include -%}` 和 `{%- if -%}` 标签。并给 `<span>`标签 添加  ` class="dateModified"`。

模板`_inclides\atticle-footer.html` 的`<footer class="article__footer">`前面新增：

```html
<hr style="background-color:#50cf4d;height:1px;width:40%;border:none;">
```

`_sass\components\_main.scss`中

新增：`.dateModified {color: $main-color-1;}`

`.full-width`的`width`改为`95%`

主页摘要的下边框：

  `_includes\article-list.html`中，在 line 81 `</article>`后面添加：

```html
<div class="xda__border"></div>
```

在`_sass\layout\_home.scss`最底部添加：

```scss
.xda__border {
    margin-top: 5px;
    height: 3px;
    background: linear-gradient(to right, #00cf4d 0%, #004c83 50%, #00cf4d 100%);
}
```

在 `_sass/common/classes/_split-line.scss`里，

删除 line 11（` border: 0 solid $color;`）

### 三方css本地化

放在 asserts 目录下：

```ini
# assets/font_awesome/all.css
https://cdn.bootcdn.net/ajax/libs/font-awesome/5.15.1/css/all.css

# assets/webfonts/fa-regular-400.woff2
https://cdn.bootcdn.net/ajax/libs/font-awesome/5.15.1/webfonts/fa-regular-400.woff2

# assets/webfonts/fa-solid-900.woff2
https://cdn.bootcdn.net/ajax/libs/font-awesome/5.15.1/webfonts/fa-solid-900.woff2

# /assets/jquery.min.js
https://cdn.bootcss.com/jquery/3.1.1/jquery.min.js

#　其他待补充
```

