# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install          # install deps (first time)
npm run dev          # dev server at http://localhost:5173
npm run build        # build to .vitepress/dist
npm run preview      # serve built output
```

## Architecture

This is a VitePress 1.x documentation site for Ascend C (昇腾 NPU 算子开发).

**Source layout** — markdown files live at the **project root** (not a `docs/` subfolder):
```
index.md             ← homepage (layout: home)
guide/               ← AscendC算子开发指南
api/                 ← Ascend C API reference
public/              ← static assets (logo, banner)
.vitepress/
  config.mjs         ← VitePress config + custom markdown plugins
  sidebar.mjs        ← full sidebar tree (auto-generated, ~434 KB, do not edit by hand)
  theme/
    index.js         ← extends DefaultTheme, mounts FilterToggle in nav
    ascend-theme.css ← full visual theme (Ascend brand colors)
    filter.css       ← chip filter bar styles + home layout grid overrides
    FilterToggle.vue ← nav chip to toggle 全量/950 content visibility
```

**Custom markdown pipeline** (`config.mjs`):
- `fixSpanCrossingTableCells` — fixes `<span>` tags that cross table cell boundaries before rendering
- `escapeVueInterpolations` — wraps `{{ }}` outside code blocks in `<span v-pre>` to suppress Vue template errors
- `loadHeaderCache` — loads pre-built `.header` JSON files alongside `.md` files to override VitePress header extraction (speeds up large docs)
- `placeholderPlugin` (Vite) — silently replaces missing image references with `api/figures/placeholder.png` so missing assets don't break the build

**Content filter system**: Markdown sections can be wrapped with `CANNFILTER_DIV_950_OPEN` / `CANNFILTER_DIV_950_CLOSE` markers. The config converts these to `<div data-filter="950">` elements. `FilterToggle.vue` reads the chip state from `localStorage` and toggles visibility of these divs, letting readers switch between 全量 (all) and 950-specific content.

## Theme rules

Color conventions in `ascend-theme.css`:
- Nav bar title / active link → `#c7000b` (昇腾红, only red in the UI)
- Text links inside `.vp-doc` → `#002fa7` (brand blue)
- Solid buttons → black `#000000`, capsule `border-radius: 100px`
- Sidebar active item → blue highlight, black bold text
- Everything else → no red

`ignoreDeadLinks: true` is set intentionally — the docs contain many cross-references that only resolve when the full `guide/` and `api/` trees are present.
