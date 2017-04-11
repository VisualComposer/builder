(function () {
  if (typeof window.vceResetFullHeightRows !== 'undefined') {
    return
  }

  var fullHeightRows = undefined;

  function getRows() {
    fullHeightRows = Array.prototype.slice.call(document.querySelectorAll('.vce-row-full-height'));
    if (fullHeightRows.length) {
      handleResize();
    }
  }

  function getClosest (el, selector) {
    let matchesFn
    // find vendor prefix
    [ 'matches', 'webkitMatchesSelector', 'mozMatchesSelector', 'msMatchesSelector', 'oMatchesSelector' ].some(function (fn) {
      if (typeof document.body[ fn ] === 'function') {
        matchesFn = fn
        return true
      }
      return false
    })
    let parent
    // traverse parents
    while (el) {
      parent = el.parentElement
      if (parent && parent[ matchesFn ](selector)) {
        return parent
      }
      el = parent
    }
    return null
  }

  function handleResize() {
    if (!fullHeightRows.length) {
      return;
    }
    fullHeightRows.forEach(function (row) {
      var windowHeight = window.innerHeight;
      var offsetTop = row.getBoundingClientRect().top + window.pageYOffset;
      var rowContainer = getClosest(row, '.vce-row-container');

      if (offsetTop < windowHeight && !getClosest(row, '.vce-row') && !rowContainer.previousElementSibling) {
        var fullHeight = 100 - offsetTop / (windowHeight / 100);
        row.style.minHeight = fullHeight + 'vh';
      } else {
        row.style.minHeight = '';
      }
    });
  }

  getRows();
  window.addEventListener('resize', handleResize);
  window.vceResetFullHeightRows = getRows;
})();


