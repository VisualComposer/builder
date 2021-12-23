(function ($) {
  function initSlider (slider) {
    if (slider.length === 0) {
      return
    }
    const dots = slider.parent().find('.vce-simple-image-slider-dots')
    const prevArrow = slider.find('.vce-simple-image-slider-prev-arrow') || ''
    const nextArrow = slider.find('.vce-simple-image-slider-next-arrow') || ''
    const settings = {
      autoplay: slider[0].dataset.slickAutoplay === 'on',
      autoplaySpeed: slider[0].dataset.slickAutoplayDelay,
      fade: slider[0].dataset.slickEffect === 'fade',
      arrows: slider[0].dataset.slickArrows === 'on',
      prevArrow: prevArrow,
      nextArrow: nextArrow,
      appendDots: dots,
      dots: slider[0].dataset.slickDots === 'on',
      initialSlide: 0,
      respondTo: 'slider',
      swipe: slider[0].dataset.slickDisableSwipe !== 'on',
      swipeToSlide: slider[0].dataset.slickDisableSwipe !== 'on',
      touchMove: slider[0].dataset.slickDisableSwipe !== 'on'
    }
    if (slider.hasClass('slick-initialized')) {
      slider.vcSlick && slider.vcSlick('unslick')
    }
    slider.vcSlick && slider.vcSlick(settings)
  }

  function initialize () {
    const sliders = $('.vce-simple-image-slider-list')
    if (sliders.length) {
      // Use `function` keyword instead of arrow function for correct `this` keyword scope
      sliders.each(function () {
        const slider = $(this)
        initSlider(slider)
      })
    }
  }

  window.vcv.on('ready', () => {
    window.setTimeout(() => {
      initialize()
    }, 50)
  })

  window.vcv.on('reInit', (action, id = '') => {
    const timeout = setTimeout(() => {
      const slider = $(`#el-${id} .vce-simple-image-slider-list`)
      if (slider) {
        initSlider(slider)
      }
      clearTimeout(timeout)
    }, 0)
  })
})(window.jQuery)
