/* global vcv */
(function ($) {
  vcv.on('ready', function () {
    $(function () {
      var collapsibleItems = $('.vce-faq-toggle-inner')
      var settings = {
        titleSelector: '.vce-faq-toggle-title',
        contentSelector: '.vce-faq-toggle-text-block',
        activeClass: 'vce-faq-toggle-state--opened'
      }
      collapsibleItems.each(function () {
        var item = $(this)
        !item.data('vcvCollapsible') && item.collapsible(settings)
      })
    })
  })
})(window.jQuery)
