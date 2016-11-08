/* global vcv, $ */
vcv.on('singleImageReady', () => {
  let zoomItem = $('.vce-single-image-zoom-container')
  zoomItem.each(function () {
    let $source = $(this)
    $source.trigger('zoom.destroy')
    let imgSrc = $source.find('.vce-single-image').data('img-src')
    $source.zoom({
      url: imgSrc
    })
  })
})

vcv.on('ready', () => {
  $(() => {
    vcv.trigger('singleImageReady')
  })
})
