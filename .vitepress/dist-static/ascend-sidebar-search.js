(function () {
  var logoDone = false;
  var searchDone = false;

  function insertLogo() {
    if (logoDone) return;
    var titleLink = document.querySelector('.VPNavBarTitle a.title, .VPNavBarTitle .title');
    if (!titleLink) return;
    if (titleLink.querySelector('img.logo')) { logoDone = true; return; }
    var img = document.createElement('img');
    img.className = 'logo';
    img.src = '/Ascendlogo.svg';
    img.alt = 'Ascend C';
    titleLink.insertBefore(img, titleLink.firstChild);
    logoDone = true;
  }

  function insertSearch() {
    if (searchDone) return;
    // VPSidebarNav is the direct items container
    var container = document.querySelector('.VPSidebarNav')
                 || document.querySelector('.VPSidebar .nav');
    if (!container) return;
    if (document.getElementById('ascend-sidebar-search')) { searchDone = true; return; }
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
    container.insertBefore(el, container.firstChild);
    searchDone = true;
  }

  function tryAll() {
    insertLogo();
    insertSearch();
  }

  var mo = new MutationObserver(function () {
    tryAll();
    if (logoDone && searchDone) mo.disconnect();
  });

  mo.observe(document.documentElement, { childList: true, subtree: true });

  // also try on DOMContentLoaded and load
  document.addEventListener('DOMContentLoaded', tryAll);
  window.addEventListener('load', tryAll);
})();
