'use strict';

(function (window, document) {
  function createPlugin (element) {
    var Plugin = {
      element: null,
      bgElement: null,
      waypoint: null,
      setup: function setup (element) {
        // check for data
        if (!element.getVceParallax) {
          element.getVceParallax = this;
          this.element = element;
          this.bgElement = element.querySelector(element.dataset.vceAssetsParallax);
          this.create();
        } else {
          this.update();
        }
        this.resize = this.resize.bind(this);
        this.addScrollEvent();
        return element.getVceParallax;
      },
      addScrollEvent: function addScrollEvent () {
        window.addEventListener('scroll', this.resize);
        this.resize();
      },
      removeScrollEvent: function removeScrollEvent () {
        window.removeEventListener('scroll', this.resize);
      },
      resize: function resize () {
        console.log('do scroll');
        // console.log(this.element.getBoundingClientRect(), this.element.firstChild.getBoundingClientRect());
        var scrollPos = window.pageYOffset || document.documentElement.scrollTop;
        var windowHeight = window.innerHeight;
        var elementRect = this.element.getBoundingClientRect();
        console.log( elementRect.top - windowHeight, elementRect.height + windowHeight);
        // var bgElementRect = this.bgElement.getBoundingClientRect();
      },
      create: function create () {
        var _this = this;
        console.log('create parallax');
        this.waypoint = {};
        this.waypoint.top = new Waypoint({
          element: _this.element,
          handler: function (direction) {
            if (direction === 'up') {
              // _this.removeScrollEvent();
            }
            if (direction === 'down') {
              // _this.addScrollEvent();
            }
          },
          offset: '100%'
        })
        this.waypoint.bottom = new Waypoint({
          element: _this.element,
          handler: function (direction) {
            if (direction === 'up') {
              // _this.addScrollEvent();
            }
            if (direction === 'down') {
              // _this.removeScrollEvent();
            }
          },
          offset: function () {
            return -this.element.clientHeight;
          }
        })
      },
      update: function update () {
        console.log('update parallax');

        // if (this.vimeoPlayer) {
        //   this.updateData();
        //   this.vimeoPlayer.loadVideo(this.videoId);
        // }
      }
    };
    return Plugin.setup(element);
  }

  var plugins = {
    init: function init (selector) {
      var elements = document.querySelectorAll(selector);
      elements = [].slice.call(elements);
      elements.forEach(function (element) {
        if (!element.getVceParallax) {
          createPlugin(element);
        } else {
          element.getVceParallax.update()
        }
      });
      if (elements.length === 1) {
        return elements.pop();
      }
      return elements;
    }
  };
  //
  window.vceAssetsParallax = plugins.init;
})(window, document);
