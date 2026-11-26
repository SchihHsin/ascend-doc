(function () {
  var BASE = (location.pathname === '/ascend-doc' || location.pathname.indexOf('/ascend-doc/') === 0)
    ? '/ascend-doc'
    : '';

  /* ── Logo ── */
  function insertLogo() {
    if (document.querySelector('.VPNavBarTitle img')) return;
    var a = document.querySelector('.VPNavBarTitle .title')
          || document.querySelector('.VPNavBarTitle a');
    if (!a) return;
    var img = document.createElement('img');
    img.className = 'logo';
    img.src = BASE + '/Ascendlogo.svg';
    img.alt = 'Ascend C';
    a.insertBefore(img, a.firstChild);
  }

  /* ── Search box ── */
  function makeSearchEl(id) {
    var el = document.createElement('div');
    el.id = id;
    el.innerHTML =
      '<div><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"' +
      ' fill="none" stroke="currentColor" stroke-width="2"' +
      ' stroke-linecap="round" stroke-linejoin="round">' +
      '<circle cx="11" cy="11" r="8"/>' +
      '<line x1="21" y1="21" x2="16.65" y2="16.65"/>' +
      '</svg><span>搜索文档</span></div>';
    el.addEventListener('click', function () {
      var btn = document.querySelector('.VPNavBarSearch button')
             || document.querySelector('button[aria-label*="Search"]')
             || document.querySelector('button[aria-label*="搜索"]');
      if (btn) btn.click();
    });
    return el;
  }

  function insertSearch() {
    var sidebar = document.querySelector('.VPSidebar');
    var isHome = !!document.querySelector('.VPHome');
    var sidebarBox = document.getElementById('ascend-sidebar-search');
    var navBox = document.getElementById('ascend-nav-search');

    if (sidebar && !isHome) {
      // Sidebar page: fixed search above sidebar
      if (navBox) navBox.remove();
      if (!sidebarBox) {
        document.body.appendChild(makeSearchEl('ascend-sidebar-search'));
      }
    } else {
      // Homepage / no-sidebar: search in nav bar before menu tabs
      if (sidebarBox) sidebarBox.remove();
      if (!navBox) {
        var contentBody = document.querySelector('.VPNavBar .content-body');
        var menu = contentBody && contentBody.querySelector('.menu');
        if (contentBody) {
          contentBody.appendChild(makeSearchEl('ascend-nav-search'));
        }
      }
    }
  }

  /* 顶部导航链接是「相对站点根」的相对路径（如 guide/...、api/README.html、./），
     只有在首页能正确解析；在深层页面点击会把路径叠加导致 404。
     这里把它们改写成绝对路径（相对站点根解析），修复跨页导航。 */
  function absolutizeNav() {
    var basePrefix = (location.pathname === '/ascend-doc' || location.pathname.indexOf('/ascend-doc/') === 0)
      ? '/ascend-doc'
      : '';
    var root = location.origin + basePrefix + '/';
    var links = document.querySelectorAll('.VPNavBarMenu a, .VPNavScreenMenu a, .VPLocalSearchBox a');
    for (var i = 0; i < links.length; i++) {
      var a = links[i];
      var h = a.getAttribute('href');
      if (!h || h.charAt(0) === '#' || /^[a-z]+:/i.test(h)) continue;
      if (basePrefix && h.charAt(0) === '/' && h.indexOf(basePrefix + '/') !== 0) {
        a.setAttribute('href', basePrefix + h);
        continue;
      }
      var u;
      try { u = new URL(h, root); } catch (e) { continue; }
      if (u.origin !== location.origin) continue;
      var abs = u.pathname + u.search + u.hash;
      if (h !== abs) a.setAttribute('href', abs);
    }
  }

  /* 正文里以 emoji 开头的引用块 → 按 emoji 归到状态色（info/tip/caution/danger）。
     只加 class，不改正文文字；emoji 由 CSS ::first-letter 藏掉，图标/默认词由 CSS 生成。 */
  var BQ_MAP = {
    '💡': 'info', '📌': 'info', '🧬': 'info', 'ℹ': 'info', '📖': 'info',
    '✅': 'tip', '🚀': 'tip', '🎯': 'tip', '✨': 'tip',
    '⚠': 'caution', '📢': 'caution', '❗': 'caution',
    '❌': 'danger', '🚫': 'danger', '⛔': 'danger'
  };
  function classifyBlockquotes() {
    var bqs = document.querySelectorAll('.vp-doc blockquote');
    for (var i = 0; i < bqs.length; i++) {
      var bq = bqs[i];
      var p = bq.querySelector('p');
      bq.classList.remove('bq-info', 'bq-tip', 'bq-caution', 'bq-danger', 'bq-noword');
      if (!p) continue;
      var t = (p.textContent || '').replace(/^\s+/, '');
      var first = Array.from(t)[0] || '';        // 首个码位（含 astral emoji）
      var cls = BQ_MAP[first];
      if (!cls) continue;
      bq.classList.add('bq-' + cls);
      // emoji 后紧跟 <strong> 视为「配了标题词」；否则用默认词
      var hasWord = p.firstElementChild && p.firstElementChild.tagName === 'STRONG';
      if (!hasWord) bq.classList.add('bq-noword');
    }
  }

  function tryAll() { insertLogo(); insertSearch(); absolutizeNav(); classifyBlockquotes(); }

  [0, 100, 300, 600, 1000, 1500, 2000].forEach(function (ms) {
    setTimeout(tryAll, ms);
  });

  // 持久监听：SPA 换页后导航会重渲染为相对链接，需再次改写
  var raf = null;
  var mo = new MutationObserver(function () {
    if (raf) return;
    raf = requestAnimationFrame(function () { raf = null; tryAll(); });
  });
  mo.observe(document.body, { childList: true, subtree: true });
})();

