(function(window) {
  function vcSticky(selector, options = {}) {
    this.selector = selector;
    window.vcStickyElements = [];

    this.vp = getViewportSize();
    this.body = document.querySelector('body');

    this.options = {
      wrap: options.wrap || true,
      marginTop: options.marginTop || 0,
      stickyFor: options.stickyFor || 0,
      stickyClass: options.stickyClass || null,
      stickyAttribute: options.stickyAttribute || null,
      stickyContainer: options.stickyContainer || 'body',
      isFullWidth: options.isFullWidth || false,
      stickyZIndex: options.isFullWidth || null,
      stickyVisibility: options.stickyVisibility || null
    };

    updateScrollTopPosition = updateScrollTopPosition.bind(this);
    run = run.bind(this);
    renderElement = renderElement.bind(this);
    activate = activate.bind(this);
    initResizeEvents = initResizeEvents.bind(this);
    destroyResizeEvents = destroyResizeEvents.bind(this);
    onResizeEvents = onResizeEvents.bind(this);
    onScrollEvents = onScrollEvents.bind(this);
    setPosition = setPosition.bind(this);
    update = update.bind(this);
    getStickyContainer = getStickyContainer.bind(this);
    getRectangle = getRectangle.bind(this);
    getViewportSize = getViewportSize.bind(this);
    updateScrollTopPosition = updateScrollTopPosition.bind(this);
    forEach = forEach.bind(this);
    css = css.bind(this);

    updateScrollTopPosition();
    window.addEventListener('load', updateScrollTopPosition);
    window.addEventListener('scroll', updateScrollTopPosition);

    run();
  }

  // ========= Public Methods =========

  /**
   * Destroys sticky element, remove listeners
   * @function
   */
  vcSticky.prototype.destroy = function() {
    forEach(window.vcStickyElements, (element) => {
      destroyResizeEvents(element);
      destroyScrollEvents(element);

      if (element.sticky.stickyClass) {
        element.classList.remove(element.sticky.stickyClass);
      }
      if (element.sticky.stickyAttribute) {
        element.removeAttribute(element.sticky.stickyAttribute)
      }

      element.removeAttribute(element.sticky.stickyOffsetAttribute);

      css(element, parseCss({ position: '', width: '', top: '', left: '' }, element.sticky.isFullWidth));

      if (element.sticky.wrap) {
        css(element.parentNode, parseCss({ display: '', width: '', height: '', position: '' }, element.sticky.isFullWidth));
      }
      delete element.sticky;
    });

    window.vcStickyElements = [];
  }

  // ========= Private Methods =========

  /**
   * Function that waits for page to be fully loaded and then renders & activates every sticky element found with specified selector
   * @function
   */
  function run() {
    const elements = document.querySelectorAll(this.selector);
    forEach(elements, (element) => renderElement(element));
  }


  /**
   * Function that assign needed variables for sticky element, that are used in future for calculations and other
   * @function
   * @param {node} element - Element to be rendered
   */
  function renderElement(element) {
    // create container for variables needed in future
    element.sticky = {};

    // set default variables
    element.sticky.active = false;

    element.sticky.marginTop = parseInt(element.getAttribute('data-margin-top')) || this.options.marginTop;
    element.sticky.stickyFor = parseInt(element.getAttribute('data-sticky-for')) || this.options.stickyFor;
    element.sticky.stickyClass = element.getAttribute('data-sticky-class') || this.options.stickyClass;
    element.sticky.stickyAttribute = element.getAttribute('data-sticky-attribute') || this.options.stickyAttribute;
    element.sticky.stickyOffsetAttribute = 'data-vcv-sticky-element-active-offset';
    element.sticky.wrap = element.hasAttribute('data-sticky-wrap') ? true : this.options.wrap;
    element.sticky.stickyContainer = element.getAttribute('data-vce-sticky-container') || this.options.stickyContainer;
    element.sticky.stickyZIndex = element.getAttribute('data-vce-sticky-z-index') || this.options.stickyZIndex;
    element.sticky.isFullWidth = element.getAttribute('data-vce-full-width') === 'true' || this.options.isFullWidth;
    element.sticky.stickyVisibility = element.getAttribute('data-vce-sticky-visibility') === 'true' || this.options.stickyVisibility;

    element.sticky.container = getStickyContainer(element);
    element.sticky.container.rect = getRectangle(element.sticky.container, true, element.sticky.isFullWidth);

    element.sticky.rect = getRectangle(element, false, element.sticky.isFullWidth);

    css(element, parseCss({ zIndex: element.sticky.stickyZIndex }, element.sticky.isFullWidth))

    // fix when element is image that has not yet loaded and width, height = 0
    if (element.tagName.toLowerCase() === 'img') {
      element.onload = () => element.sticky.rect = getRectangle(element, false, element.sticky.isFullWidth);
    }

    // activate rendered element
    activate(element);
  }


  /**
   * Function that activates element when specified conditions are met and then initalise events
   * @function
   * @param {node} element - Element to be activated
   */
  function activate(element) {
    if (
      ((element.sticky.rect.top + element.sticky.rect.height) < (element.sticky.container.rect.top + element.sticky.container.rect.height))
      && (element.sticky.stickyFor < this.vp.width)
      && !element.sticky.active
    ) {
      element.sticky.active = true;
    }

    if (window.vcStickyElements.indexOf(element) < 0) {
      window.vcStickyElements.push(element);
    }

    if (!element.sticky.resizeEvent) {
      initResizeEvents(element);
      element.sticky.resizeEvent = true;
    }

    if (!element.sticky.scrollEvent) {
      initScrollEvents(element);
      element.sticky.scrollEvent = true;
    }

    setPosition(element);
  }


  /**
   * Function which is adding onResizeEvents to window listener and assigns function to element as resizeListener
   * @function
   * @param {node} element - Element for which resize events are initialised
   */
  function initResizeEvents(element) {
    element.sticky.resizeListener = () => onResizeEvents(element);
    window.addEventListener('resize', element.sticky.resizeListener);
  }


  /**
   * Removes element listener from resize event
   * @function
   * @param {node} element - Element from which listener is deleted
   */
  function destroyResizeEvents(element) {
    if (element && element.sticky) {
      window.removeEventListener('resize', element.sticky.resizeListener);
    }
  }


  /**
   * Function which is fired when user resize window. It checks if element should be activated or deactivated and then run setPosition function
   * @function
   * @param {node} element - Element for which event function is fired
   */
  function onResizeEvents(element) {
    this.vp = getViewportSize();

    element.sticky.rect = getRectangle(element, false, element.sticky.isFullWidth);
    element.sticky.container.rect = getRectangle(element.sticky.container, true, element.sticky.isFullWidth);

    if (
      ((element.sticky.rect.top + element.sticky.rect.height) < (element.sticky.container.rect.top + element.sticky.container.rect.height))
      && (element.sticky.stickyFor < this.vp.width)
      && !element.sticky.active
    ) {
      element.sticky.active = true;
    } else if (
      ((element.sticky.rect.top + element.sticky.rect.height) >= (element.sticky.container.rect.top + element.sticky.container.rect.height))
      || element.sticky.stickyFor >= this.vp.width
      && element.sticky.active
    ) {
      element.sticky.active = false;
    }

    setPosition(element);
  }


  /**
   * Function which is adding onScrollEvents to window listener and assigns function to element as scrollListener
   * @function
   * @param {node} element - Element for which scroll events are initialised
   */
  function initScrollEvents(element) {
    element.sticky.scrollListener = () => onScrollEvents(element);
    window.addEventListener('scroll', element.sticky.scrollListener);
  }


  /**
   * Removes element listener from scroll event
   * @function
   * @param {node} element - Element from which listener is deleted
   */
  function destroyScrollEvents(element) {
    if (element && element.sticky) {
      window.removeEventListener('scroll', element.sticky.scrollListener);
    }
  }


  /**
   * Function which is fired when user scroll window. If element is active, function is invoking setPosition function
   * @function
   * @param {node} element - Element for which event function is fired
   */
  function onScrollEvents(element) {
    if (element && element.sticky && element.sticky.active) {
      setPosition(element);
    }
  }


  /**
   * Helper function to parse css properties when some are not needed.
   * @helper
   * @param {object} css - CSS properties that will be parsed
   * @param {boolean} isFullWidth - full width element
   */
  function parseCss(css, isFullWidth) {
    if (isFullWidth) {
      delete css.width;
      delete css.left;
    }
    return css;
  }

  /**
   * Main function for the library. Here are some condition calculations and css appending for sticky element when user scroll window
   * @function
   * @param {node} element - Element that will be positioned if it's active
   */
  function setPosition(element) {
    css(element, parseCss({
      position: '',
      width: '',
      top: '',
      left: '',
      opacity: 1,
      visibility: 'visible'
    }, element.sticky.isFullWidth));

    if (!element.sticky.rect.width) {
      element.sticky.rect = getRectangle(element, false, element.sticky.isFullWidth);
    }

    if (element.sticky.wrap) {
      css(element.parentNode, parseCss({
        display: 'block',
        width: element.sticky.rect.width + 'px',
        height: element.sticky.rect.height + 'px',
        position: element.sticky.stickyVisibility ? 'absolute' : ''
      }, element.sticky.isFullWidth));

      css(element.parentNode.parentNode, {
        position: 'relative'
      });
    }

    if (element.sticky.stickyVisibility) {
      css(element, parseCss({
        width: '',
        top: '',
        left: '',
        position: 'absolute',
        opacity: 0,
        visibility: 'hidden'
      }, element.sticky.isFullWidth));
    }
    if (
      element.sticky.rect.top === 0
      && element.sticky.container === this.body
    ) {
      if (element.sticky.stickyVisibility) {
        css(element.parentNode, parseCss({ height: '' }, element.sticky.isFullWidth));
      }
      css(element, parseCss({
        position: 'fixed',
        top: element.sticky.marginTop + 'px',
        left: element.sticky.rect.left + 'px',
        width: element.sticky.rect.width + 'px',
        visibility: 'visible',
        opacity: 1
      }, element.sticky.isFullWidth));

      if (element.sticky.stickyClass) {
        element.classList.add(element.sticky.stickyClass);
      }
      if (element.sticky.stickyAttribute) {
        element.setAttribute(element.sticky.stickyAttribute, true);
      }

      element.removeAttribute(element.sticky.stickyOffsetAttribute);

    } else if (this.scrollTop > (element.sticky.rect.top - element.sticky.marginTop)) {
      if (element.sticky.stickyVisibility) {
        css(element.parentNode, parseCss({ height: '' }, element.sticky.isFullWidth));
      }
      css(element, parseCss({
        position: 'fixed',
        width: element.sticky.rect.width + 'px',
        left: element.sticky.rect.left + 'px',
        visibility: 'visible',
        opacity: 1
      }, element.sticky.isFullWidth));

      if (
        (this.scrollTop + element.sticky.rect.height + element.sticky.marginTop)
        > (element.sticky.container.rect.top + element.sticky.container.offsetHeight)
      ) {
        if (element.sticky.stickyClass) {
          element.classList.remove(element.sticky.stickyClass);
        }
        if (element.sticky.stickyAttribute) {
          element.removeAttribute(element.sticky.stickyAttribute);
        }

        element.setAttribute(element.sticky.stickyOffsetAttribute, true);

        css(element, parseCss({
          top: (element.sticky.container.rect.top + element.sticky.container.offsetHeight) - (this.scrollTop + element.sticky.rect.height) + 'px'
        }, element.sticky.isFullWidth));
      } else {
        if (element.sticky.stickyClass) {
          element.classList.add(element.sticky.stickyClass);
        }
        if (element.sticky.stickyAttribute) {
          element.setAttribute(element.sticky.stickyAttribute, true);
        }

        element.removeAttribute(element.sticky.stickyOffsetAttribute);

        css(element, parseCss({ top: element.sticky.marginTop + 'px' }, element.sticky.isFullWidth));
      }
    } else {
      if (element.sticky.stickyClass) {
        element.classList.remove(element.sticky.stickyClass);
      }
      if (element.sticky.stickyAttribute) {
        element.removeAttribute(element.sticky.stickyAttribute)
      }

      element.removeAttribute(element.sticky.stickyOffsetAttribute);

      css(element, parseCss({
        position: '',
        width: '',
        top: '',
        left: '',
        opacity: '',
        height: '',
        visibility: ''
      }, element.sticky.isFullWidth));

      if (element.sticky.wrap && !element.sticky.stickyVisibility) {
        css(element.parentNode, parseCss({ display: '', width: '', height: '', position: '' }, element.sticky.isFullWidth));
      }
    }
  }


  /**
   * Function that updates element sticky rectangle (with sticky container), then activate or deactivate element, then update position if it's active
   * @function
   */
  function update() {
    forEach(window.vcStickyElements, (element) => {
      element.sticky.rect = getRectangle(element, false, element.sticky.isFullWidth);
      element.sticky.container.rect = getRectangle(element.sticky.container, true, element.sticky.isFullWidth);

      activate(element);
      setPosition(element);
    });
  }


  /**
   * Function that returns container element in which sticky element is stuck (if is not specified, then it's stuck to body)
   * @function
   * @param {node} element - Element which sticky container are looked for
   * @return {node} element - Sticky container
   */
  function getStickyContainer(element) {
    let container = getClosest(element, element.sticky.stickyContainer);

    if (!container) {
      container = this.body;
    }

    return container;
  }


  /**
   * Function that search closes element with selector
   * @function
   * @param {node} element - Element which sticky container are looked for
   * @return {node} selector - Selector of closest element to find
   */
  function getClosest (element, selector) {
    let matchesFn
    // find vendor prefix
    [ 'matches', 'webkitMatchesSelector', 'mozMatchesSelector', 'msMatchesSelector', 'oMatchesSelector' ].some(function (fn) {
      if (typeof document.body[ fn ] === 'function') {
        matchesFn = fn
        return true
      }
      return false
    })
    let parent
    // traverse parents
    while (element) {
      parent = element.parentElement
      if (parent && parent[ matchesFn ](selector)) {
        return parent
      }
      element = parent
    }
    return null
  }


  /**
   * Function that returns element rectangle & position (width, height, top, left)
   * @function
   * @param {node} element - Element which position & rectangle are returned
   * @param {boolean} isParent - sticky element parent
   * @param {boolean} isFullWidth - is the row full width
   * @return {object}
   */
  function getRectangle(element, isParent = false, isFullWidth = false) {
    css(element, parseCss({ position: '', width: '', top: '', left: '' }, isFullWidth));

    // reset parents css
    if (!isParent) {
      css(element.parentElement, parseCss({ position: '', width: '', top: '', left: '' }, isFullWidth));
    }

    const elementRect = element.getBoundingClientRect();

    const body = document.body;
    const docEl = document.documentElement;

    const scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
    const scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

    const clientTop = docEl.clientTop || body.clientTop || 0;
    const clientLeft = docEl.clientLeft || body.clientLeft || 0;

    const top  = elementRect.top +  scrollTop - clientTop;
    const left = elementRect.left + scrollLeft - clientLeft;
    const width = elementRect.width;
    const height = elementRect.height;

    return { top, left, width, height };
  }


  /**
   * Function that returns viewport dimensions
   * @function
   * @return {object}
   */
  function getViewportSize() {
    return {
      width: Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
      height: Math.max(document.documentElement.clientHeight, window.innerHeight || 0),
    };
  }


  /**
   * Function that updates window scroll position
   * @function
   * @return {number}
   */
  function updateScrollTopPosition() {
    this.scrollTop = (window.pageYOffset || document.scrollTop)  - (document.clientTop || 0) || 0;
  }


  /**
   * Helper function for loops
   * @helper
   * @param array
   * @param {function} callback - Callback function (no need for explanation)
   */
  function forEach(array, callback) {
    for (let i = 0, len = array.length; i < len; i++) {
      callback(array[i]);
    }
  }


  /**
   * Helper function to add/remove css properties for specified element.
   * @helper
   * @param {node} element - DOM element
   * @param {object} properties - CSS properties that will be added/removed from specified element
   */
  function css(element, properties) {
    if (!element) {
      return;
    }

    for (let property in properties) {
      if (properties.hasOwnProperty(property)) {
        element.style[property] = properties[property];
      }
    }
  }


  /**
   * Add to global namespace.
   */

  window.vcSticky = vcSticky;
}(window));