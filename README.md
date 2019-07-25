

## X.Da 的博客

- 基于 jekyll 的博客
- [jekyll-TeXt-theme](https://github.com/kitian616/jekyll-TeXt-theme) 主题，并做自定义改动

## 修改内容

1. `_includes\header.html`增加`sub-title`显示`site.description`

```html
<div class="site-sub-title">{{ site.description }}</div>
```

2. `_sass\components\_header.scss`增加样式

```scss
& > .site-sub-title {
      padding-left: 20px;
      display: inline-block;
      font-size: map-get($base, font-size-h4-xs);
      line-height: 1.5;
}
```

3. `_sass\skins\_default.scss`中：

  `$main-color-1`修改为绿色：`#50cf4d`

4. `_sass\common\_variables.scss`中：

  `content-max-width`改为`1050px`

5. 文章模板`_layouts\atticle.html`

  - 将`<footer>`中的`<span> dateModified`（page.modify_date）移动到`.article__content`前。并添加 class :`.dateModified`。

  - `.article__footer`前面新增：

```html
<hr style="background-color:#50cf4d;height:1px;width:30%;border:none;">
```

6. `_sass\components\_main.scss`中

  - 新增`.dateModified`，其`color`为`$main-color-1`
  - `.full-width`的`width`改为`95%`

7. 主页摘要的下边框：

  `_includes\home.html`中在`</article>`后面添加：

```html
<div class="xda__border"></div>
```

8. 在`_sass\layout\_home.scss`注释掉`bottom`的相关样式并添加：

```
& > .xda__border {
    margin-top: 5px;
    height: 3px;
    background: linear-gradient(to right, #00cf4d 0%, #004c83 50%, #00cf4d 100%);
}
```

9. footer增加cnzz统计
10. 修改文章排序按更新时间

```ini
修改每一个`_posts/`中的 .md 文件，在 yaml 头中
  将 date 替换成 created_date
  将 modify_date 替换成 date
  没有 created_date/date 的，补充 created_date/date
```

​	修改模板：

```ini
在`_includes/article-info.html`、 `_includes/article.html`中
  搜索 page.date 酌情替换为 page.created_date
  酌情将多个 page.modify_date 替换为 page.date
#在`_includes/scripts/article-list.html`中
#  搜索 _post.date 替换为 _post.created_date
```

