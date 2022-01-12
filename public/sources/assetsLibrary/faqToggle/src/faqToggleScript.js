(function ($) {
  $.fn.collapsible = function (settings) {
    if (!settings || !settings.titleSelector || !settings.contentSelector || !settings.activeClass) {
      return;
    }

    var collapseSpeed = 400;

    return this.each( function () {
      var element = $(this);
      var title = element.find(settings.titleSelector);
      var titleText = element.find(settings.titleTextSelector);
      var content = element.find(settings.contentSelector);

      element.data('vcvCollapsible', true);

      title.on('click', function () {
        title.toggleClass(settings.activeClass);
        content.slideToggle(collapseSpeed);
        if (titleText.attr('aria-expanded') === 'false') {
          titleText.attr('aria-expanded', true)
        } else {
          titleText.attr('aria-expanded', false)
        }
      });
    });
  };
})(window.jQuery);