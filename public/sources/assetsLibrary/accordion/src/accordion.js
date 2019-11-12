// source: https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent
(function() {
  if (typeof window.CustomEvent === "function") return false;

  function CustomEvent(event, params) {
    params = params || { bubbles: false, cancelable: false, detail: undefined };
    var evt = document.createEvent("CustomEvent");
    evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
    return evt;
  }

  CustomEvent.prototype = window.Event.prototype;

  window.CustomEvent = CustomEvent;
})();

/* =========================================================
 * vce-accordion.js v1.0.0
 * =========================================================
 * Copyright 2013 Wpbakery
 *
 * Visual composer accordion
 * ========================================================= */
(function ($) {
  'use strict';

  var Accordion, clickHandler, old, hashNavigation, setActiveTab, getListWidth;

  // Accordion plugin definition
  // ==========================
  function Plugin (action, options) {
    var args;

    args = Array.prototype.slice.call(arguments, 1);
    return this.each(function () {
      var $this, data;

      $this = $(this);
      data = $this.data('vce.accordion');
      if (!data) {
        data = new Accordion($this, $.extend(true, {}, options));
        $this.data('vce.accordion', data);
      }
      if ('string' === typeof(action)) {
        data[ action ].apply(data, args);
      }
    });
  }

  /**
   * Accordion object definition
   * @param $element
   * @constructor
   */
  Accordion = function ($element, options) {
    this.$element = $element;
    this.activeAttribute = 'data-vcv-active';
    this.animatingAttribute = 'data-vcv-animating';
    this.positionToActive = 'data-vcv-position-to-active';
    // cached vars
    this.useCacheFlag = undefined;
    this.$target = undefined;
    this.$targetContent = undefined;
    this.selector = undefined;
    this.$container = undefined;
    this.animationDuration = undefined;
    this.index = 0;
  };

  /**
   * Get supported transition event
   * @returns {*}
   */
  Accordion.transitionEvent = function () {
    var transition, transitions, el;
    el = document.createElement('vcFakeElement');
    transitions = {
      'transition': 'transitionend',
      'MSTransition': 'msTransitionEnd',
      'MozTransition': 'transitionend',
      'WebkitTransition': 'webkitTransitionEnd'
    };

    for (transition in
      transitions) {
      if ('undefined' !== typeof(el.style[ transition ])) {
        return transitions[ transition ];
      }
    }
  };

  /**
   * Emulate transition end
   * @param $el
   * @param duration
   */
  Accordion.emulateTransitionEnd = function ($el, duration) {
    var callback, called;
    called = false;
    if (!duration) {
      duration = 250;
    }

    $el.one(Accordion.transitionName, function () {
      called = true;
    });
    callback = function () {
      if (!called) {
        $el.trigger(Accordion.transitionName);
      }
    };
    setTimeout(callback, duration);
  };

  Accordion.DEFAULT_TYPE = 'collapse';
  Accordion.transitionName = Accordion.transitionEvent();

  /**
   * Accordion controller
   * @param action
   */
  Accordion.prototype.controller = function (options) {
    var $this;
    $this = this.$element;
    var action = options;
    if ('string' !== typeof(action)) {
      action = $this.data('vceAction') || this.getContainer().data('vceAction');
    }
    if ('undefined' === typeof(action)) {
      action = Accordion.DEFAULT_TYPE;
    }

    if ('string' === typeof(action)) {
      Plugin.call($this, action, options);
    }
  };

  /**
   * Is cache used
   * @returns {boolean}
   */
  Accordion.prototype.isCacheUsed = function () {
    var useCache, that;
    that = this;
    useCache = function () {
      return false !== that.$element.data('vceUseCache');
    };

    if ('undefined' === typeof(this.useCacheFlag)) {
      this.useCacheFlag = useCache();
    }

    return this.useCacheFlag;
  };

  /**
   * Get selector
   * @returns {*}
   */
  Accordion.prototype.getSelector = function () {
    var findSelector, $this;

    $this = this.$element;

    findSelector = function () {
      var selector;

      selector = $this.data('vceTarget');
      if (!selector) {
        selector = $this.attr('href');
      }

      return selector;
    };

    if (!this.isCacheUsed()) {
      return findSelector();
    }

    if ('undefined' === typeof(this.selector)) {
      this.selector = findSelector();
    }

    return this.selector;
  };

  /**
   * Find container
   * @returns {window.jQuery}
   */
  Accordion.prototype.findContainer = function () {
    var $container;
    $container = this.$element.closest(this.$element.data('vceContainer'));
    if (!$container.length) {
      $container = $('body');
    }
    return $container;
  };

  /**
   * Get container
   * @returns {*|Number}
   */
  Accordion.prototype.getContainer = function () {
    if (!this.isCacheUsed()) {
      return this.findContainer();
    }

    if ('undefined' === typeof(this.$container)) {
      this.$container = this.findContainer();
    }

    return this.$container;
  };

  /**
   * Get target
   * @returns {*}
   */
  Accordion.prototype.getTarget = function () {
    var selector, that, getTarget;
    that = this;
    selector = that.getSelector();
    getTarget = function () {
      var element;
      element = that.getContainer().find(selector);
      if (!element.length) {
        element = that.getContainer().filter(selector);
      }
      return element;
    };

    if (!this.isCacheUsed()) {
      return getTarget();
    }

    if ('undefined' === typeof(this.$target)) {
      this.$target = getTarget();
    }

    return this.$target;
  };

  /**
   * Get target content
   * @returns {*}
   */
  Accordion.prototype.getTargetContent = function () {
    var $target, $targetContent;
    $target = this.getTarget();
    if (!this.isCacheUsed()) {
      if ($target.data('vceContent')) {
        $targetContent = $target.find($target.data('vceContent'));
        if ($targetContent.length) {
          return $targetContent;
        }
      }
      return $target;
    }

    if ('undefined' === typeof(this.$targetContent)) {
      $targetContent = $target;
      if ($target.data('vceContent')) {
        $targetContent = $target.find($target.data('vceContent'));
        if (!$targetContent.length) {
          $targetContent = $target;
        }
      }
      this.$targetContent = $targetContent;
    }

    return this.$targetContent;
  };

  /**
   * Get triggers
   * @returns {*}
   */
  Accordion.prototype.getTriggers = function () {
    var i;
    i = 0;
    var panels = this.getContainer().find('.vce-tabs-with-slide-panels')[0];

    return $(panels).find('> .vce-tabs-with-slide-panel > .vce-tabs-with-slide-tab-inner > .vce-tabs-with-slide-panel-heading [data-vce-accordion]').each(function () {
      var accordion, $this;
      $this = $(this);
      accordion = $this.data('vce.accordion');
      if ('undefined' === typeof(accordion)) {
        $this.vceAccordion();
        accordion = $this.data('vce.accordion');
      }
      accordion && accordion.setIndex && accordion.setIndex(i++);
    });
  };

  /**
   * Set the position index in getTriggers
   * @param index
   */
  Accordion.prototype.setIndex = function (index) {
    this.index = index;
  };

  /**
   * Get the position index in getTriggers
   */
  Accordion.prototype.getIndex = function () {
    return this.index;
  };

  /**
   * Trigger event
   * @param event
   */
  Accordion.prototype.triggerEvent = function (event, opt) {
    var $event;
    if ('string' === typeof(event)) {
      $event = $.Event(event);
      this.$element.trigger($event, opt);
    }
  };

  /**
   * Get active triggers
   * @returns {*}
   */
  Accordion.prototype.getActiveTriggers = function () {
    var $triggers;

    $triggers = this.getTriggers().filter(function () {
      var $this, accordion;
      $this = $(this);
      accordion = $this.data('vce.accordion');

      return accordion.getTarget().attr(accordion.activeAttribute) === 'true';
    });
    return $triggers;
  };

  /**
   * change document location hash
   */
  Accordion.prototype.changeLocationHash = function () {
    var id, $target;
    $target = this.getTarget();
    if ($target.length) {
      id = $target.attr('id');
    }
    if (id) {
      if (history.pushState) {
        history.pushState(null, null, '#' + id);
      }
      else {
        location.hash = '#' + id;
      }
    }
  };

  /**
   * is active
   * @returns {boolean}
   */
  Accordion.prototype.isActive = function () {
    return this.getTarget().attr(this.activeAttribute) === 'true';
  };

  /**
   * Get animation duration
   * @returns {*|Number}
   */
  Accordion.prototype.getAnimationDuration = function () {
    var findAnimationDuration, that;
    that = this;

    findAnimationDuration = function () {
      var $targetContent, duration;

      if ('undefined' === typeof(Accordion.transitionName)) {
        return '0s';
      }

      $targetContent = that.getTargetContent();
      duration = $targetContent.css('transition-duration');
      duration = duration.split(',')[ 0 ];
      return duration;
    };

    if (!this.isCacheUsed()) {
      return findAnimationDuration();
    }

    if ('undefined' === typeof(this.animationDuration)) {
      this.animationDuration = findAnimationDuration();
    }
    return this.animationDuration;
  };

  /**
   * Get animation duration in milliseconds
   * @returns {*|Number}
   */
  Accordion.prototype.getAnimationDurationMilliseconds = function () {
    var duration;
    duration = this.getAnimationDuration();

    if ('ms' === duration.substr(-2)) {
      return parseInt(duration);
    }

    if ('s' === duration.substr(-1)) {
      return Math.round(parseFloat(duration) * 1000)
    }
  };

  /**
   * Has animation
   * @returns {boolean}
   */
  Accordion.prototype.isAnimated = function () {
    return parseFloat(this.getAnimationDuration()) > 0;
  };

  /**
   * Show accordion panel
   */
  Accordion.prototype.show = function (opt) {
    var $target, that, $targetContent, $container, $elementId;

    that = this;
    $target = that.getTarget();
    $targetContent = that.getTargetContent();
    $container = that.getContainer()[0];
    $elementId = that.$element.attr('href')

    var event = new CustomEvent('attrChange');
    $container.setAttribute('data-vcv-tabs-opened', $elementId);
    $container.dispatchEvent(event);

    that.triggerEvent('show.vce.accordion', opt);

    // if showed no need to do anything
    if (that.isActive()) {
      return;
    }

    if (that.isAnimated()) {
      that.triggerEvent('beforeShow.vce.accordion');
      $target
        .queue(function (next) {
          $targetContent.one(Accordion.transitionName, function () {
            $target.removeAttr(that.animatingAttribute);
            $targetContent.attr('style', '');
            that.triggerEvent('afterShow.vce.accordion', opt);
          });
          Accordion.emulateTransitionEnd($targetContent, that.getAnimationDurationMilliseconds() + 100);
          next();
        })
        .queue(function (next) {
          $targetContent.attr('style', '');
          $targetContent.css({
            visibility: 'hidden',
            display: 'block'
          });
          var height = $targetContent.height();
          $targetContent.data('vceHeight', height);
          $targetContent.attr('style', '');
          next();
        })
        .queue(function (next) {
          $targetContent.height(0);
          $targetContent.css({
            'padding-top': 0,
            'padding-bottom': 0
          });
          next();
        })
        .queue(function (next) {
          $target.attr(that.animatingAttribute, true);
          $target.attr(that.activeAttribute, true);
          $target.removeAttr(that.positionToActive);
          if (( typeof opt === 'object' && opt.hasOwnProperty('changeHash') && opt.changeHash) || (typeof opt === 'undefined')) {
            that.changeLocationHash();
          }
          // that.triggerEvent('show.vce.accordion', opt);
          next();
        })
        .queue(function (next) {
          var height = $targetContent.data('vceHeight');
          $targetContent.animate({ 'height': height }, {
            duration: that.getAnimationDurationMilliseconds(),
            complete: function () {
              if (!$targetContent.data('events')) {
                $targetContent.attr('style', '');
              }
            }
          });
          $targetContent.css({
            'padding-top': '',
            'padding-bottom': ''
          });
          next();
        })
        .queue(function (next) {
          var previousTabs = $target.prevAll();
          var nextTabs = $target.nextAll();

          previousTabs.each(function (i, elem) {
            var $elem = $(elem);
            $elem.attr(that.positionToActive, 'before');
            $elem.removeAttr(that.activeAttribute);
          });

          nextTabs.each(function (i, elem) {
            var $elem = $(elem);
            $elem.attr(that.positionToActive, 'after');
            $elem.removeAttr(that.activeAttribute);
          });

          next();
        });
    } else {
      // $target.addClass(that.activeClass);
      $target.attr(that.activeAttribute, true);
      that.triggerEvent('show.vce.accordion', opt);
    }
  };

  /**
   * Hide accordion panel
   */
  Accordion.prototype.hide = function (opt) {
    var $target, that, $targetContent;

    that = this;
    $target = that.getTarget();
    $targetContent = that.getTargetContent();

    // if hidden no need to do anything
    if (!that.isActive()) {
      return;
    }

    if (that.isAnimated()) {
      that.triggerEvent('beforeHide.vce.accordion');
      $target
        .queue(function (next) {
          $targetContent.one(Accordion.transitionName, function () {
            $target.removeAttr(that.animatingAttribute);
            $targetContent.attr('style', '');
            that.triggerEvent('afterHide.vce.accordion', opt);
          });
          Accordion.emulateTransitionEnd($targetContent, that.getAnimationDurationMilliseconds() + 100);
          next();
        })
        .queue(function (next) {
          $target.attr(that.animatingAttribute, true);
          $target.removeAttr(that.activeAttribute);
          that.triggerEvent('hide.vce.accordion', opt);
          next();
        })
        .queue(function (next) {
          var height = $targetContent.height();
          $targetContent.height(height);
          next();
        })
        .queue(function (next) {
          $targetContent.animate({ 'height': 0 }, that.getAnimationDurationMilliseconds());
          $targetContent.css({
            'padding-top': 0,
            'padding-bottom': 0
          });
          next();
        });
    } else {
      // $target.removeClass(that.activeClass);
      $target.removeAttr(that.activeAttribute);
      that.triggerEvent('hide.vce.accordion', opt);
    }
  };

  /**
   * Accordion type: toggle
   */
  Accordion.prototype.toggle = function (opt) {
    var $this;

    $this = this.$element;

    if (this.isActive()) {
      Plugin.call($this, 'hide', opt);
    } else {
      Plugin.call($this, 'show', opt);
    }
  };

  /**
   * Accordion type: dropdown
   */
  Accordion.prototype.dropdown = function (opt) {
    var $this;
    $this = this.$element;

    if (this.isActive()) {
      Plugin.call($this, 'hide', opt);
    } else {
      Plugin.call($this, 'show', opt);
      $(document).on('click.vce.accordion.data-api.dropdown', function (e) {
        // Fix for https://app.asana.com/0/90442874619636/58756889349011
        //var isTarget;
        //isTarget = $( e.target ).closest( that.getTarget() ).length;
        //if ( ! isTarget ) {
        Plugin.call($this, 'hide', opt);
        $(document).off(e);
        //}
      });
    }
  };

  /**
   * Accordion type: collapse
   */
  Accordion.prototype.collapse = function (opt) {
    var $this,
      $triggers;

    $this = this.$element;
    $triggers = this.getActiveTriggers().filter(function () {
      return $this[ 0 ] !== this;
    });

    if ($triggers.length) {
      Plugin.call($triggers, 'hide', opt);
    }
    Plugin.call($this, 'show', opt);
  };

  /**
   * Accordion type: collapse all
   */
  Accordion.prototype.collapseAll = function (opt) {
    var $this,
      $triggers;

    $this = this.$element;
    $triggers = this.getActiveTriggers().filter(function () {
      return $this[ 0 ] !== this;
    });

    if ($triggers.length) {
      Plugin.call($triggers, 'hide', opt);
    }
    Plugin.call($this, 'toggle', opt);
  };

  Accordion.prototype.showNext = function (opt) {
    var $triggers,
      $activeTriggers,
      activeIndex;

    $triggers = this.getTriggers();
    $activeTriggers = this.getActiveTriggers();
    if ($triggers.length) {
      if ($activeTriggers.length) {
        var lastActiveAccordion;
        lastActiveAccordion = $activeTriggers.eq($activeTriggers.length - 1).vceAccordion().data('vce.accordion');
        if (lastActiveAccordion && lastActiveAccordion.getIndex) {
          activeIndex = lastActiveAccordion.getIndex();
        }
      }
      if (-1 < activeIndex) {
        if (activeIndex + 1 < $triggers.length) {
          Plugin.call($triggers.eq(activeIndex + 1), 'controller', opt);
        } else {
          // we are in the end so next is first
          Plugin.call($triggers.eq(0), 'controller', opt);
        }
      } else {
        // no one is active let's activate first
        Plugin.call($triggers.eq(0), 'controller', opt);
      }
    }
  };

  Accordion.prototype.showPrev = function (opt) {
    var $triggers,
      $activeTriggers,
      activeIndex;

    $triggers = this.getTriggers();
    $activeTriggers = this.getActiveTriggers();
    if ($triggers.length) {
      if ($activeTriggers.length) {
        var lastActiveAccordion;
        lastActiveAccordion = $activeTriggers.eq($activeTriggers.length - 1).vceAccordion().data('vce.accordion');
        if (lastActiveAccordion && lastActiveAccordion.getIndex) {
          activeIndex = lastActiveAccordion.getIndex();
        }
      }
      if (-1 < activeIndex) {
        if (0 <= activeIndex - 1) {
          Plugin.call($triggers.eq(activeIndex - 1), 'controller', opt);
        } else {
          // we are in the end so next is first
          Plugin.call($triggers.eq($triggers.length - 1), 'controller', opt);
        }
      } else {
        // no one is active let's activate first
        Plugin.call($triggers.eq(0), 'controller', opt);
      }
    }
  };

  Accordion.prototype.showAt = function (index, opt) {
    var $triggers;

    $triggers = this.getTriggers();
    if ($triggers.length && index && index < $triggers.length) {
      Plugin.call($triggers.eq(index), 'controller', opt);
    }
  };

  Accordion.prototype.scrollToActive = function (opt) {
    if (typeof opt !== 'undefined' && typeof opt.scrollTo !== 'undefined' && !opt.scrollTo) {
      return
    }
    var that, $targetElement, offset, delay, speed;
    that = this;
    offset = 1;
    delay = 300;
    speed = 300;

    $targetElement = $(this.getTarget());
    if ($targetElement.length) {
      if (this.$element.length) {
        setTimeout(function () {
          var posY = $targetElement.offset().top - $(window).scrollTop() - that.$element.outerHeight() * offset;
          if (posY < 0) {
            $('html, body').animate({
              scrollTop: $targetElement.offset().top - that.$element.outerHeight() * offset
            }, speed);
          }
        }, delay);
      }
    }
  };

  old = $.fn.vceAccordion;

  $.fn.vceAccordion = Plugin;
  $.fn.vceAccordion.Constructor = Accordion;

  // Accordion no conflict
  // ==========================
  $.fn.vceAccordion.noConflict = function () {
    $.fn.vceAccordion = old;
    return this;
  };

  // Accordion data-api
  // =================
  clickHandler = function (e) {
    var $this;
    $this = $(this);
    e.preventDefault();
    Plugin.call($this, 'controller');
  };

  hashNavigation = function () {
    var hash, $targetElement, $accordion, offset, delay, speed;
    offset = 0.2;
    delay = 300;
    speed = 0;

    hash = window.location.hash;
    $targetElement = hash && $(hash);
    $accordion = $targetElement.length && $targetElement.find('[data-vce-accordion][href="' + hash + '"],[data-vce-accordion][data-vce-target="' + hash + '"]');

    if ($accordion.length) {
      setTimeout(function () {
        $('html, body').animate({
          scrollTop: $targetElement.offset().top - $(window).height() * offset
        }, speed);
      }, delay);
      $accordion.trigger('click');
      $accordion.closest(".vce-tabs-with-slide").attr("data-vcv-initialized", true).attr("data-vcv-hash-navigated", true)
    }
    setActiveTab('add');
  };

  setActiveTab = function (action, elementId) {
    var $tabs = $('.vce-tabs-with-slide:not([data-vcv-hash-navigated])');

    if (action !== undefined && action !== 'add' && action !== 'update') {
      return;
    }

    if (action === 'update') {
      var el = $('#el-' + elementId);

      if (el && el.hasClass('vce-global-element')) {
        $tabs = el.find('.vce-tabs-with-slide');
      } else {
        return;
      }
    }

    if (action && action === 'add' && elementId) {
      var id = '#el-' + elementId;
      $tabs = $(id + '.vce-tabs-with-slide');

      if ($tabs.length < 1) {
        id = '#el-' + elementId + '-temp';
        $tabs = $(id + '.vce-tabs-with-slide');
      }
    }

    $tabs && $tabs.each(function (index, element) {
      var $element = $(element);
      var activeTabIndex = parseInt($element.attr('data-active-tab'));
      var accordionPanelContainer = $element.find('.vce-tabs-with-slide-panels')[0];
      var accordionPanels = $(accordionPanelContainer).find('> .vce-tabs-with-slide-panel');
      var tabsInner = $element.find('.vce-tabs-with-slide-inner')[0];
      var activeId = null;
      var event = new CustomEvent('attrChange');
      var tabContainer = $element.find('.vce-tabs-with-slide-list')[0];
      var tabHeadings = $(tabContainer).find('> [data-vce-tab]');

      activeTabIndex = accordionPanels.length >= activeTabIndex ? activeTabIndex - 1 : 0;

      $(accordionPanels).each(function (i, elem) {
        var $elem = $(elem);
        $elem.removeAttr('data-vcv-active');

        if (i < activeTabIndex) {
          $elem.attr('data-vcv-position-to-active', 'before');
        } else if (i === activeTabIndex) {
          $elem.attr('data-vcv-active', true);
          $elem.find("> .vce-tabs-with-slide-tab-inner > .vce-tabs-with-slide-panel-body").css("height", "");
          activeId = $elem.attr('data-model-id')
        } else if (i > activeTabIndex) {
          $elem.attr('data-vcv-position-to-active', 'after');
        }
      });

      $(tabHeadings).each(function (i, elem) {
        var $elem = $(elem);
        $elem.removeAttr('data-vcv-active');

        if (i === activeTabIndex) {
          $elem.attr('data-vcv-active', true);
        }
      });

      tabsInner.setAttribute('data-vcv-tabs-opened', activeId);
      tabsInner.dispatchEvent(event);
    });
  };

  window.vcv ? window.vcv.on('ready', setActiveTab) : setActiveTab('add');

  $(window).on('hashchange.vce.accordion', hashNavigation);
  $(document).on('click.vce.accordion.data-api', '[data-vce-accordion]', clickHandler);
  $(document).on('ready.vce.accordion', hashNavigation);
  $(document).on('afterShow.vce.accordion', function (e, opt) {
    Plugin.call($(e.target), 'scrollToActive', opt);
  });
})(window.jQuery);