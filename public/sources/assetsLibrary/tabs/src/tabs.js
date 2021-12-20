/* =========================================================
 * Visual Composer Tabs plugin
 * ========================================================= */

+(function ($) {
  'use strict'
  window.VcvTabs = function (settings) {

    let Tabs, old
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
      let $container = this.$element.closest(this.$element.data('vceContainer'))
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
     * Get target
     * @returns {*}
     */
    Tabs.prototype.getTarget = function () {
      const selector = this.getSelector()

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
      const tab = this
      const filterElements = function () {
        const $elements = tab.getContainerAccordion().filter(function () {
          const $that = $(this)
          let accordion = $that.data(settings.accordionContainer)

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
        const $event = $.Event(event)
        this.$element.trigger($event)
      }
    }

    /**
     * Get target tab
     * @returns {*|Number}
     */
    Tabs.prototype.getTargetTab = function () {
      const $this = this.$element

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
      const target = this.getTargetTab()
      const targetTitle = target.find('[class*="title"]')
      const targetAccordion = this.getRelatedAccordion()
      const targetAccordionTitle = targetAccordion.find('span')
      const tabsVisible = this.getTargetTab().is(':visible')
      const margin = parseInt(targetTitle.css('marginLeft')) || 0
      const left = tabsVisible && target ? target.position().left + margin : this.getTabPosition(target)
      const slider = this.getContainer().find(settings.sliderSelector).first()
      let width

      if (settings.sliderWidth && settings.sliderWidth === 'outer') {
        width = tabsVisible ? targetTitle.outerWidth() : targetAccordionTitle.outerWidth()
      } else {
        width = tabsVisible ? targetTitle.width() : targetAccordionTitle.width()
      }
      slider.css('width', width)
      slider.css('left', left)
    }

    /**
     * Get tab left position from related accordion
     */
    Tabs.prototype.getTabPosition = function (target) {
      const title = target.find('[class*="title"]')
      const tabs = this.getContainer().find(this.tabSelector)
      const accordions = this.getContainerAccordion()
      const activeTabIndex = tabs.index(target)
      let position = parseInt(title.css('marginLeft'))

      for (let i = 0; i < activeTabIndex; i++) {
        const $tab = $(tabs[ i ]).find('[class*="title"]')
        const $accordion = $(accordions[ i ]).find('span')
        const marginLeft = parseInt($tab.css('marginLeft'))
        const marginRight = (i - 1) === activeTabIndex ? 0 : parseInt($tab.css('marginRight'))
        const width = parseInt($accordion.width())
        position += marginLeft + width + marginRight
      }

      return position
    }

    /**
     * Tab Show
     */
    Tabs.prototype.show = function () {
      const targetTab = this.getTargetTab()
      if (settings.isSlider) {
        this.moveSlider()
      }
      // if showed no need to do anything
      if (targetTab.attr(this.activeAttribute) === 'true') {
        return
      }

      this.triggerEvent(settings.showTabSelector)
      targetTab.attr(this.activeAttribute, true)
      targetTab.find(settings.tabsTitleSelector).attr('aria-selected', true)

      if (window.dispatchEvent) {
        window.setTimeout(() => {
          window.dispatchEvent(new Event('resize'))
        },1)
      }
    }

    /**
     * Tab Hide
     */
    Tabs.prototype.hide = function () {
      const targetTab = this.getTargetTab()
      // if showed no need to do anything
      if (!targetTab.attr(this.activeAttribute) || targetTab.attr(this.activeAttribute) === 'false') {
        return
      }

      this.triggerEvent(settings.hideTabSelector)
      targetTab.removeAttr(this.activeAttribute)
      targetTab.find(settings.tabsTitleSelector).attr('aria-selected', false)
    }

    // Tabs.prototype

    // Tabs plugin definition
    // ==========================
    function Plugin (action, options) {
      const args = Array.prototype.slice.call(arguments, 1)
      return this.each(function () {
        const $this = $(this)
        let data = $this.data(settings.tabsDataSelector)
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
      const $this = $(this)
      e.preventDefault()
      Plugin.call($this, 'tabClick')

      if (settings.isDropdown) {
        const element = $this.closest(settings.tabsSelector)[0]
        setDropdownValue(element)
      }
    }

    this.dropdownChangeHandler = function (e) {
      const targetTab  = $('.vce-toggle-container-tab-title[data-vce-target="[data-model-id=' + e.target.value + ']"]')
      targetTab.click()
    }

    this.changeHandler = function (e) {
      const caller = $(e.target).data(settings.accordionContainer)

      if (!caller) {
        return
      }

      if (typeof (caller.getRelatedTab) === 'undefined') {
        /**
         * Get related tab from accordion
         * @returns {*}
         */
        caller.getRelatedTab = function () {
          const findTargets = function () {
            const $targets = caller.getContainer().find(settings.dataAttr).filter(function () {
              const $this = $(this)
              let tab = $this.data(settings.accordionContainer)
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
      let $tabs = $(settings.tabsSelector)

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

        if (!$tabs) {
          id = '#el-' + elementId + '-temp'
          $tabs = $(id + settings.tabsSelector)
        }
      }

      $tabs && $tabs.each(function (index, element) {
        const $element = $(element)
        let activeTabIndex = parseInt($element.attr('data-active-tab'))
        const tabsSlider = settings.isSlider && $element.find(settings.sliderSelector)[ 0 ]
        const tabContainer = $element.find(settings.tabContainerSelector)[ 0 ]
        const tabHeadings = $(tabContainer).find('> ' + settings.tabDataSelector)
        let resizeContainer = element
        let activeElem = null

        activeTabIndex = tabHeadings.length >= activeTabIndex ? activeTabIndex - 1 : 0

        $(tabHeadings).each(function (i, elem) {
          if (i === activeTabIndex) {
            activeElem = $(elem)
          }
        })

        if ($element.find('> ' + settings.resizeSelector).length) {
          resizeContainer = $(element).find('> ' + settings.resizeSelector)[ 0 ]
        }

        const resizeOptions = {
          activeTab: activeElem
        }
        if (settings.isSlider) {
          resizeOptions.tabSlider = $(tabsSlider)
        }
        if (settings.dropdownSelector) {
          setDropdownValue($element)
        }

        addResizeListener(resizeContainer, checkOnResize, resizeOptions)
      })

      if (window.dispatchEvent) {
        window.setTimeout(() => {
          window.dispatchEvent(new Event('resize'))
        },1)
      }
    }

    function getActiveTab (element) {
      let activeTab = null
      const $element = $(element)
      const $tabs = $element.find(settings.tabContainerSelector).eq(0).find('>' + settings.tabDataSelector)

      $tabs && $tabs.each(function (i, tab) {
        const $tab = $(tab)
        if ($tab.attr('data-vcv-active') === 'true') {
          activeTab = $tab
        }
      })
      return activeTab
    }

    function setDropdownValue (element) {
      const activeTab = getActiveTab(element)
      if (activeTab) {
        const activeTabId = activeTab.attr('data-vce-target-model-id')
        if (activeTabId) {
          const dropdown = $(element).find(`${settings.dropdownSelector}`).eq(0)
          dropdown.val(activeTabId)
        }
      }
    }

    function setSliderPosition ($tabs, tabsSlider, activeTab) {
      if (activeTab && activeTab.length) {
        if (activeTab.is(':visible')) {
          const width = parseInt(activeTab.find('[class*="title"]').outerWidth())
          const margin = parseInt(activeTab.find('[class*="title"]').css('marginLeft'))
          const left = activeTab.position().left

          if (width > 0) {
            tabsSlider.css('width', width)
            tabsSlider.css('left', left + margin)
          }
        } else {
          const modelId = activeTab.attr('data-vce-target-model-id')
          const accordion = $tabs.find('[data-model-id="' + modelId + '"]')
          const accordionTitle = accordion.find(settings.slidePanelTitleSelector)
          const width = accordionTitle.find('span').width()
          tabsSlider.css('width', width)
        }
      } else {
        tabsSlider.css('width', 0)
        tabsSlider.css('left', 0)
      }
    }

    // TODO: Refactor to ResizeObserver
    function addResizeListener (element, fn, options) {
      const _this = this
      if ($(element).find('> object').length) {
        return
      }
      const isIE = !!(navigator.userAgent.match(/Trident/) || navigator.userAgent.match(/Edge/))
      if (window.getComputedStyle(element).position === 'static') {
        element.style.position = 'relative'
      }
      const obj = element.__resizeTrigger__ = document.createElement('iframe')
      obj.setAttribute('style', 'display: block; position: absolute; top: 0; left: 0; height: 100%; width: 100%; overflow: hidden; opacity: 0; pointer-events: none; z-index: -1;')
      obj.setAttribute('title', 'Resize helper')
      obj.__resizeElement__ = element
      obj.onload = function () {
        obj.contentDocument.defaultView.addEventListener('resize', fn.bind(_this, element, options))
        fn(element, options)

        if (settings.isSlider) {
          const $element = $(element)
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

    function checkOnResize (element, options) {
      const $element = $(element)
      const $tabsList = $element.find(settings.tabContainerSelector)
      const tabListPadding = parseInt($tabsList.css('padding'))
      const tabContainer = $tabsList.first()
      const $tabs = $(tabContainer).find('> ' + settings.tabDataSelector)
      let totalTabsWidth = 0
      const tabContainerWidth = $element.outerWidth()

      $tabs.each(function (i, tab) {
        totalTabsWidth += $(tab).outerWidth()
      })
      if (settings.isDropdown) {
        totalTabsWidth = totalTabsWidth + tabListPadding * 2
      }

      // if container is bigger, make it tabs
      if (tabContainerWidth > totalTabsWidth) {
        if ($element.attr('data-vcv-tabs-state') !== 'tabs' && settings.isSlider) {
          setSliderPosition($element, options && options.tabSlider, getActiveTab(element))
        }
        $element.attr('data-vcv-tabs-state', 'tabs')
      } else { // make it accordion or dropdown
        const state = settings.isDropdown ? 'dropdown' : 'accordion'
        $element.attr('data-vcv-tabs-state', state)
        if (state === 'dropdown') {
          setDropdownValue(element)
        }
      }
    }
  }

  window.VcvTabs.prototype.init = function () {
    this.setupTabsProperty()
    this.setActiveTab()
    $(document).on(this.settings.clickEventSelector, this.settings.dataAttr, this.clickHandler)
    $(document).on(this.settings.showEventSelector, this.changeHandler)
    if (this.settings.dropdownSelector) {
      $(document).on(this.settings.changeEventSelector, this.settings.dropdownSelector, this.dropdownChangeHandler)
    }
  }

}(window.jQuery))
