/* global vcv */
(function ($) {
  vcv.on('singleImageReady', function () {
    var zoomItem = $('.vce-single-image-zoom-container')
    zoomItem.each(function () {
      var $source = $(this)
      $source.trigger('zoom.destroy')
      $source.find('.zoomImg').each(function () {
        $(this).remove()
      })

      $source.zoom({
        url: ''
      })
    })
  })

  vcv.on('ready', function () {
    $(function () {
      vcv.trigger('singleImageReady')
    })
  })
})(window.jQuery)
