import './stickyElement.css';

(function (window) {
  window.vcStickySettings = null;

  window.vcv.on('ready', function (action, id) {
    if (action !== 'merge') {
      var selector = '[data-vce-sticky-element]';

      var settings = {
        wrap: true,
        stickyAttribute: 'data-vcv-sticky-element-active'
      };

      // Delay for editor (text block element causes issue with sticky only in editor)
      var delay = action ? 500 : 10;
      if (window.vcSticky) {
        setTimeout(function() {
          if (window.vcStickySettings) {
            window.vcStickySettings.destroy();
          }
          window.vcStickySettings = new window.vcSticky(selector, settings);
        }, delay);
      } else {
        console.error('vcSticky library is not enqueued');
      }
    }
  });
}(window));

