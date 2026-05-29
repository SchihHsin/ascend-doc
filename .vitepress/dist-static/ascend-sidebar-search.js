(function () {
  /* ── Logo ── */
  function insertLogo() {
    if (document.querySelector('.VPNavBarTitle img')) return;
    var a = document.querySelector('.VPNavBarTitle .title')
          || document.querySelector('.VPNavBarTitle a');
    if (!a) return;
    var img = document.createElement('img');
    img.className = 'logo';
    img.src = '/Ascendlogo.svg';
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
    var root = location.origin + '/';
    var links = document.querySelectorAll('.VPNavBarMenu a, .VPNavScreenMenu a');
    for (var i = 0; i < links.length; i++) {
      var a = links[i];
      var h = a.getAttribute('href');
      if (!h || h.charAt(0) === '#' || /^[a-z]+:/i.test(h)) continue;
      var u;
      try { u = new URL(h, root); } catch (e) { continue; }
      if (u.origin !== location.origin) continue;
      var abs = u.pathname + u.search + u.hash;
      if (h !== abs) a.setAttribute('href', abs);
    }
  }

  function tryAll() { insertLogo(); insertSearch(); absolutizeNav(); }

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
