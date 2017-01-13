/* global vcv */
(function ($) {
  vcv.on('singleImageReady', function () {
    var zoomItem = $('.vce-single-image-zoom-container')
    zoomItem.each(function () {
      var $source = $(this)
      $source.trigger('zoom.destroy')
      var imgSrc = $source.find('.vce-single-image').data('img-src')
      $source.zoom({
        url: imgSrc
      })
    })
  })

  vcv.on('ready', function () {
    $(function () {
      vcv.trigger('singleImageReady')
    })
  })
})(window.jQuery)
