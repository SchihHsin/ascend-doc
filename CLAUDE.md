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

### ⚠️ 三个已修复的关键 bug（重装/重打包后须复检）

这套预构建 SPA 有三个会导致 404/空白/导航失效的坑，全部已修，验证脚本见 `nav-test.mjs`。

**(1) 深层页直接访问/刷新空白 — lean bundle 条件加载（patch 在 `app.CUO82o8J.js`）**
深层页 HTML 的 `<div id="app"></div>` 是空的（无 SSR 正文）；首页 `index.html` 则**有** SSR 正文。
VitePress 初始加载默认把 bundle 从 `.js` 换 `.lean.js`（精简版，假定正文已在 DOM）。深层页没 SSR
→ lean 渲染空白；首页有 SSR → lean 才对。所以**不能无条件去 lean**（那样首页会坏）。
正确 patch：`e&&(t=t.replace(/\.js$/,".lean.js"))` → `e&&document.querySelector("#app>*")&&(t=t.replace(/\.js$/,".lean.js"))`
（仅当 `#app` 有 SSR 内容时才用 lean）。**重打包后须复检**。

**(2) 首页 404 — 首页页面数据 JSON 转义（patch 在 `index.md.DBTG75xY.js` + `.lean.js`）**
首页页面数据是 `JSON.parse('…单引号串…')`。emoji→SVG patch 把 SVG 属性引号写成 `\"`，但在**单引号**
JS 串里 `\"` 会变成裸 `"`，JSON 在 position 327 解析失败 → SPA 渲染 404（深层页无此问题）。
修复：把 SVG 里的 `\"` 改成 `\\"`（→ 串里 `\"` → JSON 合法转义）。改首页 SVG 后务必确认两个 bundle 的
`JSON.parse(...)` 在浏览器能解析。

**(3) 导航 Tab 叠加 404 — 相对导航链接（fix 在 `ascend-sidebar-search.js` 第 1 个 IIFE）**
顶部导航渲染成「相对站点根」的相对链接（`guide/…`、`api/README.html`、`./`），只在首页能解析；
深层页点击会把路径叠加成 `/guide/.../api/README.html` → 404。`absolutizeNav()` 用持久 observer
把 `.VPNavBarMenu`/`.VPNavScreenMenu` 链接相对站点根解析为绝对路径。

> **代理缓存坑**：若设了 `http_proxy`（如 Clash 7890），代理可能缓存住旧的（甚至语法错误的）
> patched JS，导致改完仍复现旧问题。serve.mjs 已给静态资源加 `Cache-Control: no-store`；调试时用
> `curl --noproxy '*'` 或 Chrome `--no-proxy-server` 绕过，避免被代理缓存误导。

### 导航冒烟测试 `nav-test.mjs`

`node nav-test.mjs`（需先 `node serve.mjs`）：用同源 iframe 驱动 SPA，来回点击 首页→指南→API 两轮，
断言每步不 404、有正文。改动 bundle / 导航 / lean 逻辑后跑一遍。

### ascend-sidebar-search.js 工作原理

该文件含 **5 个独立 IIFE**（注意：若任一 IIFE 同步抛错，会中断后续 IIFE 执行）：

1. **Logo + 搜索框 + 导航链接绝对化**（双模式 + `absolutizeNav()`）
   - 文档页（有侧边栏）：`appendChild` 到 `<body>`，`position: fixed`，ID = `ascend-sidebar-search`
   - 首页（无侧边栏）：插入 `.VPNavBar .content-body` 末尾，ID = `ascend-nav-search`
   - 点击触发隐藏的 `.VPNavBarSearch button`；Logo 用 MutationObserver 插入 `.VPNavBarTitle .title`
   - `absolutizeNav()`：把导航相对链接改写成绝对路径（修复跨页叠加 404，见上文 bug 3）；
     此 IIFE 的 observer 已改为**持久**（不再 5s 后 disconnect），以便 SPA 换页后重新改写
2. **侧边栏拖拽调宽 + 收起把手**：驱动 `--vp-sidebar-width`（200–480px，localStorage 持久化）。
   收起 = 给 `<html>` 加 `.ascend-sb-collapsed`（侧边栏 `translateX(-100%)`、正文 `padding-left:0`，
   **不改 `--vp-sidebar-width`**，否则导航栏 logo 列会被压扁）。把手 `#ascend-sb-tab`、拖拽条 `#ascend-sb-resizer`。
3. **返回顶部 FAB** `#ascend-back-top`：body 级，滚动 >300px 显隐，渐变同 TOC 卡片。
4. **面包屑** `.ascend-breadcrumb`：见下方专节。

> **注意 1**：`has-sidebar` class 挂在 `.VPContent`，不是 `<html>/<body>` 祖先，CSS 选择器
> `.has-sidebar #ascend-sidebar-search` 永不匹配——必须 JS 控制显隐。
> **注意 2**：Vue 控制 `#app` 内所有 DOM，任何注入到 `.vp-doc`/`.content-container` 的节点会在
> 重渲染时被清除。**只有 `document.body` 直接子节点能存活**（搜索框/FAB/面包屑都挂 body）。