/* ── Sidebar resize + collapse ── */
(function () {
  var MIN = 200, MAX = 480, DEFAULT = 256;
  var W_KEY = 'ascend-sidebar-width';
  var C_KEY = 'ascend-sidebar-collapsed';
  var root = document.documentElement;

  function readWidth() {
    var w = parseInt(localStorage.getItem(W_KEY), 10);
    return (w && w >= MIN && w <= MAX) ? w : DEFAULT;
  }

  var expandedWidth = readWidth();
  var collapsed = localStorage.getItem(C_KEY) === '1';
  var resizer = null, tab = null;

  function applyWidth(px) {
    root.style.setProperty('--vp-sidebar-width', px + 'px');
  }

  function animate() {
    root.classList.add('ascend-sb-animating');
    setTimeout(function () { root.classList.remove('ascend-sb-animating'); }, 300);
  }

  function setCollapsed(state, withAnim) {
    collapsed = state;
    localStorage.setItem(C_KEY, state ? '1' : '0');
    if (withAnim) animate();
    // 不改 --vp-sidebar-width（导航栏 logo 列依赖它），只切类
    root.classList.toggle('ascend-sb-collapsed', state);
    if (tab) tab.classList.toggle('collapsed', state);
  }

  // 初始状态（无动画）：变量始终保持展开宽度，收起仅靠 class
  applyWidth(expandedWidth);
  if (collapsed) root.classList.add('ascend-sb-collapsed');

  function sbOffset() {
    return Math.max(32, (window.innerWidth - (1440 - 64)) / 2);
  }

  function attachDrag(el) {
    el.addEventListener('mousedown', function (e) {
      if (collapsed) return;
      e.preventDefault();
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
      function move(ev) {
        // 宽屏时侧边栏右移了 sbOffset，换算回 --vp-sidebar-width
        var w = Math.min(MAX, Math.max(MIN, ev.clientX - sbOffset() + 32));
        expandedWidth = w;
        applyWidth(w);
      }
      function up() {
        document.removeEventListener('mousemove', move);
        document.removeEventListener('mouseup', up);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
        localStorage.setItem(W_KEY, expandedWidth);
      }
      document.addEventListener('mousemove', move);
      document.addEventListener('mouseup', up);
    });
  }

  function build() {
    var sidebar = document.querySelector('.VPSidebar');
    var isHome = !!document.querySelector('.VPHome');

    if (!sidebar || isHome) {
      if (resizer) { resizer.remove(); resizer = null; }
      if (tab) { tab.remove(); tab = null; }
      return;
    }

    if (!resizer) {
      resizer = document.createElement('div');
      resizer.id = 'ascend-sb-resizer';
      document.body.appendChild(resizer);
      attachDrag(resizer);
    }
    if (!tab) {
      tab = document.createElement('div');
      tab.id = 'ascend-sb-tab';
      tab.title = '收起/展开目录';
      tab.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"' +
        ' stroke="currentColor" stroke-width="2.5" stroke-linecap="round"' +
        ' stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>';
      document.body.appendChild(tab);
      tab.addEventListener('click', function () { setCollapsed(!collapsed, true); });
      tab.classList.toggle('collapsed', collapsed);
    }
  }

  [0, 100, 300, 600, 1000, 1500, 2000].forEach(function (ms) {
    setTimeout(build, ms);
  });

  var raf = null;
  var mo = new MutationObserver(function () {
    if (raf) return;
    raf = requestAnimationFrame(function () { raf = null; build(); });
  });
  mo.observe(document.body, { childList: true, subtree: true });
})();

