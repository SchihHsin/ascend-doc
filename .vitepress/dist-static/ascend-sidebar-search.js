(function () {
  function init() {
    var nav = document.querySelector('.VPSidebar .nav');
    if (!nav || document.getElementById('ascend-sidebar-search')) return false;

    var el = document.createElement('div');
    el.id = 'ascend-sidebar-search';
    el.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"' +
      ' fill="none" stroke="currentColor" stroke-width="2"' +
      ' stroke-linecap="round" stroke-linejoin="round">' +
      '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>' +
      '</svg><span>搜索文档</span>';

    el.addEventListener('click', function () {
      var btn = document.querySelector(
        '.VPNavBarSearch button, button[aria-label*="Search"], button[aria-label*="搜索"]'
      );
      if (btn) btn.click();
    });

    nav.insertBefore(el, nav.firstChild);
    return true;
  }

  function tryInit() {
    if (!init()) {
      var mo = new MutationObserver(function () { if (init()) mo.disconnect(); });
      mo.observe(document.body, { childList: true, subtree: true });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', tryInit);
  } else {
    tryInit();
  }
})();
