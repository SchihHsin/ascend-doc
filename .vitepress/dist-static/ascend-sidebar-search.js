(function () {
  function insertLogo() {
    if (document.querySelector('.VPNavBarTitle img')) return; // already there
    var titleLink = document.querySelector('.VPNavBarTitle .title')
                 || document.querySelector('.VPNavBarTitle a');
    if (!titleLink) return;
    var img = document.createElement('img');
    img.className = 'logo';
    img.src = '/Ascendlogo.svg';
    img.alt = 'Ascend C';
    titleLink.insertBefore(img, titleLink.firstChild);
  }

  function insertSearch() {
    if (document.getElementById('ascend-sidebar-search')) return; // already there
    var container = document.getElementById('VPSidebarNav')
                 || document.querySelector('.VPSidebar .nav')
                 || document.querySelector('.VPSidebar nav');
    if (!container) return;
    var el = document.createElement('div');
    el.id = 'ascend-sidebar-search';
    el.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"' +
      ' fill="none" stroke="currentColor" stroke-width="2"' +
      ' stroke-linecap="round" stroke-linejoin="round">' +
      '<circle cx="11" cy="11" r="8"/>' +
      '<line x1="21" y1="21" x2="16.65" y2="16.65"/>' +
      '</svg><span>搜索文档</span>';
    el.addEventListener('click', function () {
      var btn = document.querySelector('.VPNavBarSearch button')
             || document.querySelector('button[aria-label*="Search"]')
             || document.querySelector('button[aria-label*="搜索"]');
      if (btn) btn.click();
    });
    var firstGroup = container.querySelector('.group') || container.firstChild;
    container.insertBefore(el, firstGroup);
  }

  function tryAll() {
    insertLogo();
    insertSearch();
  }

  // Retry at key moments after Vue mounts
  [0, 100, 300, 600, 1000, 2000].forEach(function (ms) {
    setTimeout(tryAll, ms);
  });

  // Also watch for DOM changes (route navigation re-renders sidebar)
  var mo = new MutationObserver(tryAll);
  mo.observe(document.documentElement, { childList: true, subtree: true });
  setTimeout(function () { mo.disconnect(); }, 5000);
})();
