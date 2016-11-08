/* global vcv, $ */
vcv.on('singleImageReady', () => {
  console.log('single image ready')
  let zoomItem = $('.vce-single-image-zoom-container:not(.vce-single-image-zoom-built)')

  zoomItem.each(function () {
    let $this = $(this)
    let imgSrc = $this.find('.vce-single-image').data('img-src')

    $this.zoom({
      url: imgSrc,
      callback: function () {
        this.parentNode.classList.add('vce-single-image-zoom-built')
      }
    })
  })
})