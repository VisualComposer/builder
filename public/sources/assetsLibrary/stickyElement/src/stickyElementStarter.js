(function () {
  var sticky = null;

  window.vcv.on('ready', function (action, id) {
    if (action !== 'merge') {
      var selector = '[data-vcv-sticky-element]';
      // selector = id ? '[data-vcv-element="' + id + '"]' + selector : selector;

      var stickyElement = document.querySelector(selector);
      if (stickyElement) {
        var settings = {
          wrap: true,
          stickyAttribute: 'data-vce-sticky-element-active'
        };

        // Delay for editor (text block element causes issue with sticky only in editor)
        var delay = action ? 500 : 10;
        if (window.vcSticky) {
          setTimeout(function() {
            if (sticky) {
              sticky.destroy();
            }
            sticky = new window.vcSticky(selector, settings);
          }, delay);
        } else {
          console.error('vcSticky library is not enqueued')
        }
      }
    }
  });
})();

