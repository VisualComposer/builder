(function (window, document) {
  function createSlider (element) {
    var Slider = {
      slider: null,
      slides: [],
      activeSlide: 0,
      isRtl: false,
      timeout: 1000,
      effect: 'slide',
      interval: null,

      init: function init (element) {
        // check for data
        if (!element.getVceSlider) {
          element.getVceSlider = this;
        }
        this.slider = element;
        this.handleAnimationEnd = this.handleAnimationEnd.bind(this);

        this.refresh();
        return element.getVceSlider;
      },
      handleAnimationEnd: function handleAnimationEnd (event) {
        event.target.removeAttribute('data-vce-assets-slider-effect');
        event.target.style.visibility = null;
        event.target.style.opacity = null;
        event.target.style.left = null;
      },
      refresh: function refresh () {
        var _this = this;

        this.isRtl = window.getComputedStyle(this.slider).direction === 'rtl';
        this.timeout = parseInt(this.slider.dataset.vceAssetsSlider) * 1000;
        this.effect = this.slider.dataset.vceAssetsSliderEffect;
        // set slides
        this.slides = this.slider.querySelectorAll(this.slider.dataset.vceAssetsSliderSlide);
        this.slides = [].slice.call(this.slides); // to create array from slides list
        this.slides.forEach(function (slide, index) {
          slide.setAttribute('data-vce-assets-slider-stay-visible', !index);
          slide.removeEventListener('animationend', _this.handleAnimationEnd);
          slide.addEventListener('animationend', _this.handleAnimationEnd);
        });
        // this.slideTo(0);
        this.autoplay();
      },
      destroy: function destroy () {
        this.stopAutoplay();
        this.slides.forEach(function (slide) {
          slide.style.transform = null;
        });
        delete this.slider.getVceSlider;
      },
      slideTo: function slideTo (index) {
        if (index >= 0 && index < this.slides.length) {
          var prevIndex = this.activeSlide;
          this.activeSlide = index;
          switch (this.effect) {
            case 'fade':
              this.effectFade(this.slides[ prevIndex ], this.slides[ index ]);
              break;
            default:
              this.effectSlide(this.slides[ prevIndex ], this.slides[ index ]);
          }
        }
      },
      effectSlide: function effectSlide (prevSlide, nextSlide) {
        prevSlide.style.left = '0';
        prevSlide.style.visibility = 'visible';
        prevSlide.setAttribute('data-vce-assets-slider-stay-visible', false);
        nextSlide.style.left = '100%';
        nextSlide.style.visibility = 'visible';
        nextSlide.setAttribute('data-vce-assets-slider-stay-visible', true);
        prevSlide.setAttribute('data-vce-assets-slider-effect', 'slide');
        nextSlide.setAttribute('data-vce-assets-slider-effect', 'slide');
      },
      effectFade: function effectFade (prevSlide, nextSlide) {
        prevSlide.style.opacity = 1;
        prevSlide.style.visibility = 'visible';
        prevSlide.setAttribute('data-vce-assets-slider-stay-visible', false);
        nextSlide.style.opacity = 0;
        nextSlide.style.visibility = 'visible';
        nextSlide.setAttribute('data-vce-assets-slider-stay-visible', true);
        prevSlide.setAttribute('data-vce-assets-slider-effect', 'fadeOut');
        nextSlide.setAttribute('data-vce-assets-slider-effect', 'fadeIn');
      },
      slideToNext: function slideToNext () {
        if (this.slides.length > 1) {
          if (this.activeSlide === this.slides.length - 1) {
            this.slideTo(0);
          } else {
            this.slideTo(this.activeSlide + 1);
          }
        }
      },
      slideToPrev: function slideToPrev () {
        if (this.slides.length > 1) {
          if (this.activeSlide === 0) {
            this.slideTo(this.slides.length - 1);
          } else {
            this.slideTo(this.activeSlide - 1);
          }
        }
      },
      autoplay: function autoplay () {
        var _this2 = this;

        this.stopAutoplay();
        if (this.isRtl) {
          this.interval = window.setInterval(function () {
            _this2.slideToPrev();
          }, this.timeout);
        } else {
          this.interval = window.setInterval(function () {
            _this2.slideToNext();
          }, this.timeout);
        }
      },
      stopAutoplay: function stopAutoplay () {
        window.clearInterval(this.interval);
      }
    };
    return Slider.init(element);
  }

  var sliders = {
    init: function init (selector) {
      var sliders = document.querySelectorAll(selector);
      sliders = [].slice.call(sliders);
      sliders.forEach(function (slider) {
        if (slider.getVceSlider) {
          slider.getVceSlider.refresh();
        } else {
          createSlider(slider);
        }
      });
      if (sliders.length === 1) {
        return sliders.pop();
      }
      return sliders;
    }
  };

  window.vceAssetsBackgroundSlider = sliders.init;
})(window, document);