/* ── Back to top FAB ── */
(function () {
  var btn = null;

  function build() {
    if (btn) return;
    btn = document.createElement('div');
    btn.id = 'ascend-back-top';
    btn.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"' +
      ' stroke="currentColor" stroke-width="2" stroke-linecap="round"' +
      ' stroke-linejoin="round"><line x1="12" y1="19" x2="12" y2="5"/>' +
      '<polyline points="5 12 12 5 19 12"/></svg><span>返回顶部</span>';
    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    document.body.appendChild(btn);
  }

  function onScroll() {
    if (!btn) return;
    btn.classList.toggle('show', window.scrollY > 300);
  }

  build();
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
  [0, 300, 800].forEach(function (ms) {
    setTimeout(function () { build(); onScroll(); }, ms);
  });
})();

/* ── Breadcrumb above H1 banner ── */
(function () {
  var HOME_SVG =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"' +
    ' stroke="currentColor" stroke-width="1.8" stroke-linecap="round"' +
    ' stroke-linejoin="round"><path d="M3 9.5 12 3l9 6.5"/>' +
    '<path d="M5 9v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9"/></svg>';
  var SEP_SVG =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"' +
    ' stroke="currentColor" stroke-width="2" stroke-linecap="round"' +
    ' stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>';

  function trail() {
    var items = [{ text: '__home__', href: '/' }, { text: 'CANN社区版', href: '/' }];
    var navActive = document.querySelector('.VPNavBarMenu .VPNavBarMenuLink.active');
    if (navActive) {
      items.push({ text: navActive.textContent.trim(), href: navActive.getAttribute('href') });
    }
    var nodes = document.querySelectorAll(
      '.VPSidebar .VPSidebarItem.has-active, .VPSidebar .VPSidebarItem.is-active');
    nodes.forEach(function (node) {
      var item = node.querySelector(':scope > .item');
      if (!item) return;
      var textEl = item.querySelector('.text');
      var link = item.querySelector('a.link');
      var t = textEl ? textEl.textContent.trim() : '';
      if (t) items.push({ text: t, href: link ? link.getAttribute('href') : null });
    });
    return items;
  }

  // 面包屑挂在 body（Vue 不会清空 body 直接子节点），绝对定位浮在 banner 上方
  var el = null;

  function fill(items) {
    el.innerHTML = '';
    items.forEach(function (it, i) {
      var isLast = i === items.length - 1;
      if (i > 0) {
        var sep = document.createElement('span');
        sep.className = 'crumb-sep';
        sep.innerHTML = SEP_SVG;
        el.appendChild(sep);
      }
      var c;
      if (it.href && !isLast) {
        c = document.createElement('a');
        c.href = it.href;
      } else {
        c = document.createElement('span');
      }
      c.className = 'crumb' + (isLast ? ' current' : '');
      if (it.text === '__home__') {
        c.classList.add('crumb-home');
        c.innerHTML = HOME_SVG;
        c.setAttribute('aria-label', '首页');
      } else {
        c.textContent = it.text;
      }
      el.appendChild(c);
    });
  }

  function position(doc, h1) {
    // 与 H1 底色卡片（banner）左对齐：banner 即 h1 元素（含负边距外扩），用它的 rect
    var hr = h1.getBoundingClientRect();
    var sx = window.scrollX || window.pageXOffset || 0;
    var sy = window.scrollY || window.pageYOffset || 0;
    el.style.left = (hr.left + sx) + 'px';
    el.style.maxWidth = hr.width + 'px';
    el.style.top = (hr.top + sy - el.offsetHeight - 8) + 'px';
  }

  function build() {
    var doc = document.querySelector('.vp-doc');
    var h1 = doc && doc.querySelector('h1');
    var isHome = !!document.querySelector('.VPHome');
    if (!doc || !h1 || isHome) {
      if (el) el.style.display = 'none';
      if (doc) doc.classList.remove('ascend-has-crumb');
      return;
    }
    doc.classList.add('ascend-has-crumb');
    var items = trail();
    var key = items.map(function (i) { return i.text; }).join('>');
    if (!el) {
      el = document.createElement('nav');
      el.className = 'ascend-breadcrumb';
      el.setAttribute('aria-label', 'breadcrumb');
      document.body.appendChild(el);
    }
    if (el.getAttribute('data-key') !== key) {
      el.setAttribute('data-key', key);
      fill(items);
    }
    el.style.display = 'flex';
    position(doc, h1);
  }

  [0, 100, 300, 600, 1000, 1500, 2200].forEach(function (ms) {
    setTimeout(build, ms);
  });
  window.addEventListener('resize', build);
  var raf = null;
  var mo = new MutationObserver(function () {
    if (raf) return;
    raf = requestAnimationFrame(function () { raf = null; build(); });
  });
  mo.observe(document.body, { childList: true, subtree: true });
})();


