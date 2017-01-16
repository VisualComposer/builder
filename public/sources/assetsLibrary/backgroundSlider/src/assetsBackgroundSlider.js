(function (window, document) {
  function createSlider (element) {
    let Slider = {
      slider: null,
      slides: [],
      activeSlide: 0,
      isRtl: false,
      timeout: 1000,
      interval: null,

      init(element) {
        // check for data
        if (!element.getVcvSlider) {
          element.getVcvSlider = this
        }
        this.slider = element
        this.refresh()
        return element.getVcvSlider
      },
      refresh() {
        this.isRtl = (window.getComputedStyle(this.slider).direction === 'rtl')
        this.timeout = parseInt(this.slider.dataset.vcvAssetsSlider) * 1000
        // set slides
        this.slides = this.slider.querySelectorAll(this.slider.dataset.vcvAssetsSliderSlide)
        this.slides = [].slice.call(this.slides) // to create array from slides list
        this.slideTo(0)
        this.autoplay()
      },
      destroy() {
        this.stopAutoplay()
        this.slides.forEach((slide) => {
          slide.style.transform = null
        })
        delete this.slider.getVcvSlider
      },
      slideTo(index) {
        if (index >= 0 && index < this.slides.length) {
          this.activeSlide = index
          this.slides.forEach((slide) => {
            let slideValue = -100 * this.activeSlide
            if (this.isRtl) {
              slideValue = slideValue * -1
            }
            slide.style.transform = 'translateX(' + slideValue + '%)'
          })
        }
      },
      slideToNext() {
        if (this.activeSlide === this.slides.length - 1) {
          this.slideTo(0)
        } else {
          this.slideTo(this.activeSlide + 1)
        }
      },
      slideToPrev() {
        if (this.activeSlide === 0) {
          this.slideTo(this.slides.length - 1)
        } else {
          this.slideTo(this.activeSlide - 1)
        }
      },
      autoplay() {
        this.stopAutoplay()
        if (this.isRtl) {
          this.interval = window.setInterval(() => {
            this.slideToPrev()
          }, this.timeout)
        } else {
          this.interval = window.setInterval(() => {
            this.slideToNext()
          }, this.timeout)
        }
      },
      stopAutoplay() {
        window.clearInterval(this.interval)
      }
    }
    return Slider.init(element)
  }

  let sliders = {
    init(selector) {
      let sliders = document.querySelectorAll(selector)
      sliders = [].slice.call(sliders)
      sliders.forEach((slider) => {
        if (slider.getVcvSlider) {
          slider.getVcvSlider.refresh()
        } else {
          createSlider(slider)
        }
      })
      if (sliders.length === 1) {
        return sliders.pop()
      }
      return sliders
    }
  }

  window.vcvAssetsBackgroundSlider = sliders.init
})(window, document)