### 面包屑（breadcrumb）

`build()` 由 `trail()` 生成路径：`🏠` + `CANN社区版` + 导航激活项(`.VPNavBarMenuLink.active`) +
侧边栏激活链(`.VPSidebarItem.has-active`/`.is-active` 的 `.text`)，末项为当前页（加粗，无链接）。
- 节点挂 `document.body`、`position:absolute`，按 `h1.getBoundingClientRect()` 文档坐标浮在 banner 上方
- 同时给 `.vp-doc` 加 `.ascend-has-crumb`（H1 banner `margin-top` 改 -12px，腾出空间且上下间距对称）
- TOC 卡片 `margin-top:-12px` 与 banner 顶对齐（两者都落在 nav 下约 36px 处）
- resize + MutationObserver(body) 重算位置

### 宽屏对齐 `--ascend-sb-offset`

VitePress ≥1440px 会把侧边栏内容随居中布局右移（`padding-left: max(32px, (100vw-1376)/2)`）。
fixed 元素（搜索框/拖拽条/把手）用 `--ascend-sb-offset`（同公式）跟随，否则宽屏错位。
拖拽换宽时 JS 用 `sbOffset()` 把 `clientX` 换算回 `--vp-sidebar-width`。

### 首页 bundle patch 说明

`index.md` 的改动只影响 `npm run dev`，预构建的 `dist-static/` 不会自动更新。
首页内容改动需要同时 patch 三个文件：
```bash
# Python 脚本替换，保持 JSON 转义正确
# 1. dist-static/index.html                      （SSR 预渲染内容；这里 SVG 是原始 HTML，引号用 "）
# 2. dist-static/assets/index.md.DBTG75xY.js    （主 bundle）
# 3. dist-static/assets/index.md.DBTG75xY.lean.js  （lean bundle，首页有 SSR 故优先加载此文件）
```
> ⚠️ bundle 里页面数据是 `JSON.parse('单引号串')`：串内 JSON 结构引号用裸 `"`，SVG 属性引号必须用
> `\\"`（→ 串里 `\"` → JSON 合法）。写成 `\"` 会被单引号串解析成裸 `"` 而 JSON 解析失败 → 首页 404。
> 改完用 node 验证：`eval(JSON.parse 实参)` 再 `JSON.parse` 不报错。
>
> ⚠️ **首页 feature 图标必须是「字符串」不是 `{svg}`**：本版 VitePress 的 VPFeature 对**对象型** icon
> 当 `VPImage` 渲染（需 `src/light/dark`），不支持 `{svg}` → 渲染为空、与 SSR 失配把图标清掉。
> 页面数据里 `"icon"` 要写成裸 svg 字符串 `"icon":"<svg…>"`，走 innerHTML 分支才显示。

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
- `.vp-doc` 正文链接 → `#2e53fa`（品牌蓝）；正文字号 `14px`
- 实心按钮 → 黑色 `#000000`，胶囊形 `border-radius: 100px`
- 侧边栏 / TOC 卡片底色 → 白底 + 3% 蓝紫渐变 `linear-gradient(90deg, rgba(46,83,250,.03), rgba(123,37,244,.03))`
- 返回顶部 FAB → 15% 蓝紫渐变（`rgba(...,.15)`），无描边无阴影
- 侧边栏激活项 → 蓝紫渐变底色 + 黑色加粗文字
- 代码块底色 → `#f6f7f8`（浅灰，亮色主题）
- 表格 → 圆角 `12px`；**必须 `border-collapse: separate; border-spacing:0`**（collapse 下 border-radius 对边框无效，会出现「底色圆角但描边直角」）；表头底部 1px 蓝紫渐变线放在 `thead tr` 背景（thead 背景在表格里不渲染，要用 tr）
- 深浅色切换按钮 → 已隐藏（`.VPNavBarAppearance { display: none }`）

侧边栏（目录）结构规范：
- 展开/收起 caret 在文字**前面**（`.caret` 绝对定位 `left:0`，`.item` 留 `padding-left:22px`）
- 3rd 级起（`.level-1 > .items` 及更深）才有**竖线**；竖线与 caret 留 `padding-left:12px` 间距（不穿插）
- **无横线**：去掉 `.VPSidebarItem.level-0` 的 border-top **和** VitePress 默认的 `.group + .group { border-top }`
- H1 banner 上方有面包屑时 `.vp-doc.ascend-has-crumb h1` 的 `margin-top` 改 6px

### 关键 CSS 选择器说明

