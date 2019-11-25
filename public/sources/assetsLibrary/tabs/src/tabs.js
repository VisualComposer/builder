/* =========================================================
 * Visual Composer Tabs plugin
 * ========================================================= */

+(function ($) {
  'use strict'
  window.VcvTabs = function (settings) {

    var Tabs, old
    this.settings = settings

    /**
     * Tabs object definition
     * @param element
     * @constructor
     */
    Tabs = function (element, options) {
      this.$element = $(element)
      this.activeAttribute = settings.activeAttribute
      this.tabSelector = settings.tabDataSelector

      // cached vars
      this.useCacheFlag = undefined
      this.$target = undefined
      this.selector = undefined
      this.$targetTab = undefined
      this.$relatedAccordion = undefined
      this.$container = undefined
    }

    /**
     * Is cache used
     * @returns {boolean}
     */
    Tabs.prototype.isCacheUsed = function () {
      var that = this
      var useCache = function () {
        return that.$element.data('vceUseCache') !== false
      }

      if (typeof (this.useCacheFlag) === 'undefined') {
        this.useCacheFlag = useCache()
      }

      return this.useCacheFlag
    }

    /**
     * Get container
     * @returns {*|Number}
     */
    Tabs.prototype.getContainer = function () {
      if (!this.isCacheUsed()) {
        return this.findContainer()
      }

      if (typeof (this.$container) === 'undefined') {
        this.$container = this.findContainer()
      }

      return this.$container
    }

    /**
     * Find container
     * @returns {window.jQuery}
     */
    Tabs.prototype.findContainer = function () {
      var $container = this.$element.closest(this.$element.data('vceContainer'))
      if (!$container.length) {
        $container = $('body')
      }
      return $container
    }

    /**
     * Get container accordions
     * @returns {*}
     */
    Tabs.prototype.getContainerAccordion = function () {
      return this.getContainer().find(settings.accordionDataSelector)
    }

    /**
     * Get selector
     * @returns {*}
     */
    Tabs.prototype.getSelector = function () {
      var $this = this.$element
      var findSelector = function () {
        var selector = $this.data('vceTarget')
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
     * Get target
     * @returns {*}
     */
    Tabs.prototype.getTarget = function () {
      var selector = this.getSelector()

      if (!this.isCacheUsed()) {
        return this.getContainer().find(selector)
      }

      if (typeof (this.$target) === 'undefined') {
        this.$target = this.getContainer().find(selector)
      }

      return this.$target
    }

    /**
     * Get related accordion
     * @returns {*}
     */
    Tabs.prototype.getRelatedAccordion = function () {
      var tab = this
      var filterElements = function () {
        var $elements = tab.getContainerAccordion().filter(function () {
          var $that = $(this)
          var accordion = $that.data(settings.accordionContainer)

          if (typeof (accordion) === 'undefined') {
            $that[ settings.accordionPropertyName ]()
            accordion = $that.data(settings.accordionContainer)
          }
          return tab.getSelector() === accordion.getSelector()
        })
        if ($elements.length) {
          return $elements
        }

        return undefined
      }
      if (!this.isCacheUsed()) {
        return filterElements()
      }

      if (typeof (this.$relatedAccordion) === 'undefined') {
        this.$relatedAccordion = filterElements()
      }

      return this.$relatedAccordion
    }

    /**
     * Trigger event
     * @param event
     */
    Tabs.prototype.triggerEvent = function (event) {
      if (typeof (event) === 'string') {
        var $event = $.Event(event)
        this.$element.trigger($event)
      }
    }

    /**
     * Get target tab
     * @returns {*|Number}
     */
    Tabs.prototype.getTargetTab = function () {
      var $this = this.$element

      if (!this.isCacheUsed()) {
        return $this.closest(this.tabSelector)
      }

      if (typeof (this.$targetTab) === 'undefined') {
        this.$targetTab = $this.closest(this.tabSelector)
      }

      return this.$targetTab
    }

    /**
     * Tab Clicked
     */
    Tabs.prototype.tabClick = function () {
      this.getRelatedAccordion().trigger('click')
    }

    /**
     * Move tab title slider
     */
    Tabs.prototype.moveSlider = function () {
      var target = this.getTargetTab()
      var targetTitle = target.find('[class*="title"]')
      var targetAccordion = this.getRelatedAccordion()
      var targetAccordionTitle = targetAccordion.find('span')
      var tabsVisible = this.getTargetTab().is(':visible')
      var width = tabsVisible ? targetTitle.width() : targetAccordionTitle.width()
      var margin = parseInt(targetTitle.css('marginLeft')) || 0
      var left = tabsVisible && target ? target.position().left + margin : this.getTabPosition(target)
      var slider = this.getContainer().find(settings.sliderSelector).first()
      slider.css('width', width)
      slider.css('left', left)
    }

    /**
     * Get tab left position from related accordion
     */
    Tabs.prototype.getTabPosition = function (target) {
      var title = target.find('[class*="title"]')
      var tabs = this.getContainer().find(this.tabSelector)
      var accordions = this.getContainerAccordion()
      var activeTabIndex = tabs.index(target)
      var position = parseInt(title.css('marginLeft'))

      for (var i = 0; i < activeTabIndex; i++) {
        var $tab = $(tabs[ i ]).find('[class*="title"]')
        var $accordion = $(accordions[ i ]).find('span')
        var marginLeft = parseInt($tab.css('marginLeft'))
        var marginRight = (i - 1) === activeTabIndex ? 0 : parseInt($tab.css('marginRight'))
        var width = parseInt($accordion.width())
        position += marginLeft + width + marginRight
      }

      return position
    }

    /**
     * Tab Show
     */
    Tabs.prototype.show = function () {
      if (settings.isSlider) {
        this.moveSlider()
      }
      // if showed no need to do anything
      if (this.getTargetTab().attr(this.activeAttribute) === 'true') {
        return
      }

      this.triggerEvent(settings.showTabSelector)
      this.getTargetTab().attr(this.activeAttribute, true)
    }

    /**
     * Tab Hide
     */
    Tabs.prototype.hide = function () {
      // if showed no need to do anything
      if (!this.getTargetTab().attr(this.activeAttribute) || this.getTargetTab().attr(this.activeAttribute) === 'false') {
        return
      }

      this.triggerEvent(settings.hideTabSelector)
      this.getTargetTab().removeAttr(this.activeAttribute)
    }

    // Tabs.prototype

    // Tabs plugin definition
    // ==========================
    function Plugin (action, options) {
      var args = Array.prototype.slice.call(arguments, 1)
      return this.each(function () {
        var $this = $(this)
        var data = $this.data(settings.tabsDataSelector)
        if (!data) {
          data = new Tabs($this, $.extend(true, {}, options))
          $this.data(settings.tabsDataSelector, data)
        }
        if (typeof (action) === 'string') {
          data[ action ].apply(data, args)
        }
      })
    }

    this.setupTabsProperty = function () {
      old = $.fn[ settings.tabsPropertyName ]

      $.fn[ settings.tabsPropertyName ] = Plugin
      $.fn[ settings.tabsPropertyName ].Constructor = Tabs

      // Tabs no conflict
      // ==========================
      $.fn[ settings.tabsPropertyName ].noConflict = function () {
        $.fn[ settings.tabsPropertyName ] = old
        return this
      }
    }

    // Tabs data-api
    // =================

    this.clickHandler = function (e) {
      var $this = $(this)
      e.preventDefault()
      Plugin.call($this, 'tabClick')
    }

    this.changeHandler = function (e) {
      var caller = $(e.target).data(settings.accordionContainer)

      if (typeof (caller.getRelatedTab) === 'undefined') {
        /**
         * Get related tab from accordion
         * @returns {*}
         */
        caller.getRelatedTab = function () {
          var findTargets = function () {
            var $targets = caller.getContainer().find(settings.dataAttr).filter(function () {
              var $this = $(this)
              var tab = $this.data(settings.accordionContainer)
              if (typeof (tab) === 'undefined') {
                $this[ settings.accordionPropertyName ]()
              }
              tab = $this.data(settings.accordionContainer)

              return tab.getSelector() === caller.getSelector()
            })

            return $targets
          }

          if (!caller.isCacheUsed()) {
            return findTargets()
          }

          if (typeof (caller.relatedTab) === 'undefined') {
            caller.relatedTab = findTargets()
          }

          return caller.relatedTab
        }
      }

      Plugin.call(caller.getRelatedTab(), e.type)
    }

    this.setActiveTab = function (action, elementId) {
      var $tabs = $(settings.tabsSelector)

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

        if (!$tabs) {
          id = '#el-' + elementId + '-temp'
          $tabs = $(id + settings.tabsSelector)
        }
      }

      $tabs && $tabs.each(function (index, element) {
        var $element = $(element)
        var activeTabIndex = parseInt($element.attr('data-active-tab'))
        var tabsSlider = settings.isSlider && $element.find(settings.sliderSelector)[ 0 ]
        var tabContainer = $element.find(settings.tabContainerSelector)[ 0 ]
        var tabHeadings = $(tabContainer).find('> ' + settings.tabDataSelector)
        var resizeContainer = element
        var activeElem = null

        activeTabIndex = tabHeadings.length >= activeTabIndex ? activeTabIndex - 1 : 0

        $(tabHeadings).each(function (i, elem) {
          if (i === activeTabIndex) {
            activeElem = $(elem)
          }
        })

        if ($(element).find('> ' + settings.resizeSelector).length) {
          resizeContainer = $(element).find('> ' + settings.resizeSelector)[ 0 ]
        }

        var resizeOptions = {
          activeTab: activeElem
        }
        if (settings.isSlider) {
          resizeOptions.tabSlider = $(tabsSlider)
        }

        addResizeListener(resizeContainer, checkOnResize, resizeOptions)
      })
    }

    function setSliderPosition ($tabs, tabsSlider, activeTab) {
      if (activeTab && activeTab.length) {
        if (activeTab.is(':visible')) {
          var width = parseInt(activeTab.find('[class*="title"]').width())
          var margin = parseInt(activeTab.find('[class*="title"]').css('marginLeft'))
          var left = activeTab.position().left

          if (width > 0) {
            tabsSlider.css('width', width)
            tabsSlider.css('left', left + margin)
          }
        } else {
          var modelId = activeTab.attr('data-vce-target-model-id')
          var accordion = $tabs.find('[data-model-id="' + modelId + '"]')
          var accordionTitle = accordion.find(settings.slidePanelTitleSelector)
          var width = accordionTitle.find('span').width()
          tabsSlider.css('width', width)
        }
      } else {
        tabsSlider.css('width', 0)
        tabsSlider.css('left', 0)
      }
    }

    function addResizeListener (element, fn, options) {
      var _this = this
      if ($(element).find('> object').length) {
        return
      }
      var isIE = !!(navigator.userAgent.match(/Trident/) || navigator.userAgent.match(/Edge/))
      if (window.getComputedStyle(element).position === 'static') {
        element.style.position = 'relative'
      }
      var obj = element.__resizeTrigger__ = document.createElement('object')
      obj.setAttribute('style', 'display: block; position: absolute; top: 0; left: 0; height: 100%; width: 100%; overflow: hidden; opacity: 0; pointer-events: none; z-index: -1;')
      obj.__resizeElement__ = element
      obj.onload = function () {
        obj.contentDocument.defaultView.addEventListener('resize', fn.bind(_this, element))
        fn(element)

        if (settings.isSlider) {
          var $element = $(element)
          if (!$element.attr('data-vcv-initialized')) {
            setSliderPosition($element, options && options.tabSlider, options && options.activeTab)
          }
        }
        $(element).attr('data-vcv-initialized', true)
      }
      obj.type = 'text/html'
      if (isIE) {
        element.appendChild(obj)
      }
      obj.data = 'about:blank'
      if (!isIE) {
        element.appendChild(obj)
      }
    }

    function checkOnResize (element) {
      var $element = $(element)
      var tabContainer = $element.find(settings.tabContainerSelector).first()
      var $tabs = $(tabContainer).find('> ' + settings.tabDataSelector)
      var totalTabsWidth = 0
      var tabContainerWidth = $element.outerWidth()

      $tabs.each(function (i, tab) {
        totalTabsWidth += $(tab).outerWidth()
      })

      // if container is bigger, make it tabs
      if (tabContainerWidth > totalTabsWidth) {
        $element.attr('data-vcv-tabs-state', 'tabs')
      } else { // make it accordion
        $element.attr('data-vcv-tabs-state', 'accordion')
      }
    }
  }

  window.VcvTabs.prototype.init = function () {
    this.setupTabsProperty()
    this.setActiveTab()
    $(document).on(this.settings.clickEventSelector, this.settings.dataAttr, this.clickHandler)
    $(document).on(this.settings.showEventSelector, this.changeHandler)
  }

}(window.jQuery))
