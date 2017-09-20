(function (window, document) {
  function createPlugin(element) {
    var Plugin = {
      element: null,
      bgElement: null,
      waypoint: null,
      observer: null,
      reverse: false,
      speed: 30,
    setup: function setup(element) {
        this.resize = this.resize.bind(this);
        this.handleAttributeChange = this.handleAttributeChange.bind(this);
        // check for data
        if (!element.getVceParallax) {
          element.getVceParallax = this;
          this.element = element;
          this.bgElement = element.querySelector(element.dataset.vceAssetsParallax);
          this.prepareElement();
          this.create();
        } else {
          this.update();
        }
        return element.getVceParallax;
      },
      handleAttributeChange: function handleAttributeChange() {
        if (this.element.getAttribute('data-vce-assets-parallax')) {
          this.update();
        } else {
          this.destroy();
        }
      },
      addScrollEvent: function addScrollEvent() {
        window.addEventListener('scroll', this.resize);
        this.resize();
      },
      removeScrollEvent: function removeScrollEvent() {
        window.removeEventListener('scroll', this.resize);
      },
      resize: function resize() {
        if (!this.element.clientHeight) {
          return;
        }
        var windowHeight = window.innerHeight;
        var elementRect = this.element.getBoundingClientRect();
        var contentHeight = elementRect.height + windowHeight;
        var scrollHeight = (elementRect.top - windowHeight) * -1;
        var scrollPercent = 0;
        if (scrollHeight >= 0 && scrollHeight <= contentHeight) {
          scrollPercent = scrollHeight / contentHeight;
        }
        var parallaxValue = this.speed * 2 * scrollPercent * -1 + this.speed;
        if (this.reverse === 'true') {
          parallaxValue = parallaxValue * -1;
        }
        this.bgElement.style.transform = 'translateY(' + parallaxValue + 'vh)';
      },
      prepareElement: function prepareElement() {
        var speed = parseInt(element.dataset.vceAssetsParallaxSpeed);
        if (speed) {
          this.speed = speed;
        }
        if ('vceAssetsParallaxReverse' in element.dataset) {
          this.reverse = element.dataset.vceAssetsParallaxReverse;
        }
        this.bgElement.style.top = '-' + this.speed + 'vh';
        this.bgElement.style.bottom = '-' + this.speed + 'vh';
      },
      create: function create() {
        var _this = this;
        this.waypoint = {};
        this.waypoint.top = new Waypoint({
          element: _this.element,
          handler: function handler(direction) {
            if (direction === 'up') {
              _this.removeScrollEvent();
            }
            if (direction === 'down') {
              _this.addScrollEvent();
            }
          },
          offset: '100%'
        });
        this.waypoint.bottom = new Waypoint({
          element: _this.element,
          handler: function handler(direction) {
            if (direction === 'up') {
              _this.addScrollEvent();
            }
            if (direction === 'down') {
              _this.removeScrollEvent();
            }
          },
          offset: function offset() {
            return -_this.element.clientHeight;
          }
        });
        _this.observer = new MutationObserver(this.handleAttributeChange);
        _this.observer.observe(this.element, {attributes: true});
      },
      update: function update() {
        this.prepareElement();
        this.resize();
        Waypoint.refreshAll();
      },
      destroy: function destroy() {
        this.removeScrollEvent();
        this.bgElement.style.top = null;
        this.bgElement.style.bottom = null;
        this.bgElement.style.transform = null;
        this.bgElement = null;
        this.waypoint.top.destroy();
        this.waypoint.bottom.destroy();
        this.waypoint = null;
        this.observer.disconnect();
        this.observer = null;
        delete this.element.getVceParallax;
        this.element = null;
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
        if (!element.getVceParallax) {
          createPlugin(element);
        } else {
          element.getVceParallax.update();
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