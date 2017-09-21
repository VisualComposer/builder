/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = ".";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__("./src/plugin.js");
	__webpack_require__("./src/backgroundSlider.js");
	module.exports = __webpack_require__("./src/backgroundSlider.css");


/***/ },

/***/ "./src/plugin.js":
/***/ function(module, exports) {

	'use strict';

	(function (window, document) {
	  function createSlider(element) {
	    var Slider = {
	      slider: null,
	      slidesContainer: null,
	      slides: [],
	      activeSlide: 0,
	      isRtl: false,
	      timeout: 1000,
	      effect: 'slide',
	      interval: null,

	      init: function init(element) {
	        // check for data
	        if (!element.getVceSlider) {
	          element.getVceSlider = this;
	        }
	        this.slider = element;
	        this.handleAnimationEnd = this.handleAnimationEnd.bind(this);

	        this.refresh();
	        return element.getVceSlider;
	      },
	      handleAnimationEnd: function handleAnimationEnd(event) {
	        event.target.removeAttribute('data-vce-assets-slider-effect');
	        event.target.style.visibility = null;
	        event.target.style.opacity = null;
	        event.target.style.left = null;
	      },
	      refresh: function refresh() {
	        var _this = this;

	        this.isRtl = window.getComputedStyle(this.slider).direction === 'rtl';
	        this.timeout = parseInt(this.slider.dataset.vceAssetsSlider) * 1000;
	        this.direction = this.slider.dataset.vceAssetsSliderDirection || 'left';
	        // set slides
	        this.slidesContainer = this.slider.querySelector(this.slider.dataset.vceAssetsSliderSlides);
	        this.slides = this.slidesContainer.querySelectorAll(this.slider.dataset.vceAssetsSliderSlide);
	        this.slides = [].slice.call(this.slides); // to create array from slides list

	        if (this.slider.dataset.vceAssetsSliderEffect === 'carousel') {
	          this.initCarousel();
	          return;
	        }

	        this.slides.forEach(function (slide, index) {
	          slide.setAttribute('data-vce-assets-slider-stay-visible', !index);
	          slide.removeEventListener('animationend', _this.handleAnimationEnd);
	          slide.addEventListener('animationend', _this.handleAnimationEnd);
	        });
	        // show first slide with fade
	        this.effect = 'fade';
	        this.slideTo(0);
	        this.effect = this.slider.dataset.vceAssetsSliderEffect;
	        this.autoplay();
	      },
	      findKeyframesRule: function findKeyframesRule(rule) {
	        var ss = document.styleSheets;
	        var result = [];
	        for (var i = 0; i < ss.length; ++i) {
	          if (ss[i].cssRules && ss[i].cssRules.length) {
	            for (var j = 0; j < ss[i].cssRules.length; ++j) {
	              if (ss[i].cssRules[j].type === window.CSSRule.KEYFRAMES_RULE && ss[i].cssRules[j].name === rule) {
	                result.push(ss[i].cssRules[j]);
	              }
	            }
	          }
	        }
	        return result.length ? result : null;
	      },
	      initCarousel: function initCarousel() {
	        var _this3 = this;

	        var isHorizontal = this.direction === 'left' || this.direction === 'right';
	        this.slidesContainer.classList.add('vce-asset-background-slider-slides-carousel');
	        if (!isHorizontal) {
	          this.slidesContainer.classList.add('vce-asset-background-slider-slides-carousel-vertical');
	        }
	        // remove old clones
	        for (var i = 0; i < this.slides.length; i++) {
	          if (this.slides[i].classList.contains('clone')) {
	            this.slidesContainer.removeChild(this.slides[i]);
	            this.slides.splice(i, 1);
	            // delete this.slides[i];
	          }
	        }
	        // create first slide clone
	        var clone = this.slides[0].cloneNode();
	        clone.classList.add('clone');
	        this.slidesContainer.appendChild(clone);
	        // count slides
	        var count = this.slides.length + 1;
	        // set slidesContainer css settings depending on count and direction
	        this.slidesContainer.style[isHorizontal ? 'width' : 'height'] = count + '00%';
	        this.slidesContainer.style.animationDuration = (count - 1) * (this.timeout / 1000) + 's';
	        // update animation keyframes rules depending on count
	        var keyframesRules = {
	          left: {
	            key: '100%',
	            value: '100% { transform: translateX(-' + (100 - 100 / count) + '%); }'
	          },
	          top: {
	            key: '100%',
	            value: '100% { transform: translateY(-' + (100 - 100 / count) + '%); }'
	          },
	          right: {
	            key: '0%',
	            value: '0% { transform: translateX(-' + (100 - 100 / count) + '%); }'
	          },
	          bottom: {
	            key: '0%',
	            value: '0% { transform: translateY(-' + (100 - 100 / count) + '%); }'
	          }
	        };
	        var carouselRule = this.findKeyframesRule('vce-asset-background-slide--carousel-' + this.direction);
	        if (carouselRule) {
	          carouselRule.forEach(function (rule) {
	            rule.deleteRule(keyframesRules[_this3.direction].key);
	            rule.appendRule(keyframesRules[_this3.direction].value);
	          });
	        }
	        // add animation
	        this.slidesContainer.classList.add('animate-' + this.direction);
	      },
	      destroy: function destroy() {
	        this.stopAutoplay();
	        this.slides.forEach(function (slide) {
	          slide.style.transform = null;
	        });
	        delete this.slider.getVceSlider;
	      },
	      slideTo: function slideTo(index) {
	        if (index >= 0 && index < this.slides.length) {
	          var prevIndex = this.activeSlide;
	          this.activeSlide = index;
	          switch (this.effect) {
	            case 'fade':
	              this.effectFade(this.slides[prevIndex], this.slides[index]);
	              break;
	            default:
	              this.effectSlide(this.slides[prevIndex], this.slides[index]);
	          }
	        }
	      },
	      effectSlide: function effectSlide(prevSlide, nextSlide) {
	        prevSlide.style.left = '0';
	        prevSlide.style.visibility = 'visible';
	        prevSlide.setAttribute('data-vce-assets-slider-stay-visible', false);
	        nextSlide.style.left = '100%';
	        nextSlide.style.visibility = 'visible';
	        nextSlide.setAttribute('data-vce-assets-slider-stay-visible', true);
	        prevSlide.setAttribute('data-vce-assets-slider-effect', 'slide');
	        nextSlide.setAttribute('data-vce-assets-slider-effect', 'slide');
	      },
	      effectFade: function effectFade(prevSlide, nextSlide) {
	        prevSlide.style.opacity = 1;
	        prevSlide.style.visibility = 'visible';
	        prevSlide.setAttribute('data-vce-assets-slider-stay-visible', false);
	        nextSlide.style.opacity = 0;
	        nextSlide.style.visibility = 'visible';
	        nextSlide.setAttribute('data-vce-assets-slider-stay-visible', true);
	        prevSlide.setAttribute('data-vce-assets-slider-effect', 'fadeOut');
	        nextSlide.setAttribute('data-vce-assets-slider-effect', 'fadeIn');
	      },
	      slideToNext: function slideToNext() {
	        if (this.slides.length > 1) {
	          if (this.activeSlide === this.slides.length - 1) {
	            this.slideTo(0);
	          } else {
	            this.slideTo(this.activeSlide + 1);
	          }
	        }
	      },
	      slideToPrev: function slideToPrev() {
	        if (this.slides.length > 1) {
	          if (this.activeSlide === 0) {
	            this.slideTo(this.slides.length - 1);
	          } else {
	            this.slideTo(this.activeSlide - 1);
	          }
	        }
	      },
	      autoplay: function autoplay() {
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
	      stopAutoplay: function stopAutoplay() {
	        window.clearInterval(this.interval);
	      }
	    };
	    return Slider.init(element);
	  }

	  var sliders = {
	    init: function init(selector) {
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

/***/ },

/***/ "./src/backgroundSlider.js":
/***/ function(module, exports) {

	'use strict';

	window.vcv.on('ready', function (action, id) {
	  if (action !== 'merge') {
	    var selector = '[data-vce-assets-slider]';
	    selector = id ? '[data-vcv-element="' + id + '"] ' + selector : selector;
	    window.vceAssetsBackgroundSlider(selector);
	  }
	});

/***/ },

/***/ "./src/backgroundSlider.css":
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ }

/******/ });