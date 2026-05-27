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
        if (contentBody && menu) {
          contentBody.insertBefore(makeSearchEl('ascend-nav-search'), menu);
        }
      }
    }
  }

  function tryAll() { insertLogo(); insertSearch(); }

  [0, 100, 300, 600, 1000, 1500, 2000].forEach(function (ms) {
    setTimeout(tryAll, ms);
  });

  var mo = new MutationObserver(tryAll);
  mo.observe(document.documentElement, { childList: true, subtree: true });
  setTimeout(function () { mo.disconnect(); }, 5000);
})();