| 选择器 | 说明 |
|--------|------|
| `.VPSidebarItem.is-active > .item` | 激活项底色（各 level 枚举覆盖，VitePress scoped CSS 权重高） |
| `.VPNavBarTitle .title > span` | 只隐藏文字 span（`.title` 是 `<a>` 标签，同时包裹 logo img） |
| `.VPDocAsideOutline` | TOC 卡片容器（不是 `.VPDocOutline`）；渐变底色、无描边、`margin-top:-32px` 与 banner 顶对齐 |
| `.VPDocAsideOutline .outline-title::before` | "本页内容" 前的列表图标（内联 SVG data URI） |
| `.VPDocAsideOutline .content` | TOC 内容区，VitePress 默认有 `border-left`，已覆盖为 none |
| `.VPSidebarItem.level-0 > .items` | 2nd 级分组无竖线；`.level-1+ > .items` 才有竖线（`padding-left:12px; margin-left:10px`） |
| `.VPSidebarItem .caret` | 展开/收起箭头，绝对定位移到文字前面 |
| `.VPDocAsideOutline li::before` | TOC 圆点（透明底，灰色描边，激活时黑色描边） |
| `.VPDocAsideOutline li::after` | TOC 圆点间连线（渐变，首尾 item 特殊处理） |
| `.custom-block` | `padding:16px 16px 16px 44px`，图标 `::before` 绝对定位入左槽，标题与正文左对齐 |
| `.custom-block.note` / `.caution` | 说明块（蓝 `#1890ff`）/ 注意块（橙 `#fa8c16`），图标圆点区分 |
| `#ascend-sidebar-search` | 侧边栏顶部搜索框（fixed，`left:var(--ascend-sb-offset)`，JS 控制显隐） |
| `#ascend-nav-search` | 首页导航栏搜索框（插入 .content-body 末尾） |
| `#ascend-sb-tab` / `#ascend-sb-resizer` | 侧边栏收起把手 / 拖拽调宽条 |
| `#ascend-back-top` | 返回顶部 FAB（body 级，底部居中；15% 渐变，无边框/阴影） |
| `.ascend-breadcrumb` | 面包屑（body 级绝对定位，与 H1 banner 卡片**左对齐**：按 `h1.rect.left` 定位） |
| `.vp-doc blockquote.bq-info/.bq-tip/.bq-caution/.bq-danger` | emoji 引用块状态色（见下方专节） |
| `.vp-doc div[class*='language-'] button.copy` | 代码块复制按钮（用 `background-color` 不用 `background`，避免覆盖 `background-image` 图标） |

> ⚠️ CSS 给 `::before` 设图标时，定位规则里别用 `background:` **简写**（会把 `background-image` 重置为 none，
> 且简写所在选择器若更具体会盖掉单独设的 `background-image`，导致图标不显示）。用 `background-repeat/position/size` 单独属性。

### 提示块（Custom Block）类型映射

文档中使用的类型：
- `note`（143 处）→ 标题"说明"，蓝色（`#1890ff`）
- `caution`（20 处）→ 标题"注意"，橙色（`#fa8c16`）

HTML 结构：`<div class="note custom-block github-alert"><p class="custom-block-title">说明</p>...`

标题文字统一为黑色加粗（`#1d2129 font-weight:700`），颜色区分只体现在左边框和图标圆点上。

### emoji 引用块状态色化（与 custom-block 并存的另一套）

正文里以 emoji 开头的 markdown 引用块（`<blockquote><p>💡 …`）会被状态色化。**完全不改正文**：

- **JS**（`ascend-sidebar-search.js` 第 1 个 IIFE 的 `classifyBlockquotes()`，跟 `absolutizeNav` 共用持久 observer）：
  按开头 emoji 给 blockquote 加 class —— 💡📌🧬→`bq-info`(蓝) / ✅🚀→`bq-tip`(绿) / ⚠️→`bq-caution`(橙) / ❌→`bq-danger`(红)；
  emoji 后紧跟 `<strong>` 视为「配了标题词」，否则再加 `bq-noword`。无 emoji 的引用块不加 class、保持灰。
- **CSS**：`> p::first-letter { font-size:0 }` 藏掉开头 emoji（不改文字）；`::before` 出线性状态图标；
  - 配词：行内 `[图标] **原词**：内容`（原词来自 `<strong>`）；
  - 无配词：`::before` 出「图标 + 默认词」当顶部标题行（蓝=说明 / 绿=建议 / 橙=注意 / 红=警告），正文在下。
- 颜色复用 custom-block 那套（蓝 `#1890ff` / 绿 `#30a85e` / 橙 `#fa8c16` / 红 `#e63838`）。
- 验证脚本无；改完肉眼看 5 个含此类引用块的页面（入门教程/编程指南/跨代迁移 等）。

## Custom markdown pipeline

`config.mjs` 中的自定义处理：
- `fixSpanCrossingTableCells` — 修复跨表格单元格的 `<span>` 标签
- `escapeVueInterpolations` — 代码块外的 `{{ }}` 包 `<span v-pre>` 防止 Vue 报错
- `loadHeaderCache` — 读取 `.header` JSON 文件加速大文档的目录提取
- `placeholderPlugin`（Vite）— 缺失图片静默替换为 placeholder，不中断构建

`ignoreDeadLinks: true` 是故意设的，文档内有大量跨文件引用，只有完整 `guide/` + `api/` 树存在时才能解析。
