# Le Qin Homepage

这个仓库已经改为单页学术主页，顶部使用带图标的锚点导航，内容集中展示在同一页的 `About / Education / Publications / Experience / Service / Awards` 六个部分。

## 站点结构

- `_config.yml`: 站点配置和构建设置
- `_pages/`: 页面文件，目前主要是主页和 404
- `images/le-qin.jpg`: 头像
- `assets/css/main.scss`: 链接颜色和单页 section 样式覆盖
- `_data/navigation.yml`: 顶部图标导航配置

## 本地预览

在仓库根目录运行：

```bash
cd /Users/galois/Coding/le-qin-homepage
bundle config set path 'vendor/bundle'
bundle install
bundle exec jekyll serve
```

默认访问地址：

```text
http://127.0.0.1:4000/
```

不要在 `_site/` 目录里执行 `bundle exec jekyll serve`。Jekyll 会先清空再重建 `_site/`，如果当前 shell 正好停在那个目录里，就会出现 `getcwd` / `Errno::ENOENT` 这类报错。

如果已经遇到这个错误，回到项目根目录后重新运行：

```bash
cd /Users/galois/Coding/le-qin-homepage
bundle exec jekyll serve
```

## ClustrMaps 启用

`Page reviewers` 区块现在默认显示。如果 `_config.yml` 里的 `clustrmaps_id` 还是空字符串，页面会显示说明文字；一旦填入你自己的 ClustrMaps token，就会自动切换成真实访客地图。

`clustrmaps_id` 的含义是：ClustrMaps 给某一个站点生成的唯一脚本 token，也就是它嵌入脚本里 `...map_v2.js?...&d=<这里的值>` 这一段。这个值不是主页 URL，也不是仓库名，不能手写猜出来，必须从 ClustrMaps 为你的站点生成的 embed code 里复制。

拿到这个值的方式：

```text
1. 先让 GitHub Pages 站点上线
2. 到 ClustrMaps 为这个站点生成 embed script
3. 从 script 的 d= 参数后面复制整段 token
4. 填回 _config.yml 的 clustrmaps_id
```

## GitHub Pages 部署

当前仓库已经按用户主页仓库 `G-alois.github.io` 配置，线上地址会是：

```text
https://g-alois.github.io/
```

如果你以后改回项目主页仓库，再把 `_config.yml` 里的 `baseurl` 改回对应仓库名即可。

## 内容来源

- 页面内容主要依据 `Documents/Personal/Resume_Le_2026-2-23.pdf`
- 单页锚点展示按 `opt2.txt` 的要求重排
