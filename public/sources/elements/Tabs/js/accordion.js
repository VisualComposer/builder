/* =========================================================
 * vc-accordion.js v1.0.0
 * =========================================================
 * Copyright 2013 Wpbakery
 *
 * Visual composer accordion
 * ========================================================= */
(function($) {
  'use strict';

  var Accordion, clickHandler, old, hashNavigation;

  // Accordion plugin definition
  // ==========================
  function Plugin(action, options) {
    var args;

    args = Array.prototype.slice.call(arguments, 1);
    return this.each(function() {
      var $this, data;

      $this = $(this);
      data = $this.data('vc.accordion');
      if (!data) {
        data = new Accordion($this, $.extend(true, {}, options));
        $this.data('vc.accordion', data);
      }
      if ('string' === typeof(action)) {
        data[action].apply(data, args);
      }
    });
  }

  /**
   * Accordion object definition
   * @param $element
   * @constructor
   */
  Accordion = function($element, options) {
    this.$element = $element;
    this.activeClass = 'vc_active';
    this.animatingClass = 'vc_animating';
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
  Accordion.transitionEvent = function() {
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
      if ('undefined' !== typeof(el.style[transition])) {
        return transitions[transition];
      }
    }
  };

  /**
   * Emulate transition end
   * @param $el
   * @param duration
   */
  Accordion.emulateTransitionEnd = function($el, duration) {
    var callback, called;
    called = false;
    if (!duration) {
      duration = 250;
    }

    $el.one(Accordion.transitionName, function() {
      called = true;
    });
    callback = function() {
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
  Accordion.prototype.controller = function(action) {
    var $this;
    $this = this.$element;

    if ('string' !== typeof(action)) {
      action = $this.data('vcAction') || this.getContainer().data('vcAction');
    }
    if ('undefined' === typeof(action)) {
      action = Accordion.DEFAULT_TYPE;
    }

    if ('string' === typeof(action)) {
      Plugin.call($this, action);
    }
  };

  /**
   * Is cache used
   * @returns {boolean}
   */
  Accordion.prototype.isCacheUsed = function() {
    var useCache, that;
    that = this;
    useCache = function() {
      return false !== that.$element.data('vcUseCache');
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
  Accordion.prototype.getSelector = function() {
    var findSelector, $this;

    $this = this.$element;

    findSelector = function() {
      var selector;

      selector = $this.data('vcTarget');
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
  Accordion.prototype.findContainer = function() {
    var $container;
    $container = this.$element.closest(this.$element.data('vcContainer'));
    if (!$container.length) {
      $container = $('body');
    }
    return $container;
  };

  /**
   * Get container
   * @returns {*|Number}
   */
  Accordion.prototype.getContainer = function() {
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
  Accordion.prototype.getTarget = function() {
    var selector, that, getTarget;
    that = this;
    selector = that.getSelector();
    getTarget = function() {
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
  Accordion.prototype.getTargetContent = function() {
    var $target, $targetContent;
    $target = this.getTarget();
    if (!this.isCacheUsed()) {
      if ($target.data('vcContent')) {
        $targetContent = $target.find($target.data('vcContent'));
        if ($targetContent.length) {
          return $targetContent;
        }
      }
      return $target;
    }

    if ('undefined' === typeof(this.$targetContent)) {
      $targetContent = $target;
      if ($target.data('vcContent')) {
        $targetContent = $target.find($target.data('vcContent'));
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
  Accordion.prototype.getTriggers = function() {
    var i;
    i = 0;
    return this.getContainer().find('[data-vc-accordion]').each(function() {
      var accordion, $this;
      $this = $(this);
      accordion = $this.data('vc.accordion');
      if ('undefined' === typeof(accordion)) {
        $this.vcAccordion();
        accordion = $this.data('vc.accordion');
      }
      accordion && accordion.setIndex && accordion.setIndex(i++);
    });
  };

  /**
   * Set the position index in getTriggers
   * @param index
   */
  Accordion.prototype.setIndex = function(index) {
    this.index = index;
  };

  /**
   * Get the position index in getTriggers
   */
  Accordion.prototype.getIndex = function() {
    return this.index;
  };

  /**
   * Trigger event
   * @param event
   */
  Accordion.prototype.triggerEvent = function(event) {
    var $event;
    if ('string' === typeof(event)) {
      $event = $.Event(event);
      this.$element.trigger($event);
    }
  };

  /**
   * Get active triggers
   * @returns {*}
   */
  Accordion.prototype.getActiveTriggers = function() {
    var $triggers;

    $triggers = this.getTriggers().filter(function() {
      var $this, accordion;
      $this = $(this);
      accordion = $this.data('vc.accordion');

      return accordion.getTarget().hasClass(accordion.activeClass);
    });
    return $triggers;
  };

  /**
   * change document location hash
   */
  Accordion.prototype.changeLocationHash = function() {
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
  Accordion.prototype.isActive = function() {

    return this.getTarget().hasClass(this.activeClass);
  };

  /**
   * Get animation duration
   * @returns {*|Number}
   */
  Accordion.prototype.getAnimationDuration = function() {
    var findAnimationDuration, that;
    that = this;

    findAnimationDuration = function() {
      var $targetContent, duration;

      if ('undefined' === typeof(Accordion.transitionName)) {
        return '0s';
      }

      $targetContent = that.getTargetContent();
      duration = $targetContent.css('transition-duration');
      duration = duration.split(',')[0];
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
  Accordion.prototype.getAnimationDurationMilliseconds = function() {
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
  Accordion.prototype.isAnimated = function() {
    return parseFloat(this.getAnimationDuration()) > 0;
  };

  /**
   * Show accordion panel
   */
  Accordion.prototype.show = function() {
    var $target, that, $targetContent;

    that = this;
    $target = that.getTarget();
    $targetContent = that.getTargetContent();

    // if showed no need to do anything
    if (that.isActive()) {
      return;
    }

    if (that.isAnimated()) {
      that.triggerEvent('beforeShow.vc.accordion');
      $target
        .queue(function(next) {
          $targetContent.one(Accordion.transitionName, function() {
            $target.removeClass(that.animatingClass);
            $targetContent.attr('style', '');
            that.triggerEvent('afterShow.vc.accordion');
          });
          Accordion.emulateTransitionEnd($targetContent, that.getAnimationDurationMilliseconds() + 100);
          next();
        })
        .queue(function(next) {
          $targetContent.attr('style', '');
          $targetContent.css({
            position: 'absolute', // Optional if #myDiv is already absolute
            visibility: 'hidden',
            display: 'block'
          });
          var height = $targetContent.height();
          $targetContent.data('vcHeight', height);
          $targetContent.attr('style', '');
          next();
        })
        .queue(function(next) {
          $targetContent.height(0);
          $targetContent.css({
            'padding-top': 0,
            'padding-bottom': 0
          });
          next();
        })
        .queue(function(next) {
          $target.addClass(that.animatingClass);
          $target.addClass(that.activeClass);
          that.changeLocationHash();
          that.triggerEvent('show.vc.accordion');
          next();
        })
        .queue(function(next) {
          var height = $targetContent.data('vcHeight');
          $targetContent.animate({'height': height}, {
            duration: that.getAnimationDurationMilliseconds(),
            complete: function() {
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
        });
    } else {
      $target.addClass(that.activeClass);
      that.triggerEvent('show.vc.accordion');
    }
  };

  /**
   * Hide accordion panel
   */
  Accordion.prototype.hide = function() {
    var $target, that, $targetContent;

    that = this;
    $target = that.getTarget();
    $targetContent = that.getTargetContent();

    // if hidden no need to do anything
    if (!that.isActive()) {
      return;
    }

    if (that.isAnimated()) {
      that.triggerEvent('beforeHide.vc.accordion');
      $target
        .queue(function(next) {
          $targetContent.one(Accordion.transitionName, function() {
            $target.removeClass(that.animatingClass);
            $targetContent.attr('style', '');
            that.triggerEvent('afterHide.vc.accordion');
          });
          Accordion.emulateTransitionEnd($targetContent, that.getAnimationDurationMilliseconds() + 100);
          next();
        })
        .queue(function(next) {
          $target.addClass(that.animatingClass);
          $target.removeClass(that.activeClass);
          that.triggerEvent('hide.vc.accordion');
          next();
        })
        .queue(function(next) {
          var height = $targetContent.height();
          $targetContent.height(height);
          next();
        })
        .queue(function(next) {
          $targetContent.animate({'height': 0}, that.getAnimationDurationMilliseconds());
          $targetContent.css({
            'padding-top': 0,
            'padding-bottom': 0
          });
          next();
        });
    } else {
      $target.removeClass(that.activeClass);
      that.triggerEvent('hide.vc.accordion');
    }
  };

  /**
   * Accordion type: toggle
   */
  Accordion.prototype.toggle = function() {
    var $this;

    $this = this.$element;

    if (this.isActive()) {
      Plugin.call($this, 'hide');
    } else {
      Plugin.call($this, 'show');
    }
  };

  /**
   * Accordion type: dropdown
   */
  Accordion.prototype.dropdown = function() {
    var $this, that;
    that = this;
    $this = this.$element;

    if (this.isActive()) {
      Plugin.call($this, 'hide');
    } else {
      Plugin.call($this, 'show');
      $(document).on('click.vc.accordion.data-api.dropdown', function(e) {
        var isTarget;
        isTarget = $(e.target).closest(that.getTarget()).length;
        if (!isTarget) {
          Plugin.call($this, 'hide');
          $(document).off(e);
        }
      });
    }
  };

  /**
   * Accordion type: collapse
   */
  Accordion.prototype.collapse = function() {
    var $this,
      $triggers;

    $this = this.$element;
    $triggers = this.getActiveTriggers().filter(function() {
      return $this[0] !== this;
    });

    if ($triggers.length) {
      Plugin.call($triggers, 'hide');
    }
    Plugin.call($this, 'show');
  };

  /**
   * Accordion type: collapse all
   */
  Accordion.prototype.collapseAll = function() {
    var $this,
      $triggers;

    $this = this.$element;
    $triggers = this.getActiveTriggers().filter(function() {
      return $this[0] !== this;
    });

    if ($triggers.length) {
      Plugin.call($triggers, 'hide');
    }
    Plugin.call($this, 'toggle');
  };

  Accordion.prototype.showNext = function() {
    var $triggers,
      $activeTriggers,
      activeIndex;

    $triggers = this.getTriggers();
    $activeTriggers = this.getActiveTriggers();
    if ($triggers.length) {
      if ($activeTriggers.length) {
        var lastActiveAccordion;
        lastActiveAccordion = $activeTriggers.eq($activeTriggers.length - 1).vcAccordion().data('vc.accordion');
        if (lastActiveAccordion && lastActiveAccordion.getIndex) {
          activeIndex = lastActiveAccordion.getIndex();
        }
      }
      if (-1 < activeIndex) {
        if (activeIndex + 1 < $triggers.length) {
          Plugin.call($triggers.eq(activeIndex + 1), 'controller');
        } else {
          // we are in the end so next is first
          Plugin.call($triggers.eq(0), 'controller');
        }
      } else {
        // no one is active let's activate first
        Plugin.call($triggers.eq(0), 'controller');
      }
    }
  };

  Accordion.prototype.showPrev = function() {
    var $triggers,
      $activeTriggers,
      activeIndex;

    $triggers = this.getTriggers();
    $activeTriggers = this.getActiveTriggers();
    if ($triggers.length) {
      if ($activeTriggers.length) {
        var lastActiveAccordion;
        lastActiveAccordion = $activeTriggers.eq($activeTriggers.length - 1).vcAccordion().data('vc.accordion');
        if (lastActiveAccordion && lastActiveAccordion.getIndex) {
          activeIndex = lastActiveAccordion.getIndex();
        }
      }
      if (-1 < activeIndex) {
        if (0 <= activeIndex - 1) {
          Plugin.call($triggers.eq(activeIndex - 1), 'controller');
        } else {
          // we are in the end so next is first
          Plugin.call($triggers.eq($triggers.length - 1), 'controller');
        }
      } else {
        // no one is active let's activate first
        Plugin.call($triggers.eq(0), 'controller');
      }
    }
  };

  Accordion.prototype.showAt = function(index) {
    var $triggers;

    $triggers = this.getTriggers();
    if ($triggers.length && index && index < $triggers.length) {
      Plugin.call($triggers.eq(index), 'controller');
    }
  };

  Accordion.prototype.scrollToActive = function() {
    var that, $targetElement, offset, delay, speed;
    that = this;
    offset = 1;
    delay = 300;
    speed = 300;

    $targetElement = $(this.getTarget());
    if ($targetElement.length) {
      if (this.$element.length) {
        setTimeout(function() {
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

  old = $.fn.vcAccordion;

  $.fn.vcAccordion = Plugin;
  $.fn.vcAccordion.Constructor = Accordion;

  // Accordion no conflict
  // ==========================
  $.fn.vcAccordion.noConflict = function() {
    $.fn.vcAccordion = old;
    return this;
  };

  // Accordion data-api
  // =================
  clickHandler = function(e) {
    var $this;
    $this = $(this);
    e.preventDefault();
    Plugin.call($this, 'controller');
  };

  hashNavigation = function() {
    var hash, $targetElement, $accordion, offset, delay, speed;
    offset = 0.2;
    delay = 300;
    speed = 0;

    hash = window.location.hash;
    if (hash) {
      $targetElement = $(hash);
      if ($targetElement.length) {
        $accordion = $targetElement.find('[data-vc-accordion][href=' + hash + '],[data-vc-accordion][data-vc-target=' + hash + ']');
        if ($accordion.length) {
          setTimeout(function() {
            $('html, body').animate({
              scrollTop: $targetElement.offset().top - $(window).height() * offset
            }, speed);
          }, delay);
          $accordion.trigger('click');
        }
      }
    }
  };

  window.addEventListener('hashchange', hashNavigation, false);
  $(document).on('click.vc.accordion.data-api', '[data-vc-accordion]', clickHandler);
  $(document).ready(hashNavigation);
  $(document).on('afterShow.vc.accordion', function(e) {
    Plugin.call($(e.target), 'scrollToActive');
  });
}(window.jQuery));