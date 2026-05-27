# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install          # install deps (first time)
npm run dev          # VitePress dev server (source files, hot reload)
npm run build        # build to .vitepress/dist-static

# 生产预览（推荐，替代 vitepress preview）
node serve.mjs       # port 5301 — 主题版，动态注入 CSS/script/logo
node serve-orig.mjs  # port 5302 — 原版对照
```

## Architecture

VitePress 1.x 文档站，内容来自 `vitepress-original.zip` 的预构建产物（2702 个页面 JS bundle）。

### 文件结构

```
index.md                      ← 首页（layout: home，5 个 feature 卡片，SVG 图标已 patch 到 bundle）
public/
  Ascendlogo.svg              ← 导航栏 Logo（5 KB）
  doc-banner.png              ← H1 banner 背景（347 KB）
serve.mjs                     ← port 5301 自定义 SPA 服务器（动态注入主题）
serve-orig.mjs                ← port 5302 原版 SPA 服务器
.vitepress/
  config.mjs                  ← VitePress 配置（含自定义 markdown 插件）
  sidebar.mjs                 ← 完整侧边栏树（434 KB，勿手动编辑）
  dist-static/                ← 预构建产物（主要服务目录）
    index.html                ← 首页 HTML（SSR 内容已 patch，emoji → SVG）
    404.html                  ← 404 页
    assets/
      index.md.DBTG75xY.js        ← 首页主 bundle（已 patch emoji → SVG）
      index.md.DBTG75xY.lean.js   ← 首页 lean bundle（已 patch emoji → SVG）
    ascend-theme.css          ← 主题 CSS（与 theme/ascend-theme.css 同步）
    ascend-sidebar-search.js  ← Logo + 搜索框注入脚本
    Ascendlogo.svg            ← Logo 副本（供静态服务）
    doc-banner.png            ← Banner 副本（供静态服务）
  theme/
    index.js                  ← 扩展 DefaultTheme，挂载 FilterToggle
    ascend-theme.css          ← 主题 CSS 源文件（改这里，然后同步）
    filter.css                ← 筛选 chip 样式
    FilterToggle.vue          ← 版本筛选组件
```

### serve.mjs 工作原理

`serve.mjs` 动态处理每个 HTML 请求：
1. 读取 `dist-static/` 的原始 HTML 文件
2. 注入 `<link rel="stylesheet" href="/ascend-theme.css">` 和 `<script defer src="/ascend-sidebar-search.js">`
3. 在 `__VP_SITE_DATA__` 的 `themeConfig` 里注入 `logo: "/Ascendlogo.svg"`（让 Vue 渲染 Logo）
4. 支持 SPA 路由回退（URL 无对应文件时回退到 index.html）

**好处**：HTML 文件保持干净，改 CSS/JS 只需更新对应文件并重启服务器，无需批量 patch。

### ascend-sidebar-search.js 工作原理

双模式搜索框：
- **文档页（有侧边栏）**：`appendChild` 到 `<body>`，`position: fixed` 贴在侧边栏顶部，ID = `ascend-sidebar-search`
- **首页（无侧边栏）**：插入到 `.VPNavBar .content-body` 末尾（Tab 后面），ID = `ascend-nav-search`
- 无侧边栏时自动 `remove()` sidebar 版搜索框，切换回首页时自动清除 nav 版
- 点击触发隐藏的 `.VPNavBarSearch button`（VitePress 原生搜索弹窗）
- **Logo**：用 MutationObserver 等待 `.VPNavBarTitle .title`，插入 `<img class="logo">`

> **注意**：`has-sidebar` class 在 VitePress 中挂在 `.VPContent` 上，不是 `<html>/<body>` 的祖先，
> 所以 CSS 选择器 `.has-sidebar #ascend-sidebar-search` 永远不匹配——必须用 JS 控制显隐。

### 首页 bundle patch 说明

