(function (window, document) {
  function createPlugin(element) {
    var Plugin = {
      element: null,
      fadeElement: null,
      waypoint: null,
      observer: null,
      offset: 45,
      setup: function setup(element) {
        this.fade = this.fade.bind(this);
        this.handleAttributeChange = this.handleAttributeChange.bind(this);
        // check for data
        if (!element.getVceParallaxFade) {
          element.getVceParallaxFade = this;
          this.element = element;
          this.fadeElement = element.parentNode.parentNode.querySelector('[data-vce-element-content]');
          this.create();
        } else {
          this.update();
        }
        return element.getVceParallaxFade;
      },
      handleAttributeChange: function handleAttributeChange() {
        if (this.element.getAttribute('data-vce-assets-parallax-fade')) {
          this.update();
        } else {
          this.destroy();
        }
      },
      addFadeEvent: function addFadeEvent() {
        window.addEventListener('scroll', this.fade);
        this.fade();
      },
      removeFadeEvent: function removeFadeEvent() {
        window.removeEventListener('scroll', this.fade);
      },
      fade: function fade() {
        if (!this.element.clientHeight) {
          this.fadeElement.style.opacity = null;
          return;
        }
        var windowHeight = window.innerHeight;
        var elementRect = this.fadeElement.getBoundingClientRect();
        var scrollPercent = scrollPercent = elementRect.bottom / windowHeight * 100;
        if (scrollPercent < this.offset && scrollPercent >= 0) {
          var opacity = (scrollPercent - 5) / this.offset;
          opacity = opacity < 0 ? 0 : opacity;
          this.fadeElement.style.opacity = opacity;
        } else {
          this.fadeElement.style.opacity = null;
        }
      },
      create: function create() {
        var _this = this;
        this.waypoint = {};
        this.waypoint.top = new Waypoint({
          element: _this.fadeElement,
          handler: function handler(direction) {
            if (direction === 'up') {
              _this.removeFadeEvent();
            }
            if (direction === 'down') {
              _this.addFadeEvent();
            }
          },
          offset: 'bottom-in-view'
        });
        this.waypoint.bottom = new Waypoint({
          element: _this.fadeElement,
          handler: function handler(direction) {
            if (direction === 'up') {
              _this.addFadeEvent();
            }
            if (direction === 'down') {
              _this.removeFadeEvent();
            }
          },
          offset: function offset() {
            return -_this.fadeElement.clientHeight;
          }
        });
        _this.observer = new MutationObserver(this.handleAttributeChange);
        _this.observer.observe(this.element, {attributes: true});
      },
      update: function update() {
        this.fade();
        Waypoint.refreshAll();
      },
      destroy: function destroy() {
        this.removeFadeEvent();
        this.fadeElement.style.opacity = null;
        this.fadeElement = null;
        this.waypoint.top.destroy();
        this.waypoint.bottom.destroy();
        this.waypoint = null;
        this.observer.disconnect();
        this.observer = null;
        delete this.element.getVceParallaxFade;
        // this.element = null;
      }
    };
    return Plugin.setup(element);
  }

  var plugins = {
    init: function init(selector) {
      Waypoint.refreshAll();
      var elements = document.querySelectorAll(selector);
      elements = [].slice.call(elements);
      elements.forEach(function (element) {
        if (!element.getVceParallaxFade) {
          createPlugin(element);
        } else {
          element.getVceParallaxFade.update();
        }
      });
      if (elements.length === 1) {
        return elements.pop();
      }
      return elements;
    }
  };
  //
  window.vceAssetsParallaxFade = plugins.init;
})(window, document);