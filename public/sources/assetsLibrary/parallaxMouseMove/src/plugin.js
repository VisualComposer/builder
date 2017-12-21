(function (window, document) {
  function createPlugin (element) {
    var Plugin = {
      element: null,
      bgElement: null,
      waypoint: null,
      observer: null,
      reverse: false,
      speed: 30,
      setup: function setup (element) {
        this.resize = this.resize.bind(this);
        this.handleAttributeChange = this.handleAttributeChange.bind(this);
        this.mouseParallax = this.mouseParallax.bind(this);
        this.update = this.update.bind(this);
        // check for data
        if (!element.getVceParallaxMouseMove) {
          element.getVceParallaxMouseMove = this;
          this.element = element;
          this.bgElement = element.querySelector(element.dataset.vceAssetsParallaxMouseMove);
          this.elementRoot = document.getElementById('el-' + element.dataset.vceAssetsParallaxMouseMoveElement);
          this.prepareElement();
          this.create();
        } else {
          this.update();
        }
        return element.getVceParallaxMouseMove;
      },
      handleAttributeChange: function handleAttributeChange () {
        if (this.element.getAttribute('data-vce-assets-parallax-move-mouse')) {
          this.update();
        } else {
          this.destroy();
        }
      },
      addScrollEvent: function addScrollEvent () {
        window.addEventListener('scroll', this.resize);
        this.resize();
      },
      removeScrollEvent: function removeScrollEvent () {
        window.removeEventListener('scroll', this.resize);
      },
      resize: function resize () {
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
      prepareElement: function prepareElement () {
        this.speed = parseInt(element.dataset.vceAssetsParallaxSpeed) || 30;
        if ('vceAssetsParallaxReverse' in element.dataset) {
          this.reverse = element.dataset.vceAssetsParallaxReverse;
        }
        this.bgElement.style.left = '-' + this.speed + 'vw';
        this.bgElement.style.top = '-' + this.speed + 'vh';
        this.bgElement.style.right = '-' + this.speed + 'vw';
        this.bgElement.style.bottom = '-' + this.speed + 'vh';
        this.bgElement.style.transform = `translate(0px, 0px)`
      },
      addMouseMoveEvent: function addMouseMoveEvent () {
        this.elementRoot.addEventListener('mousemove', this.mouseParallax)
        window.addEventListener('resize', this.update)
      },
      removeMouseMoveEvent: function removeMouseMoveEvent () {
        this.elementRoot.removeEventListener('mousemove', this.mouseParallax)
        window.removeEventListener('resize', this.update)
      },
      create: function create () {
        this.addMouseMoveEvent();
        this.observer = new MutationObserver(this.handleAttributeChange);
        this.observer.observe(this.element, {attributes: true});
      },
      mouseParallax: function mouseParallax (event) {
        var x = event.clientX;
        var y = event.clientY;
        var parent = this.bgElement.parentNode;
        var parentRect = parent.getBoundingClientRect();
        var centerX = parentRect.left + parentRect.width / 2;
        var centerY = parentRect.top + parentRect.height / 2;
        var translateX;
        var translateY;
        if (this.reverse === 'true') {
          translateX = (x - centerX) - (this.speed);
          translateY = (y - centerY) - (this.speed);
        } else {
          translateX = (centerX - x) - (this.speed);
          translateY = (centerY - y) - (this.speed);
        }
        var vw = window.innerWidth / 100
        var vh = window.innerHeight / 100
        if (translateX < -(this.speed * vw)) {
          translateX = -(this.speed * vw)
        } else if (translateX > this.speed * vw) {
          translateX = this.speed * vw
        }
        if (translateY < -(this.speed * vh)) {
          translateY = -(this.speed * vh)
        } else if (translateY > this.speed * vh) {
          translateY = this.speed * vh
        }
        this.bgElement.style.transform = `translate(${translateX}px, ${translateY}px)`
      },
      update: function update () {
        this.prepareElement();
      },
      destroy: function destroy () {
        this.removeMouseMoveEvent()
        this.bgElement.style.top = null;
        this.bgElement.style.bottom = null;
        this.bgElement.style.transform = null;
        this.bgElement = null;
        this.observer.disconnect();
        this.observer = null;
        delete this.element.getVceParallaxMouseMove;
        this.element = null;
      }
    };
    return Plugin.setup(element);
  }

  var plugins = {
    init: function init (selector) {
      var elements = document.querySelectorAll(selector);
      elements = [].slice.call(elements);
      elements.forEach(function (element) {
        if (!element.getVceParallaxMouseMove) {
          createPlugin(element);
        } else {
          element.getVceParallaxMouseMove.update();
        }
      });
      if (elements.length === 1) {
        return elements.pop();
      }
      return elements;
    }
  };
  //
  window.vceAssetsParallaxMouseMove = plugins.init;
})(window, document);