'use strict';

(function (window, document) {
  function createSlider (element) {
    var Slider = {
      slider: null,
      slides: [],
      activeSlide: 0,
      isRtl: false,
      timeout: 1000,
      interval: null,

      init: function init (element) {
        // check for data
        if (!element.getVceSlider) {
          element.getVceSlider = this;
        }
        this.slider = element;
        this.refresh();
        return element.getVceSlider;
      },
      refresh: function refresh () {
        this.isRtl = window.getComputedStyle(this.slider).direction === 'rtl';
        this.timeout = parseInt(this.slider.dataset.vceAssetsSlider) * 1000;
        // set slides
        this.slides = this.slider.querySelectorAll(this.slider.dataset.vceAssetsSliderSlide);
        this.slides = [].slice.call(this.slides); // to create array from slides list
        this.slideTo(0);
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
        var _this = this;

        if (index >= 0 && index < this.slides.length) {
          this.activeSlide = index;
          this.slides.forEach(function (slide) {
            var slideValue = -100 * _this.activeSlide;
            if (_this.isRtl) {
              slideValue = slideValue * -1;
            }
            slide.style.transform = 'translateX(' + slideValue + '%)';
          });
        }
      },
      slideToNext: function slideToNext () {
        if (this.activeSlide === this.slides.length - 1) {
          this.slideTo(0);
        } else {
          this.slideTo(this.activeSlide + 1);
        }
      },
      slideToPrev: function slideToPrev () {
        if (this.activeSlide === 0) {
          this.slideTo(this.slides.length - 1);
        } else {
          this.slideTo(this.activeSlide - 1);
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
