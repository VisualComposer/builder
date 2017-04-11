(function () {
  var fullWidthRows = undefined;

  function getRows() {
    fullWidthRows = Array.prototype.slice.call(document.querySelectorAll('[data-vce-full-width="true"]'));
    if (fullWidthRows.length) {
      handleResize();
    }
  }

  function handleResize() {
    if (!fullWidthRows.length) {
      return;
    }
    fullWidthRows.forEach(function (row) {
      var rowHelper = row.parentElement;
      var rowContent = row.querySelector('.vce-row-content');

      var elMarginLeft = parseInt(window.getComputedStyle(row, null)['margin-left'], 10);
      var elMarginRight = parseInt(window.getComputedStyle(row, null)['margin-right'], 10);

      var offset = 0 - rowHelper.getBoundingClientRect().left - elMarginLeft;
      var width = document.documentElement.getBoundingClientRect().width;

      row.style.width = width + 'px';
      row.style.left = offset + 'px';

      if (!row.getAttribute('data-vce-stretch-content')) {
        var padding = -1 * offset;
        if (padding < 0) {
          padding = 0;
        }
        var paddingRight = width - padding - rowHelper.getBoundingClientRect().width + elMarginLeft + elMarginRight;
        if (paddingRight < 0) {
          paddingRight = 0;
        }
        rowContent.style['padding-left'] = padding + 'px';
        rowContent.style['padding-right'] = paddingRight + 'px';
      } else {
        rowContent.style['padding-left'] = '';
        rowContent.style['padding-right'] = '';
      }
    });
  }

  getRows();
  window.addEventListener('resize', handleResize);
  window.vceResetFullWidthRows = getRows;
})();