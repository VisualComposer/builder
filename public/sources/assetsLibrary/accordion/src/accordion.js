/**
 * Create a CustomEvent Polyfill to support IE >= 9 browsers
 * source: https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent
 */
(function () {
  if (typeof window.VcvCustomEvent === 'function') {
    return false
  }

  function CustomEvent (event, params) {
    params = params || Object.assign({},{ bubbles: false, cancelable: false, detail: undefined })
    const evt = document.createEvent('CustomEvent')
    evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail)
    return evt
  }

  CustomEvent.prototype = window.Event.prototype

  window.VcvCustomEvent = CustomEvent
})();

/* =========================================================
 * Visual Composer Accordion plugin
 * ========================================================= */

(function ($) {
  'use strict'

  window.VcvAccordion = function (props) {

    let Accordion, old
    const settings = props
    this.settings = props

    /**
     * Accordion plugin definition
     * @param action {string}
     * @param options {object}
     */
    const Plugin = function (action, options) {
      const args = Array.prototype.slice.call(arguments, 1)
      return this.each(function () {
        const $this = $(this)
        let data = $this.data(settings.accordionContainer)
        if (!data) {
          data = new Accordion($this, $.extend(true, {}, options))
          $this.data(settings.accordionContainer, data)
        }
        if (typeof (action) === 'string') {
          data[ action ].apply(data, args)
        }
      })
    }

    /**
     * Expose plugin function to public
     * @return Plugin
     */
    this.getPlugin = function () {
      return Plugin
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
      let transition
      const el = document.createElement('vcFakeElement')
      const transitions = {
        transition: 'transitionend',
        MSTransition: 'msTransitionEnd',
        MozTransition: 'transitionend',
        WebkitTransition: 'webkitTransitionEnd'
      }

      for (transition in transitions) {
        if (typeof (el.style[ transition ]) !== 'undefined') {
          return transitions[ transition ]
        }
      }
    }

    /**
     * Emulate transition end
     * @param $el
     * @param duration
     */
    Accordion.emulateTransitionEnd = function ($el, duration) {
      let called = false
      let callback
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
     * @param options
     */
    Accordion.prototype.controller = function (options) {
      const $this = this.$element
      let action = options
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
      const that = this
      const useCache = function () {
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
      const $this = this.$element
      const findSelector = function () {
        let selector = $this.data('vceTarget')
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
      let $container = this.$element.closest(this.$element.data('vceContainer'))
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
      const that = this
      const selector = that.getSelector()
      const getTarget = function () {
        let element
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
      let $targetContent
      const $target = this.getTarget()
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
      let i = 0
      const panels = this.getContainer().find(settings.slidePanelsSelector)[ 0 ]

      return $(panels).find(settings.slidePanelHeadingSelector).each(function () {
        const $this = $(this)
        let accordion = $this.data(settings.accordionContainer)
        if (typeof (accordion) === 'undefined') {
          $this[ settings.accordionPropertyName ]()
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
      if (typeof (event) === 'string') {
        const $event = $.Event(event)
        this.$element.trigger($event, opt)
      }
    }

    /**
     * Get active triggers
     * @returns {*}
     */
    Accordion.prototype.getActiveTriggers = function () {
      const $triggers = this.getTriggers().filter(function () {
        const $this = $(this)
        const accordion = $this.data(settings.accordionContainer)

        return accordion.getTarget().attr(accordion.activeAttribute) === 'true'
      })
      return $triggers
    }

    /**
     * change document location hash
     */
    Accordion.prototype.changeLocationHash = function () {
      let id
      const $target = this.getTarget()
      if ($target.length) {
        id = $target.attr('id')
      }
      if (id && !(history.state && history.state.stateId)) {
        history.pushState({ stateId: 'removeHash' }, '', '#' + id)
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
      const that = this
      const findAnimationDuration = function () {
        let $targetContent, duration

        if (typeof (Accordion.transitionName) === 'undefined') {
          return '0s'
        }

        $targetContent = that.getTargetContent()
        duration = $targetContent.css('transition-duration')
        duration = duration.split(',')[ 0 ]
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
      const duration = this.getAnimationDuration()

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
      const that = this
      const $target = that.getTarget()
      const $targetContent = that.getTargetContent().eq(0)
      const $container = that.getContainer()[ 0 ]
      const $elementId = that.$element.attr('href')

      const event = new window.VcvCustomEvent('vcvAccordionAttrChange')
      $container.setAttribute(settings.openedAttribute, $elementId)
      $container.dispatchEvent(event)

      that.triggerEvent(settings.showAccordionSelector, opt)

      // if showed no need to do anything
      if (that.isActive()) {
        return
      }

      // Trigger vcv reInit for nested elements that are hidden and requires initialization
      const innerElements = [].slice.call($targetContent[ 0 ].querySelectorAll('*[id^="el"]'))
      if (innerElements && innerElements.length) {
        innerElements.forEach((el) => {
          const id = el.id.replace('el-', '')
          window.vcv.trigger('reInit', 'reInit', id)
        })
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
            const height = $targetContent.height()
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
            if ((typeof opt === 'object' && Object.prototype.hasOwnProperty.call(opt, 'changeHash') && opt.changeHash) || (typeof opt === 'undefined')) {
              that.changeLocationHash()
            }
            next()
          })
          .queue(function (next) {
            const height = $targetContent.data('vceHeight')
            $targetContent.animate({ height: height }, {
              duration: that.getAnimationDurationMilliseconds(),
              complete: function () {
                if (!$targetContent.data('events')) {
                  $targetContent.attr('style', '')
                  $target.find(settings.tabPanelBodySelector).removeAttr('hidden')
                  $target.find(settings.slidePanelTitleSelector).attr('aria-selected', true)
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
            const previousTabs = $target.prevAll()
            const nextTabs = $target.nextAll()

            previousTabs.each(function (i, elem) {
              const $elem = $(elem)
              $elem.attr(that.positionToActive, 'before')
              $elem.removeAttr(that.activeAttribute)
              $target.find(settings.tabPanelBodySelector).attr('hidden', true)
              $target.find(settings.slidePanelTitleSelector).attr('aria-selected', false)
            })

            nextTabs.each(function (i, elem) {
              const $elem = $(elem)
              $elem.attr(that.positionToActive, 'after')
              $elem.removeAttr(that.activeAttribute)
              $target.find(settings.tabPanelBodySelector).attr('hidden', true)
              $target.find(settings.slidePanelTitleSelector).attr('aria-selected', false)
            })

            next()
          })
      } else {
        $target.attr(that.activeAttribute, true)
        $target.find(settings.tabPanelBodySelector).removeAttr('hidden')
        $target.find(settings.slidePanelTitleSelector).attr('aria-selected', false)
        that.triggerEvent(settings.showAccordionSelector, opt)
      }
    }

    /**
     * Hide accordion panel
     */
    Accordion.prototype.hide = function (opt) {
      const that = this
      const $target = that.getTarget()
      const $targetContent = that.getTargetContent().eq(0)
      let $targetContentHeight = 0

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
            $targetContentHeight = $targetContent.height()
            $target.attr(that.animatingAttribute, true)
            $target.removeAttr(that.activeAttribute)
            $target.find(settings.tabPanelBodySelector).attr('hidden', true)
            $target.find(settings.slidePanelTitleSelector).attr('aria-selected', false)
            that.triggerEvent(settings.hideAccordionSelector, opt)
            next()
          })
          .queue(function (next) {
            $targetContent.height($targetContentHeight)
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
        $target.find(settings.tabPanelBodySelector).attr('hidden', true)
        $target.find(settings.slidePanelTitleSelector).attr('aria-selected', false)
        that.triggerEvent(settings.hideAccordionSelector, opt)
      }
    }

    /**
     * Accordion type: toggle
     */
    Accordion.prototype.toggle = function (opt) {
      const $this = this.$element

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
      const $this = this.$element

      if (this.isActive()) {
        Plugin.call($this, 'hide', opt)
      } else {
        Plugin.call($this, 'show', opt)
        $(document).on(settings.accordionDropdownEventSelector, function (e) {
          Plugin.call($this, 'hide', opt)
          $(document).off(e)
        })
      }
    }

    /**
     * Accordion type: collapse
     */
    Accordion.prototype.collapse = function (opt) {
      const $this = this.$element
      const $triggers = this.getActiveTriggers().filter(function () {
        return $this[ 0 ] !== this
      })
      const mainParent = $this.closest(settings.tabsSelector)
      const isCloseOnClickEnabled = mainParent.attr('data-close-on-click')
      const isCurrentPanel = $this.closest(settings.slidePanelSelector).attr(settings.activeAttribute)

      if ($triggers.length) {
        Plugin.call($triggers, 'hide', opt)
      }

      if (isCloseOnClickEnabled === 'true' && isCurrentPanel === 'true') {
        Plugin.call($this, 'toggle', opt)
      } else if (!isCurrentPanel) {
        Plugin.call($this, 'show', opt)
      }

      if (!isCurrentPanel) {
        // Clear the hash in the site URL (address bar)
        history.replaceState({ stateId: 'removeHash' }, '', window.location.pathname)
      }
    }

    /**
     * Accordion type: collapse all
     */
    Accordion.prototype.collapseAll = function (opt) {
      const $this = this.$element
      const $triggers = this.getActiveTriggers().filter(function () {
        return $this[ 0 ] !== this
      })

      if ($triggers.length) {
        Plugin.call($triggers, 'hide', opt)
      }
      Plugin.call($this, 'toggle', opt)
    }

    Accordion.prototype.showNext = function (opt) {
      let activeIndex

      const $triggers = this.getTriggers()
      const $activeTriggers = this.getActiveTriggers()
      if ($triggers.length) {
        if ($activeTriggers.length) {
          let lastActiveAccordion = $activeTriggers.eq($activeTriggers.length - 1)[ settings.accordionPropertyName ]().data(settings.accordionContainer)
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
      let activeIndex

      const $triggers = this.getTriggers()
      const $activeTriggers = this.getActiveTriggers()
      if ($triggers.length) {
        if ($activeTriggers.length) {
          let lastActiveAccordion
          lastActiveAccordion = $activeTriggers.eq($activeTriggers.length - 1)[ accordionPropertyName ]().data(settings.accordionContainer)
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
      const $triggers = this.getTriggers()
      if ($triggers.length && index && index < $triggers.length) {
        Plugin.call($triggers.eq(index), 'controller', opt)
      }
    }

    Accordion.prototype.scrollToActive = function (opt) {
      if (typeof opt !== 'undefined' && typeof opt.scrollTo !== 'undefined' && !opt.scrollTo) {
        return
      }
      const that = this
      const offset = 1
      const delay = 300
      const speed = 300

      const $targetElement = $(this.getTarget())
      if ($targetElement.length) {
        if (this.$element.length) {
          setTimeout(function () {
            const posY = $targetElement.offset().top - $(window).scrollTop() - that.$element.outerHeight() * offset
            if (posY < 0) {
              $('html, body').animate({
                scrollTop: $targetElement.offset().top - that.$element.outerHeight() * offset
              }, speed)
            }
          }, delay)
        }
      }
    }

    this.setupAccordionProperty = function () {
      old = $.fn[ settings.accordionPropertyName ]

      $.fn[ settings.accordionPropertyName ] = Plugin
      $.fn[ settings.accordionPropertyName ].Constructor = Accordion

      // Accordion no conflict
      // ==========================
      $.fn[ settings.accordionPropertyName ].noConflict = function () {
        $.fn[ settings.accordionPropertyName ] = old
        return this
      }
    }

    // Accordion data-api
    // =================
    this.clickHandler = function (e) {
      const $this = $(this)
      e.preventDefault()
      Plugin.call($this, 'controller')
    }

    this.hashNavigation = function () {
      const offset = 0.2
      const delay = 300
      const speed = 0

      const hash = window.location.hash
      const $targetElement = hash && $(hash)
      const $accordion = $targetElement.length && $targetElement.find(settings.getAccordionHashSelector(hash))

      if ($accordion.length) {
        setTimeout(function () {
          $('html, body').animate({
            scrollTop: $targetElement.offset().top - $(window).height() * offset
          }, speed)
        }, delay)
        $accordion.trigger('click')
        $accordion.closest(settings.tabsSelector).attr('data-vcv-initialized', true).attr('data-vcv-hash-navigated', true)
        setActiveTab('add')
      }
    }

    // Initial set of active tabs and panels
    // Only gets called on 'add' event
    // Sets/removes data attributes on tabs and panels by interating over each one
    this.setActiveTab = function (action, elementId) {
      let $tabs = $(settings.tabsSelector + ':not([data-vcv-hash-navigated])')

      if (action !== undefined && action !== 'add' && action !== 'update') {
        return
      }

      if (action === 'update') {
        const el = $('#el-' + elementId)

        if (el && el.hasClass('vce-global-element')) {
          $tabs = el.find(settings.tabsSelector)
        } else {
          return
        }
      }

      if (action && action === 'add' && elementId) {
        let id = '#el-' + elementId
        $tabs = $(id + settings.tabsSelector)

        if ($tabs.length < 1) {
          id = '#el-' + elementId + '-temp'
          $tabs = $(id + settings.tabsSelector)
        }
      }

      $tabs && $tabs.each(function (index, element) {
        const $element = $(element)
        let activeTabIndex = parseInt($element.attr(settings.activeTabAttribute))
        const accordionPanelContainer = $element.find(settings.slidePanelsSelector)[ 0 ]
        const accordionPanels = $(accordionPanelContainer).find('> ' + settings.slidePanelSelector)
        const tabsInner = $element.find(settings.slideInnerSelector)[ 0 ]
        let activeId = null
        const event = new window.VcvCustomEvent('vcvAccordionAttrChange')
        const tabContainer = settings.tabsAndAccordion && $element.find(settings.tabContainerSelector)[ 0 ]
        const tabHeadings = settings.tabsAndAccordion && $(tabContainer).find('> ' + settings.tabDataSelector)

        activeTabIndex = accordionPanels.length >= activeTabIndex ? activeTabIndex - 1 : 0

        $(accordionPanels).each(function (i, elem) {
          const $elem = $(elem)
          $elem.removeAttr(settings.activeAttribute)
          $elem.find(settings.tabPanelBodySelector).attr('hidden', true)
          $elem.find(settings.slidePanelTitleSelector).attr('aria-selected', false)

          if (i < activeTabIndex) {
            $elem.attr(settings.positionToActive, 'before')
          } else if (i === activeTabIndex) {
            $elem.find(settings.tabPanelBodySelector).removeAttr('hidden')
            $elem.find(settings.slidePanelTitleSelector).attr('aria-selected', true)
            $elem.attr(settings.activeAttribute, true)
            $elem.find(settings.tabPanelBodySelector).get(0).style.height = ''
            activeId = $elem.attr('data-model-id')
          } else if (i > activeTabIndex) {
            $elem.attr(settings.positionToActive, 'after')
          }
        })

        if (tabHeadings) {
          $(tabHeadings).each(function (i, elem) {
            const $elem = $(elem)
            $elem.removeAttr(settings.activeAttribute)
            $elem.find(settings.tabsTitleSelector).attr('aria-selected', false)

            if (i === activeTabIndex) {
              $elem.attr(settings.activeAttribute, true)
              $elem.find(settings.tabsTitleSelector).attr('aria-selected', true)
            }
          })
        }

        tabsInner.setAttribute(settings.openedAttribute, activeId)
        tabsInner.dispatchEvent(event)
      })
    }

    const setActiveTab = this.setActiveTab
  }

  window.VcvAccordion.prototype.init = function () {
    const Plugin = this.getPlugin()
    this.setActiveTab('add')
    this.setupAccordionProperty()
    $(window).on(this.settings.accordionHashChangeEvent, this.hashNavigation)
    $(document).on(this.settings.accordionClickEventSelector, this.settings.accordionDataSelector, this.clickHandler)
    $(document).on(this.settings.accordionReadyEventSelector, this.hashNavigation)
    $(document).on(this.settings.accordionAfterShowEventSelector, function (e, opt) {
      Plugin.call($(e.target), 'scrollToActive', opt)
    })
  }

})(window.jQuery)
