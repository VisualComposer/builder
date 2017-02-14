(function (window, document) {
  function createPlugin(element) {
    var Plugin = {
      element: null,
      bgElement: null,
      waypoint: null,
      speed: 30,
      setup: function setup(element) {
        this.resize = this.resize.bind(this);
        // check for data
        if (!element.getVceParallax) {
          element.getVceParallax = this;
          this.element = element;
          this.bgElement = element.querySelector(element.dataset.vceAssetsParallax);
          this.bgElement.style.top = '-' + this.speed + 'vh';
          this.bgElement.style.bottom = '-' + this.speed + 'vh';
          this.create();
        } else {
          this.update();
        }
        return element.getVceParallax;
      },
      addScrollEvent: function addScrollEvent() {
        window.addEventListener('scroll', this.resize);
        this.resize();
      },
      removeScrollEvent: function removeScrollEvent() {
        window.removeEventListener('scroll', this.resize);
      },
      resize: function resize() {
        var windowHeight = window.innerHeight;
        var elementRect = this.element.getBoundingClientRect();
        var contentHeight = elementRect.height + windowHeight;
        var scrollHeight = (elementRect.top - windowHeight) * -1;
        var scrollPercent = 0;
        if (scrollHeight >= 0 && scrollHeight <= contentHeight) {
          scrollPercent = scrollHeight / contentHeight;
        }
        var parallaxValue = this.speed * 2 * scrollPercent * -1 + this.speed;
        this.bgElement.style.transform = 'translateY(' + parallaxValue + 'vh)';
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
            return -this.element.clientHeight;
          }
        });
      },
      update: function update() {
        Waypoint.refreshAll();
      }
    };
    return Plugin.setup(element);
  }

  var plugins = {
    init: function init(selector) {
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