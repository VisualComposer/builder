// source: https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent
(function () {
  if (typeof window.CustomEvent === 'function') {
    return false
  }

  function CustomEvent (event, params) {
    params = params || { bubbles: false, cancelable: false, detail: undefined }
    var evt = document.createEvent('CustomEvent')
    evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail)
    return evt
  }

  CustomEvent.prototype = window.Event.prototype

  window.CustomEvent = CustomEvent
})();

/* =========================================================
 * Visual Composer Accordion
 * ========================================================= */
(function ($) {
  'use strict'

  var Accordion, clickHandler, old, hashNavigation, setActiveTab, getListWidth, setupAccordionProperty
  var settings = {}

  // Accordion plugin definition
  // ==========================
  function Plugin (action, options) {
    var args

    args = Array.prototype.slice.call(arguments, 1)
    return this.each(function () {
      var $this, data

      $this = $(this)
      data = $this.data(settings.accordionContainer)
      if (!data) {
        data = new Accordion($this, $.extend(true, {}, options))
        $this.data(settings.accordionContainer, data)
      }
      if (typeof (action) === 'string') {
        data[action].apply(data, args)
      }
    })
  }

  /**
   * Accordion object definition
   * @param $element
   * @constructor
   */
  Accordion = function ($element, options) {
    this.$element = $element
    this.activeAttribute = settings.activeAttribute
    this.animatingAttribute = settings.animatingAttribute
    this.positionToActive = settings.positionToActive
    // cached vars
    this.useCacheFlag = undefined
    this.$target = undefined
    this.$targetContent = undefined
    this.selector = undefined
    this.$container = undefined
    this.animationDuration = undefined
    this.index = 0
  }

  /**
   * Get supported transition event
   * @returns {*}
   */
  Accordion.transitionEvent = function () {
    var transition, transitions, el
    el = document.createElement('vcFakeElement')
    transitions = {
      transition: 'transitionend',
      MSTransition: 'msTransitionEnd',
      MozTransition: 'transitionend',
      WebkitTransition: 'webkitTransitionEnd'
    }

    for (transition in
      transitions) {
      if (typeof (el.style[transition]) !== 'undefined') {
        return transitions[transition]
      }
    }
  }

  /**
   * Emulate transition end
   * @param $el
   * @param duration
   */
  Accordion.emulateTransitionEnd = function ($el, duration) {
    var callback, called
    called = false
    if (!duration) {
      duration = 250
    }

    $el.one(Accordion.transitionName, function () {
      called = true
    })
    callback = function () {
      if (!called) {
        $el.trigger(Accordion.transitionName)
      }
    }
    setTimeout(callback, duration)
  }

  Accordion.DEFAULT_TYPE = 'collapse'
  Accordion.transitionName = Accordion.transitionEvent()

  /**
   * Accordion controller
   * @param action
   */
  Accordion.prototype.controller = function (options) {
    var $this
    $this = this.$element
    var action = options
    if (typeof (action) !== 'string') {
      action = $this.data('vceAction') || this.getContainer().data('vceAction')
    }
    if (typeof (action) === 'undefined') {
      action = Accordion.DEFAULT_TYPE
    }

    if (typeof (action) === 'string') {
      Plugin.call($this, action, options)
    }
  }

  /**
   * Is cache used
   * @returns {boolean}
   */
  Accordion.prototype.isCacheUsed = function () {
    var useCache, that
    that = this
    useCache = function () {
      return that.$element.data('vceUseCache') !== false
    }

    if (typeof (this.useCacheFlag) === 'undefined') {
      this.useCacheFlag = useCache()
    }

    return this.useCacheFlag
  }

  /**
   * Get selector
   * @returns {*}
   */
  Accordion.prototype.getSelector = function () {
    var findSelector, $this

    $this = this.$element

    findSelector = function () {
      var selector

      selector = $this.data('vceTarget')
      if (!selector) {
        selector = $this.attr('href')
      }

      return selector
    }

    if (!this.isCacheUsed()) {
      return findSelector()
    }

    if (typeof (this.selector) === 'undefined') {
      this.selector = findSelector()
    }

    return this.selector
  }

  /**
   * Find container
   * @returns {window.jQuery}
   */
  Accordion.prototype.findContainer = function () {
    var $container
    $container = this.$element.closest(this.$element.data('vceContainer'))
    if (!$container.length) {
      $container = $('body')
    }
    return $container
  }

  /**
   * Get container
   * @returns {*|Number}
   */
  Accordion.prototype.getContainer = function () {
    if (!this.isCacheUsed()) {
      return this.findContainer()
    }

    if (typeof (this.$container) === 'undefined') {
      this.$container = this.findContainer()
    }

    return this.$container
  }

  /**
   * Get target
   * @returns {*}
   */
  Accordion.prototype.getTarget = function () {
    var selector, that, getTarget
    that = this
    selector = that.getSelector()
    getTarget = function () {
      var element
      element = that.getContainer().find(selector)
      if (!element.length) {
        element = that.getContainer().filter(selector)
      }
      return element
    }

    if (!this.isCacheUsed()) {
      return getTarget()
    }

    if (typeof (this.$target) === 'undefined') {
      this.$target = getTarget()
    }

    return this.$target
  }

  /**
   * Get target content
   * @returns {*}
   */
  Accordion.prototype.getTargetContent = function () {
    var $target, $targetContent
    $target = this.getTarget()
    if (!this.isCacheUsed()) {
      if ($target.data('vceContent')) {
        $targetContent = $target.find($target.data('vceContent'))
        if ($targetContent.length) {
          return $targetContent
        }
      }
      return $target
    }

    if (typeof (this.$targetContent) === 'undefined') {
      $targetContent = $target
      if ($target.data('vceContent')) {
        $targetContent = $target.find($target.data('vceContent'))
        if (!$targetContent.length) {
          $targetContent = $target
        }
      }
      this.$targetContent = $targetContent
    }

    return this.$targetContent
  }

  /**
   * Get triggers
   * @returns {*}
   */
  Accordion.prototype.getTriggers = function () {
    var i
    i = 0
    var panels = this.getContainer().find(settings.slidePanelsSelector)[0]

    return $(panels).find(settings.slidePanelHeadingSelector).each(function () {
      var accordion, $this
      $this = $(this)
      accordion = $this.data(settings.accordionContainer)
      if (typeof (accordion) === 'undefined') {
        $this[settings.accordionPropertyName]()
        accordion = $this.data(settings.accordionContainer)
      }
      accordion && accordion.setIndex && accordion.setIndex(i++)
    })
  }

  /**
   * Set the position index in getTriggers
   * @param index
   */
  Accordion.prototype.setIndex = function (index) {
    this.index = index
  }

  /**
   * Get the position index in getTriggers
   */
  Accordion.prototype.getIndex = function () {
    return this.index
  }

  /**
   * Trigger event
   * @param event
   */
  Accordion.prototype.triggerEvent = function (event, opt) {
    var $event
    if (typeof (event) === 'string') {
      $event = $.Event(event)
      this.$element.trigger($event, opt)
    }
  }

  /**
   * Get active triggers
   * @returns {*}
   */
  Accordion.prototype.getActiveTriggers = function () {
    var $triggers

    $triggers = this.getTriggers().filter(function () {
      var $this, accordion
      $this = $(this)
      accordion = $this.data(settings.accordionContainer)

      return accordion.getTarget().attr(accordion.activeAttribute) === 'true'
    })
    return $triggers
  }

  /**
   * change document location hash
   */
  Accordion.prototype.changeLocationHash = function () {
    var id, $target
    $target = this.getTarget()
    if ($target.length) {
      id = $target.attr('id')
    }
    if (id) {
      if (history.pushState) {
        history.pushState(null, null, '#' + id)
      } else {
        location.hash = '#' + id
      }
    }
  }

  /**
   * is active
   * @returns {boolean}
   */
  Accordion.prototype.isActive = function () {
    return this.getTarget().attr(this.activeAttribute) === 'true'
  }

  /**
   * Get animation duration
   * @returns {*|Number}
   */
  Accordion.prototype.getAnimationDuration = function () {
    var findAnimationDuration, that
    that = this

    findAnimationDuration = function () {
      var $targetContent, duration

      if (typeof (Accordion.transitionName) === 'undefined') {
        return '0s'
      }

      $targetContent = that.getTargetContent()
      duration = $targetContent.css('transition-duration')
      duration = duration.split(',')[0]
      return duration
    }

    if (!this.isCacheUsed()) {
      return findAnimationDuration()
    }

    if (typeof (this.animationDuration) === 'undefined') {
      this.animationDuration = findAnimationDuration()
    }
    return this.animationDuration
  }

  /**
   * Get animation duration in milliseconds
   * @returns {*|Number}
   */
  Accordion.prototype.getAnimationDurationMilliseconds = function () {
    var duration
    duration = this.getAnimationDuration()

    if (duration.substr(-2) === 'ms') {
      return parseInt(duration)
    }

    if (duration.substr(-1) === 's') {
      return Math.round(parseFloat(duration) * 1000)
    }
  }

  /**
   * Has animation
   * @returns {boolean}
   */
  Accordion.prototype.isAnimated = function () {
    return parseFloat(this.getAnimationDuration()) > 0
  }

  /**
   * Show accordion panel
   */
  Accordion.prototype.show = function (opt) {
    var $target, that, $targetContent, $container, $elementId

    that = this
    $target = that.getTarget()
    $targetContent = that.getTargetContent()
    $container = that.getContainer()[0]
    $elementId = that.$element.attr('href')

    var event = new CustomEvent('attrChange')
    $container.setAttribute('data-vcv-tabs-opened', $elementId)
    $container.dispatchEvent(event)

    that.triggerEvent(settings.showTabSelector, opt)

    // if showed no need to do anything
    if (that.isActive()) {
      return
    }

    if (that.isAnimated()) {
      that.triggerEvent(settings.beforeShowAccordionSelector)
      $target
        .queue(function (next) {
          $targetContent.one(Accordion.transitionName, function () {
            $target.removeAttr(that.animatingAttribute)
            $targetContent.attr('style', '')
            that.triggerEvent(settings.afterShowAccordionSelector, opt)
          })
          Accordion.emulateTransitionEnd($targetContent, that.getAnimationDurationMilliseconds() + 100)
          next()
        })
        .queue(function (next) {
          $targetContent.attr('style', '')
          $targetContent.css({
            visibility: 'hidden',
            display: 'block'
          })
          var height = $targetContent.height()
          $targetContent.data('vceHeight', height)
          $targetContent.attr('style', '')
          next()
        })
        .queue(function (next) {
          $targetContent.height(0)
          $targetContent.css({
            'padding-top': 0,
            'padding-bottom': 0
          })
          next()
        })
        .queue(function (next) {
          $target.attr(that.animatingAttribute, true)
          $target.attr(that.activeAttribute, true)
          $target.removeAttr(that.positionToActive)
          if ((typeof opt === 'object' && opt.hasOwnProperty('changeHash') && opt.changeHash) || (typeof opt === 'undefined')) {
            that.changeLocationHash()
          }
          next()
        })
        .queue(function (next) {
          var height = $targetContent.data('vceHeight')
          $targetContent.animate({ height: height }, {
            duration: that.getAnimationDurationMilliseconds(),
            complete: function () {
              if (!$targetContent.data('events')) {
                $targetContent.attr('style', '')
              }
            }
          })
          $targetContent.css({
            'padding-top': '',
            'padding-bottom': ''
          })
          next()
        })
        .queue(function (next) {
          var previousTabs = $target.prevAll()
          var nextTabs = $target.nextAll()

          previousTabs.each(function (i, elem) {
            var $elem = $(elem)
            $elem.attr(that.positionToActive, 'before')
            $elem.removeAttr(that.activeAttribute)
          })

          nextTabs.each(function (i, elem) {
            var $elem = $(elem)
            $elem.attr(that.positionToActive, 'after')
            $elem.removeAttr(that.activeAttribute)
          })

          next()
        })
    } else {
      $target.attr(that.activeAttribute, true)
      that.triggerEvent(settings.showAccordionSelector, opt)
    }
  }

  /**
   * Hide accordion panel
   */
  Accordion.prototype.hide = function (opt) {
    var $target, that, $targetContent

    that = this
    $target = that.getTarget()
    $targetContent = that.getTargetContent()

    // if hidden no need to do anything
    if (!that.isActive()) {
      return
    }

    if (that.isAnimated()) {
      that.triggerEvent(settings.beforeHideAccordionSelector)
      $target
        .queue(function (next) {
          $targetContent.one(Accordion.transitionName, function () {
            $target.removeAttr(that.animatingAttribute)
            $targetContent.attr('style', '')
            that.triggerEvent(settings.afterHideAccordionSelector, opt)
          })
          Accordion.emulateTransitionEnd($targetContent, that.getAnimationDurationMilliseconds() + 100)
          next()
        })
        .queue(function (next) {
          $target.attr(that.animatingAttribute, true)
          $target.removeAttr(that.activeAttribute)
          that.triggerEvent(settings.hideAccordionSelector, opt)
          next()
        })
        .queue(function (next) {
          var height = $targetContent.height()
          $targetContent.height(height)
          next()
        })
        .queue(function (next) {
          $targetContent.animate({ height: 0 }, that.getAnimationDurationMilliseconds())
          $targetContent.css({
            'padding-top': 0,
            'padding-bottom': 0
          })
          next()
        })
    } else {
      $target.removeAttr(that.activeAttribute)
      that.triggerEvent(settings.hideAccordionSelector, opt)
    }
  }

  /**
   * Accordion type: toggle
   */
  Accordion.prototype.toggle = function (opt) {
    var $this

    $this = this.$element

    if (this.isActive()) {
      Plugin.call($this, 'hide', opt)
    } else {
      Plugin.call($this, 'show', opt)
    }
  }

  /**
   * Accordion type: dropdown
   */
  Accordion.prototype.dropdown = function (opt) {
    var $this
    $this = this.$element

    if (this.isActive()) {
      Plugin.call($this, 'hide', opt)
    } else {
      Plugin.call($this, 'show', opt)
      $(document).on(settings.accordionDropdownEventSelector, function (e) {
        // Fix for https://app.asana.com/0/90442874619636/58756889349011
        // var isTarget;
        // isTarget = $( e.target ).closest( that.getTarget() ).length;
        // if ( ! isTarget ) {
        Plugin.call($this, 'hide', opt)
        $(document).off(e)
        // }
      })
    }
  }

  /**
   * Accordion type: collapse
   */
  Accordion.prototype.collapse = function (opt) {
    var $this,
      $triggers

    $this = this.$element
    $triggers = this.getActiveTriggers().filter(function () {
      return $this[0] !== this
    })

    if ($triggers.length) {
      Plugin.call($triggers, 'hide', opt)
    }
    Plugin.call($this, 'show', opt)
  }

  /**
   * Accordion type: collapse all
   */
  Accordion.prototype.collapseAll = function (opt) {
    var $this,
      $triggers

    $this = this.$element
    $triggers = this.getActiveTriggers().filter(function () {
      return $this[0] !== this
    })

    if ($triggers.length) {
      Plugin.call($triggers, 'hide', opt)
    }
    Plugin.call($this, 'toggle', opt)
  }

  Accordion.prototype.showNext = function (opt) {
    var $triggers,
      $activeTriggers,
      activeIndex

    $triggers = this.getTriggers()
    $activeTriggers = this.getActiveTriggers()
    if ($triggers.length) {
      if ($activeTriggers.length) {
        var lastActiveAccordion
        lastActiveAccordion = $activeTriggers.eq($activeTriggers.length - 1).vceAccordion().data('vce.accordion')
        if (lastActiveAccordion && lastActiveAccordion.getIndex) {
          activeIndex = lastActiveAccordion.getIndex()
        }
      }
      if (activeIndex > -1) {
        if (activeIndex + 1 < $triggers.length) {
          Plugin.call($triggers.eq(activeIndex + 1), 'controller', opt)
        } else {
          // we are in the end so next is first
          Plugin.call($triggers.eq(0), 'controller', opt)
        }
      } else {
        // no one is active let's activate first
        Plugin.call($triggers.eq(0), 'controller', opt)
      }
    }
  }

  Accordion.prototype.showPrev = function (opt) {
    var $triggers,
      $activeTriggers,
      activeIndex

    $triggers = this.getTriggers()
    $activeTriggers = this.getActiveTriggers()
    if ($triggers.length) {
      if ($activeTriggers.length) {
        var lastActiveAccordion
        lastActiveAccordion = $activeTriggers.eq($activeTriggers.length - 1).vceAccordion().data('vce.accordion')
        if (lastActiveAccordion && lastActiveAccordion.getIndex) {
          activeIndex = lastActiveAccordion.getIndex()
        }
      }
      if (activeIndex > -1) {
        if (activeIndex - 1 >= 0) {
          Plugin.call($triggers.eq(activeIndex - 1), 'controller', opt)
        } else {
          // we are in the end so next is first
          Plugin.call($triggers.eq($triggers.length - 1), 'controller', opt)
        }
      } else {
        // no one is active let's activate first
        Plugin.call($triggers.eq(0), 'controller', opt)
      }
    }
  }

  Accordion.prototype.showAt = function (index, opt) {
    var $triggers

    $triggers = this.getTriggers()
    if ($triggers.length && index && index < $triggers.length) {
      Plugin.call($triggers.eq(index), 'controller', opt)
    }
  }

  Accordion.prototype.scrollToActive = function (opt) {
    if (typeof opt !== 'undefined' && typeof opt.scrollTo !== 'undefined' && !opt.scrollTo) {
      return
    }
    var that, $targetElement, offset, delay, speed
    that = this
    offset = 1
    delay = 300
    speed = 300

    $targetElement = $(this.getTarget())
    if ($targetElement.length) {
      if (this.$element.length) {
        setTimeout(function () {
          var posY = $targetElement.offset().top - $(window).scrollTop() - that.$element.outerHeight() * offset
          if (posY < 0) {
            $('html, body').animate({
              scrollTop: $targetElement.offset().top - that.$element.outerHeight() * offset
            }, speed)
          }
        }, delay)
      }
    }
  }

  setupAccordionProperty = function () {
    old = $.fn[settings.accordionPropertyName]

    $.fn[settings.accordionPropertyName] = Plugin
    $.fn[settings.accordionPropertyName].Constructor = Accordion

    // Accordion no conflict
    // ==========================
    $.fn[settings.accordionPropertyName].noConflict = function () {
      $.fn[settings.accordionPropertyName] = old
      return this
    }
  }

  // Accordion data-api
  // =================
  clickHandler = function (e) {
    var $this
    $this = $(this)
    e.preventDefault()
    Plugin.call($this, 'controller')
  }

  hashNavigation = function () {
    var hash, $targetElement, $accordion, offset, delay, speed
    offset = 0.2
    delay = 300
    speed = 0

    hash = window.location.hash
    $targetElement = hash && $(hash)
    $accordion = $targetElement.length && $targetElement.find(settings.getAccordionHashSelector())

    if ($accordion.length) {
      setTimeout(function () {
        $('html, body').animate({
          scrollTop: $targetElement.offset().top - $(window).height() * offset
        }, speed)
      }, delay)
      $accordion.trigger('click')
      $accordion.closest(settings.tabsSelector).attr('data-vcv-initialized', true).attr('data-vcv-hash-navigated', true)
    }
    setActiveTab('add')
  }

  setActiveTab = function (action, elementId) {
    var $tabs = $(settings.tabsSelector + ':not([data-vcv-hash-navigated])')

    if (action !== undefined && action !== 'add' && action !== 'update') {
      return
    }

    if (action === 'update') {
      var el = $('#el-' + elementId)

      if (el && el.hasClass('vce-global-element')) {
        $tabs = el.find(settings.tabsSelector)
      } else {
        return
      }
    }

    if (action && action === 'add' && elementId) {
      var id = '#el-' + elementId
      $tabs = $(id + settings.tabsSelector)

      if ($tabs.length < 1) {
        id = '#el-' + elementId + '-temp'
        $tabs = $(id + settings.tabsSelector)
      }
    }

    $tabs && $tabs.each(function (index, element) {
      var $element = $(element)
      var activeTabIndex = parseInt($element.attr('data-active-tab'))
      var accordionPanelContainer = $element.find(settings.slidePanelsSelector)[0]
      var accordionPanels = $(accordionPanelContainer).find('> ' + settings.slidePanelSelector)
      var tabsInner = $element.find(settings.slideInnerSelector)[0]
      var activeId = null
      var event = new CustomEvent('attrChange')
      var tabContainer = $element.find(settings.tabContainerSelector)[0]
      var tabHeadings = $(tabContainer).find('> ' + settings.tabDataSelector)

      activeTabIndex = accordionPanels.length >= activeTabIndex ? activeTabIndex - 1 : 0

      $(accordionPanels).each(function (i, elem) {
        var $elem = $(elem)
        $elem.removeAttr(settings.activeAttribute)

        if (i < activeTabIndex) {
          $elem.attr(settings.positionToActive, 'before')
        } else if (i === activeTabIndex) {
          $elem.attr(settings.activeAttribute, true)
          $elem.find(settings.tabPanelBodySelector).css('height', '')
          activeId = $elem.attr('data-model-id')
        } else if (i > activeTabIndex) {
          $elem.attr(settings.positionToActive, 'after')
        }
      })

      $(tabHeadings).each(function (i, elem) {
        var $elem = $(elem)
        $elem.removeAttr(settings.activeAttribute)

        if (i === activeTabIndex) {
          $elem.attr(settings.activeAttribute, true)
        }
      })

      tabsInner.setAttribute('data-vcv-tabs-opened', activeId)
      tabsInner.dispatchEvent(event)
    })
  }

  window.vcvAccordionInit = function (options) {
    settings = options
    setActiveTab('add')
    setupAccordionProperty()
    $(window).on(settings.accordionHashChangeEvent, hashNavigation)
    $(document).on(settings.accordionClickEventSelector, settings.accordionDataSelector, clickHandler)
    $(document).on(settings.accordionReadyEventSelector, hashNavigation)
    $(document).on(settings.accordionAfterShowEventSelector, function (e, opt) {
      Plugin.call($(e.target), 'scrollToActive', opt)
    })
  }
})(window.jQuery)
