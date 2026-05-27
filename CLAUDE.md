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
index.md                      ← 首页（layout: home，5 个 feature 卡片）
public/
  Ascendlogo.svg              ← 导航栏 Logo（5 KB）
  doc-banner.png              ← H1 banner 背景（347 KB）
serve.mjs                     ← port 5301 自定义 SPA 服务器（动态注入主题）
serve-orig.mjs                ← port 5302 原版 SPA 服务器
.vitepress/
  config.mjs                  ← VitePress 配置（含自定义 markdown 插件）
  sidebar.mjs                 ← 完整侧边栏树（434 KB，勿手动编辑）
  dist-static/                ← 预构建产物（主要服务目录）
    index.html / 404.html     ← 入口 HTML（干净，无注入内容）
    assets/                   ← VitePress JS bundle（含页面内容）
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

- **Logo**：用 MutationObserver 等待 Vue 渲染 `.VPNavBarTitle .title`，然后插入 `<img class="logo">`
- **搜索框**：`appendChild` 到 `<body>`（Vue 管理范围之外），用 `position: fixed` 贴在侧边栏顶部。这样 Vue 重新渲染侧边栏时不会删除它
- 点击搜索框触发隐藏的 `.VPNavBarSearch button`（VitePress 原生搜索弹窗）

### CSS 修改流程

```bash
# 修改主题源文件
vim .vitepress/theme/ascend-theme.css

# 同步到 dist-static（serve.mjs 读这个文件）
cp .vitepress/theme/ascend-theme.css .vitepress/dist-static/ascend-theme.css

# 重启服务器即可看到效果（浏览器 Cmd+Shift+R 强制刷新）
```

## Theme rules

`ascend-theme.css` 颜色规范：
- Nav bar 标题 / 激活链接 → `#c7000b`（昇腾红，UI 里唯一的红色）
- `.vp-doc` 正文链接 → `#2e53fa`（品牌蓝）
- 实心按钮 → 黑色 `#000000`，胶囊形 `border-radius: 100px`
- 侧边栏激活项 → 蓝紫渐变底色 + 黑色加粗文字 + `padding-left: 8px`
- 搜索框 → `#VPNavBarSearch` 隐藏，改为侧边栏顶部 fixed 胶囊框
- 其他所有区域 → 不用红色

### 关键 CSS 选择器说明

| 选择器 | 说明 |
|--------|------|
| `.VPSidebarItem.is-active > .item` | 激活项底色（各 level 枚举覆盖，因为 VitePress scoped CSS 权重高） |
| `.VPNavBarTitle .title > span` | 只隐藏文字 span（`.title` 是 `<a>` 标签，同时包裹 logo img） |
| `.VPDocAsideOutline` | TOC 卡片容器（不是 `.VPDocOutline`） |
| `#VPSidebarNav` | 侧边栏 `<nav>` 的 ID（不是 class） |

## Custom markdown pipeline

`config.mjs` 中的自定义处理：
- `fixSpanCrossingTableCells` — 修复跨表格单元格的 `<span>` 标签
- `escapeVueInterpolations` — 代码块外的 `{{ }}` 包 `<span v-pre>` 防止 Vue 报错
- `loadHeaderCache` — 读取 `.header` JSON 文件加速大文档的目录提取
- `placeholderPlugin`（Vite）— 缺失图片静默替换为 placeholder，不中断构建

`ignoreDeadLinks: true` 是故意设的，文档内有大量跨文件引用，只有完整 `guide/` + `api/` 树存在时才能解析。
