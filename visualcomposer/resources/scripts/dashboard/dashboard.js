(function($) {
  $(function() {
    $('#toplevel_page_vcv-dashboard a').each(function() {
      var $el = $(this);
      $el.attr('target', '_blank');
    });
  });
})(window.jQuery)