`index.md` 的改动只影响 `npm run dev`，预构建的 `dist-static/` 不会自动更新。
首页内容改动需要同时 patch 三个文件：
```bash
# Python 脚本替换，保持 JSON 转义正确
# 1. dist-static/index.html                      （SSR 预渲染内容）
# 2. dist-static/assets/index.md.DBTG75xY.js    （主 bundle）
# 3. dist-static/assets/index.md.DBTG75xY.lean.js  （lean bundle，VitePress 优先加载此文件）
```

### CSS 修改流程

```bash
# 修改主题源文件
vim .vitepress/theme/ascend-theme.css

# 同步到 dist-static（serve.mjs 读这个文件）
cp .vitepress/theme/ascend-theme.css .vitepress/dist-static/ascend-theme.css

# 重启服务器即可看到效果（浏览器 Cmd+Shift+R 强制刷新）
lsof -ti:5301 | xargs kill; node serve.mjs &
```

## Theme rules

`ascend-theme.css` 颜色规范：
- Nav bar 标题 / 激活链接 → `#c7000b`（昇腾红，UI 里唯一的红色）
- `.vp-doc` 正文链接 → `#2e53fa`（品牌蓝）
- 实心按钮 → 黑色 `#000000`，胶囊形 `border-radius: 100px`
- 侧边栏激活项 → 蓝紫渐变底色 + 黑色加粗文字
- 代码块底色 → `#f6f7f8`（浅灰，亮色主题）
- 深浅色切换按钮 → 已隐藏（`.VPNavBarAppearance { display: none }`）

### 关键 CSS 选择器说明

| 选择器 | 说明 |
|--------|------|
| `.VPSidebarItem.is-active > .item` | 激活项底色（各 level 枚举覆盖，VitePress scoped CSS 权重高） |
| `.VPNavBarTitle .title > span` | 只隐藏文字 span（`.title` 是 `<a>` 标签，同时包裹 logo img） |
| `.VPDocAsideOutline` | TOC 卡片容器（不是 `.VPDocOutline`） |
| `.VPDocAsideOutline .content` | TOC 内容区，VitePress 默认有 `border-left`，已覆盖为 none |
| `.VPSidebarItem.level-1 .items` | level-1 展开无竖线；level-2+ 有竖线（`border-left + margin-left:8px`） |
| `.VPDocAsideOutline li::before` | TOC 圆点（透明底，灰色描边，激活时黑色描边） |
| `.VPDocAsideOutline li::after` | TOC 圆点间连线（渐变，首尾 item 特殊处理） |
| `.custom-block.note` | 说明块（蓝色图标+边框，标题黑色加粗） |
| `.custom-block.caution` | 注意块（橙色图标+边框） |
| `#ascend-sidebar-search` | 侧边栏顶部搜索框（fixed，JS 控制显隐） |
| `#ascend-nav-search` | 首页导航栏搜索框（插入 .content-body 末尾） |
| `.vp-doc div[class*='language-'] button.copy` | 代码块复制按钮（用 `background-color` 不用 `background`，避免覆盖 `background-image` 图标） |

### 提示块（Custom Block）类型映射

文档中使用的类型：
- `note`（143 处）→ 标题"说明"，蓝色（`#1890ff`）
- `caution`（20 处）→ 标题"注意"，橙色（`#fa8c16`）

HTML 结构：`<div class="note custom-block github-alert"><p class="custom-block-title">说明</p>...`

标题文字统一为黑色加粗（`#1d2129 font-weight:700`），颜色区分只体现在左边框和图标圆点上。

## Custom markdown pipeline

`config.mjs` 中的自定义处理：
- `fixSpanCrossingTableCells` — 修复跨表格单元格的 `<span>` 标签
- `escapeVueInterpolations` — 代码块外的 `{{ }}` 包 `<span v-pre>` 防止 Vue 报错
- `loadHeaderCache` — 读取 `.header` JSON 文件加速大文档的目录提取
- `placeholderPlugin`（Vite）— 缺失图片静默替换为 placeholder，不中断构建

`ignoreDeadLinks: true` 是故意设的，文档内有大量跨文件引用，只有完整 `guide/` + `api/` 树存在时才能解析。