/* ── Ascend Bento Home (3D 光晕 Hero + 配置驱动分层 Bento 首页) ── */
(function () {
  var BASE = (location.pathname === '/ascend-doc' || location.pathname.indexOf('/ascend-doc/') === 0)
    ? '/ascend-doc'
    : '';
  var cachedConfig = null;
  var loadingConfig = false;

  function withBase(href) {
    if (!href || href.charAt(0) === '#' || /^[a-z]+:/i.test(href)) return href;
    if (BASE && href.indexOf(BASE + '/') === 0) return href;
    return BASE + (href.charAt(0) === '/' ? href : '/' + href);
  }

  var ICON_MAP = {
    code: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>',
    database: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"/>',
    network: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>',
    pulse: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>',
    beaker: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/>',
    grid: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>',
    book: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>',
    cube: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>'
  };

  var ACCENT = {
    blue:    { solidBg: '#0052D9', solidFg: '#FFFFFF', softBg: '#EFF6FF', softFg: '#0052D9', grad: 'linear-gradient(135deg, #FFFFFF 0%, #FFFFFF 60%, rgba(239,246,255,0.65) 100%)' },
    indigo:  { solidBg: '#4F46E5', solidFg: '#FFFFFF', softBg: '#EEF2FF', softFg: '#4F46E5', grad: 'linear-gradient(135deg, #FFFFFF 0%, #FFFFFF 60%, rgba(238,242,255,0.65) 100%)' },
    sky:     { solidBg: '#0284C7', solidFg: '#FFFFFF', softBg: '#F0F9FF', softFg: '#0284C7', grad: '#FFFFFF' },
    emerald: { solidBg: '#059669', solidFg: '#FFFFFF', softBg: '#ECFDF5', softFg: '#059669', grad: '#FFFFFF' },
    purple:  { solidBg: '#7C3AED', solidFg: '#FFFFFF', softBg: '#F5F3FF', softFg: '#7C3AED', grad: '#FFFFFF' },
    amber:   { solidBg: '#D97706', solidFg: '#FFFFFF', softBg: '#FFFBEB', softFg: '#B45309', grad: '#FFFFFF' },
    rose:    { solidBg: '#E11D48', solidFg: '#FFFFFF', softBg: '#FFF1F2', softFg: '#E11D48', grad: '#FFFFFF' },
    slate:   { solidBg: '#334155', solidFg: '#FFFFFF', softBg: '#F1F5F9', softFg: '#475569', grad: '#FFFFFF' }
  };

  function esc(s) {
    return String(s || '').replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function svgIcon(name) {
    return '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">' + (ICON_MAP[name] || ICON_MAP.cube) + '</svg>';
  }

  function openVitePressSearch() {
    var btn = document.querySelector('.VPNavBarSearch button')
           || document.querySelector('button[aria-label*="Search"]')
           || document.querySelector('button[aria-label*="搜索"]');
    if (btn) btn.click();
  }

  function buildStandardSlots(categories) {
    var slots = [];
    for (var i = 0; i < categories.length; i++) {
      var cur = categories[i];
      var next = categories[i + 1];
      var curLen = (cur.items || []).length;
      var nextLen = next ? (next.items || []).length : 999;
      var isSparse = next && (
        (Math.min(curLen, nextLen) === 1 && (curLen + nextLen) <= 4) ||
        (curLen <= 2 && nextLen <= 2)
      );
      if (isSparse) {
        slots.push({ type: 'pair', items: [cur, next] });
        i++;
      } else {
        slots.push({ type: 'single', items: [cur] });
      }
    }
    return slots;
  }

  function renderFeaturedCard(cat) {
    var acc = ACCENT[cat.accent] || ACCENT.blue;
    var items = cat.items || [];
    var hasTags = items.some(function (it) { return !!it.tag; });
    var rightHtml = cat.badge
      ? '<span class="abh-badge" style="background:' + acc.softBg + ';color:' + acc.softFg + '">' + esc(cat.badge) + '</span>'
      : (cat.showCount ? '<span style="font-size:12px;color:#94A3B8;font-family:JetBrains Mono,monospace">' + items.length + ' Modules</span>' : '');

    var flowHtml = (cat.flowSteps && cat.flowSteps.length >= 2)
      ? '<div class="abh-flow">' + cat.flowSteps.map(function (s) { return '<span>' + esc(s) + '</span>'; }).join('<span class="abh-flow-arrow">──▶</span>') + '</div>'
      : '';

    var itemsHtml = '';
    if (hasTags) {
      var cols = items.length === 2 ? 'cols-2' : 'cols-3';
      itemsHtml = '<div class="abh-subgrid ' + cols + '">' + items.map(function (it) {
        var tagAcc = ACCENT[it.tagAccent] || acc;
        return '<a class="abh-subtile" href="' + esc(withBase(it.href || '#')) + '">' +
          '<div class="abh-subtile-top">' +
            '<span class="abh-subtile-tag" style="color:' + tagAcc.softFg + '">' + esc(it.tag || '') + '</span>' +
            '<span class="abh-link-arrow">→</span>' +
          '</div>' +
          '<div class="abh-subtile-title">' + esc(it.title) + '</div>' +
        '</a>';
      }).join('') + '</div>';
    } else {
      itemsHtml = '<div class="abh-subgrid cols-2">' + items.map(function (it, idx) {
        var spanFull = (it.spanFullIfOdd && items.length % 2 === 1 && idx === items.length - 1) ? ' abh-span-full-2' : '';
        return '<a class="abh-link-row filled' + spanFull + '" href="' + esc(withBase(it.href || '#')) + '">' +
          '<span>' + esc(it.title) + '</span><span class="abh-link-arrow">→</span>' +
        '</a>';
      }).join('') + '</div>';
    }

    return '<section class="abh-card" style="background:' + acc.grad + '">' +
      '<div>' +
        '<div class="abh-card-head">' +
          '<div class="abh-card-title-wrap">' +
            '<span class="abh-icon-box" style="background:' + acc.solidBg + ';color:' + acc.solidFg + '">' + svgIcon(cat.icon) + '</span>' +
            '<div><h2 class="abh-card-title">' + esc(cat.title) + '</h2>' + (cat.subtitle ? '<p class="abh-card-sub">' + esc(cat.subtitle) + '</p>' : '') + '</div>' +
          '</div>' +
          rightHtml +
        '</div>' +
        flowHtml +
      '</div>' +
      itemsHtml +
    '</section>';
  }

  function renderStandardCard(cat, spanClass, isWide, extraClass) {
    var acc = ACCENT[cat.accent] || ACCENT.slate;
    var items = cat.items || [];
    var limit = isWide ? 6 : 5;
    var overflow = items.length > limit;
    var rightHtml = cat.badge
      ? '<span class="abh-badge" style="background:' + acc.softBg + ';color:' + acc.softFg + ';font-family:JetBrains Mono,monospace">' + esc(cat.badge) + '</span>'
      : (cat.subtitle ? '<span style="font-size:12px;color:#94A3B8">' + esc(cat.subtitle) + '</span>' : '');

    var listCls = isWide ? 'abh-subgrid cols-3' : 'abh-list';
    var listHtml = items.map(function (it, idx) {
      var hiddenCls = (overflow && idx >= limit) ? ' abh-extra abh-hidden' : '';
      return '<li class="' + hiddenCls + '"><a class="abh-link-row' + (isWide ? ' filled' : '') + '" href="' + esc(withBase(it.href || '#')) + '">' +
        '<span>' + esc(it.title) + '</span><span class="abh-link-arrow">→</span></a></li>';
    }).join('');

    var expandBtn = overflow
      ? '<button type="button" class="abh-expand-btn" data-total="' + items.length + '">展开全部（共 ' + items.length + ' 项）</button>'
      : '';

    return '<section class="abh-card ' + (spanClass || '') + ' ' + (extraClass || '') + '">' +
      '<div>' +
        '<div class="abh-card-head">' +
          '<div class="abh-card-title-wrap">' +
            '<span class="abh-icon-box" style="background:' + acc.softBg + ';color:' + acc.softFg + '">' + svgIcon(cat.icon) + '</span>' +
            '<h2 class="abh-card-title">' + esc(cat.title) + '</h2>' +
          '</div>' +
          rightHtml +
        '</div>' +
        '<ul class="' + listCls + '">' + listHtml + '</ul>' +
        expandBtn +
      '</div>' +
    '</section>';
  }

  function renderStripCard(cat) {
    var acc = ACCENT[cat.accent] || ACCENT.amber;
    var items = cat.items || [];
    return '<section class="abh-card">' +
      '<div class="abh-card-head">' +
        '<div class="abh-card-title-wrap">' +
          '<span class="abh-icon-box" style="background:' + acc.softBg + ';color:' + acc.softFg + '">' + svgIcon(cat.icon) + '</span>' +
          '<div><h2 class="abh-card-title">' + esc(cat.title) + '</h2>' + (cat.subtitle ? '<p class="abh-card-sub">' + esc(cat.subtitle) + '</p>' : '') + '</div>' +
        '</div>' +
        (cat.badge ? '<span style="font-size:12px;color:#94A3B8;font-family:JetBrains Mono,monospace">' + esc(cat.badge) + '</span>' : '') +
      '</div>' +
      '<div class="abh-subgrid cols-5">' + items.map(function (it) {
        return '<a class="abh-link-row filled" href="' + esc(withBase(it.href || '#')) + '"><span>' + esc(it.title) + '</span><span class="abh-link-arrow">→</span></a>';
      }).join('') + '</div>' +
    '</section>';
  }

  function renderBentoRoot(config) {
    var vpHome = document.querySelector('.VPHome');
    if (!vpHome || document.getElementById('ascend-bento-root')) return;

    var hero = config.hero || {};
    var quickTags = (config.quickTags || []).map(function (t) {
      return '<a class="abh-quick-pill" href="' + esc(withBase(t.href || '#')) + '">' + esc(t.label) + '</a>';
    }).join('');

    var cats = config.categories || [];
    var featured = cats.filter(function (c) { return c.tier === 'featured'; });
    var standard = cats.filter(function (c) { return c.tier !== 'featured' && c.tier !== 'strip'; });
    var strips = cats.filter(function (c) { return c.tier === 'strip'; });

    var bodyHtml = '';
    if (featured.length > 0) {
      bodyHtml += '<div class="abh-grid-featured' + (featured.length > 1 ? ' cols-2' : '') + '">' +
        featured.map(renderFeaturedCard).join('') + '</div>';
    }
    if (standard.length > 0) {
      var slots = buildStandardSlots(standard);
      var n = slots.length;
      bodyHtml += '<div class="abh-grid-standard">' + slots.map(function (slot, idx) {
        var sp = 'abh-span-2';
        if (n === 1) sp = 'abh-span-6';
        else if (n % 3 === 2 && idx >= n - 2) sp = 'abh-span-3';
        else if (n % 3 === 1 && idx >= n - 4) sp = 'abh-span-3';

        if (slot.type === 'pair') {
          return '<div class="abh-slot ' + sp + '">' +
            renderStandardCard(slot.items[0], '', false, '') +
            renderStandardCard(slot.items[1], '', false, 'flex-1') +
          '</div>';
        }
        return renderStandardCard(slot.items[0], sp, n === 1, '');
      }).join('') + '</div>';
    }
    strips.forEach(function (c) { bodyHtml += renderStripCard(c); });

    var root = document.createElement('div');
    root.id = 'ascend-bento-root';
    root.innerHTML =
      '<section class="abh-hero">' +
        '<div class="abh-container"><div class="abh-hero-inner">' +
          '<div class="abh-hero-copy">' +
            '<h1 class="abh-hero-title">' + esc(hero.title || 'Ascend C 开源文档') + '</h1>' +
            '<p class="abh-hero-sub">' + esc(hero.subtitle || '') + '</p>' +
            (hero.notice ? '<p class="abh-hero-notice"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg><span>' + esc(hero.notice) + '</span></p>' : '') +
            '<button type="button" id="abh-search-trigger" class="abh-search-btn">' +
              '<span class="abh-search-left">' +
                '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>' +
                '<span class="abh-search-placeholder">' + esc(hero.searchPlaceholder || '搜索全站文档、API 或关键字...') + '</span>' +
              '</span>' +
              '<kbd class="abh-search-kbd">/</kbd>' +
            '</button>' +
            '<div class="abh-quick-tags"><span class="abh-quick-label">高频直达：</span>' + quickTags + '</div>' +
          '</div>' +
          '<div class="abh-hero-visual" aria-hidden="true">' +
            '<svg class="abh-orbit-svg" viewBox="0 0 340 260" fill="none">' +
              '<ellipse cx="170" cy="132" rx="152" ry="62" transform="rotate(-16 170 132)" stroke="url(#abhOrbitBlue)" stroke-width="1.15" stroke-dasharray="4 4"/>' +
              '<ellipse cx="170" cy="132" rx="138" ry="52" transform="rotate(14 170 132)" stroke="url(#abhOrbitPurple)" stroke-width="1"/>' +
              '<defs>' +
                '<linearGradient id="abhOrbitBlue" x1="18" y1="70" x2="322" y2="194" gradientUnits="userSpaceOnUse"><stop stop-color="#3B82F6" stop-opacity="0.28"/><stop offset="0.5" stop-color="#6366F1" stop-opacity="0.10"/><stop offset="1" stop-color="#3B82F6" stop-opacity="0.28"/></linearGradient>' +
                '<linearGradient id="abhOrbitPurple" x1="32" y1="184" x2="308" y2="80" gradientUnits="userSpaceOnUse"><stop stop-color="#8B5CF6" stop-opacity="0.22"/><stop offset="0.5" stop-color="#F43F5E" stop-opacity="0.12"/><stop offset="1" stop-color="#6366F1" stop-opacity="0.24"/></linearGradient>' +
              '</defs>' +
            '</svg>' +
            '<svg class="abh-cube-tl" viewBox="0 0 32 32" fill="none">' +
              '<path d="M16 3L27 9.5L16 16L5 9.5L16 3Z" fill="#FFFFFF"/><path d="M5 9.5L16 16V29L5 22.5V9.5Z" fill="#E0E7FF"/><path d="M27 9.5L16 16V29L27 22.5V9.5Z" fill="#A5B4FC"/><path d="M16 3L27 9.5V22.5L16 29L5 22.5V9.5L16 3Z" stroke="white" stroke-opacity="0.75" stroke-width="0.8"/>' +
            '</svg>' +
            '<span class="abh-orb abh-orb-blue"></span>' +
            '<span class="abh-tile-glass"></span>' +
            '<span class="abh-orb abh-orb-coral"></span>' +
            '<span class="abh-orb abh-orb-lavender"></span>' +
            '<svg class="abh-cube-br" viewBox="0 0 32 32" fill="none">' +
              '<path d="M16 3L27 9.5L16 16L5 9.5L16 3Z" fill="#FFFFFF"/><path d="M5 9.5L16 16V29L5 22.5V9.5Z" fill="#DCE7FE"/><path d="M27 9.5L16 16V29L27 22.5V9.5Z" fill="#B4C6FC"/><path d="M16 3L27 9.5V22.5L16 29L5 22.5V9.5L16 3Z" stroke="white" stroke-opacity="0.85" stroke-width="0.8"/>' +
            '</svg>' +
            '<img class="abh-hero-img" src="' + esc(withBase('/cann-docs-hero-layers.png')) + '" alt="Ascend C 开源文档 3D 架构插画" />' +
          '</div>' +
        '</div></div>' +
      '</section>' +
      '<div class="abh-container"><div class="abh-main">' + bodyHtml + '</div></div>';

    vpHome.classList.add('abh-replaced');
    vpHome.parentNode.insertBefore(root, vpHome.nextSibling);

    var searchTrigger = document.getElementById('abh-search-trigger');
    if (searchTrigger) {
      searchTrigger.addEventListener('click', openVitePressSearch);
    }
    root.querySelectorAll('.abh-expand-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var card = btn.closest('.abh-card');
        var expanded = btn.dataset.expanded === '1';
        card.querySelectorAll('.abh-extra').forEach(function (el) {
          el.classList.toggle('abh-hidden', expanded);
        });
        btn.dataset.expanded = expanded ? '0' : '1';
        btn.textContent = expanded ? ('展开全部（共 ' + btn.dataset.total + ' 项）') : '收起部分';
      });
    });
  }

  function ensureHomeBento() {
    var vpHome = document.querySelector('.VPHome');
    var existing = document.getElementById('ascend-bento-root');
    if (!vpHome) {
      if (existing) existing.remove();
      return;
    }
    if (existing) return;
    if (cachedConfig) {
      renderBentoRoot(cachedConfig);
      return;
    }
    if (loadingConfig) return;
    loadingConfig = true;
    fetch(withBase('/docs-config.json'), { cache: 'no-store' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (cfg) {
        loadingConfig = false;
        if (cfg && Array.isArray(cfg.categories)) {
          cachedConfig = cfg;
          renderBentoRoot(cfg);
        }
      })
      .catch(function () { loadingConfig = false; });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === '/' && document.querySelector('.VPHome') && !/INPUT|TEXTAREA|SELECT/.test((document.activeElement || {}).tagName)) {
      e.preventDefault();
      openVitePressSearch();
    }
  });

  function startObserver() {
    setTimeout(ensureHomeBento, 120);
    setTimeout(ensureHomeBento, 400);
    var raf = null;
    var mo = new MutationObserver(function () {
      if (raf) return;
      raf = requestAnimationFrame(function () { raf = null; ensureHomeBento(); });
    });
    mo.observe(document.body, { childList: true, subtree: true });
  }
  if (document.readyState === 'complete') {
    startObserver();
  } else {
    window.addEventListener('load', startObserver, { once: true });
  }
})();
