/* =========================================================
 * vce-tabs.js v1.0.0
 * =========================================================
 * Copyright 2013 Wpbakery
 *
 * Visual composer Tabs
 * ========================================================= */
+function ($) {
  'use strict';

  var Tabs, old, clickHandler, changeHandler;

  /**
   * Tabs object definition
   * @param element
   * @constructor
   */
  Tabs = function (element, options) {
    this.$element = $(element);
    this.activeAttribute = 'data-vcv-active';
    this.tabSelector = '[data-vce-tab]';

    // cached vars
    this.useCacheFlag = undefined;
    this.$target = undefined;
    this.selector = undefined;
    this.$targetTab = undefined;
    this.$relatedAccordion = undefined;
    this.$container = undefined;
  };

  /**
   * Is cache used
   * @returns {boolean}
   */
  Tabs.prototype.isCacheUsed = function () {
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
   * Get container
   * @returns {*|Number}
   */
  Tabs.prototype.getContainer = function () {
    if (!this.isCacheUsed()) {
      return this.findContainer();
    }

    if ('undefined' === typeof(this.$container)) {
      this.$container = this.findContainer();
    }

    return this.$container;
  };

  /**
   * Find container
   * @returns {window.jQuery}
   */
  Tabs.prototype.findContainer = function () {
    var $container;
    $container = this.$element.closest(this.$element.data('vceContainer'));
    if (!$container.length) {
      $container = $('body');
    }
    return $container;
  };

  /**
   * Get container accordions
   * @returns {*}
   */
  Tabs.prototype.getContainerAccordion = function () {
    return this.getContainer().find('[data-vce-accordion]');
  };

  /**
   * Get selector
   * @returns {*}
   */
  Tabs.prototype.getSelector = function () {
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
   * Get target
   * @returns {*}
   */
  Tabs.prototype.getTarget = function () {
    var selector;
    selector = this.getSelector();

    if (!this.isCacheUsed()) {
      return this.getContainer().find(selector);
    }

    if ('undefined' === typeof(this.$target)) {
      this.$target = this.getContainer().find(selector);
    }

    return this.$target;
  };

  /**
   * Get related accordion
   * @returns {*}
   */
  Tabs.prototype.getRelatedAccordion = function () {
    var tab, filterElements;

    tab = this;

    filterElements = function () {
      var $elements;
      $elements = tab.getContainerAccordion().filter(function () {
        var $that, accordion;
        $that = $(this);

        accordion = $that.data('vce.accordion');

        if ('undefined' === typeof(accordion)) {
          $that.vceAccordion();
          accordion = $that.data('vce.accordion');
        }
        return tab.getSelector() === accordion.getSelector();
      });
      if ($elements.length) {
        return $elements;
      }

      return undefined;
    };
    if (!this.isCacheUsed()) {
      return filterElements();
    }

    if ('undefined' === typeof(this.$relatedAccordion)) {
      this.$relatedAccordion = filterElements();
    }

    return this.$relatedAccordion;
  };

  /**
   * Trigger event
   * @param event
   */
  Tabs.prototype.triggerEvent = function (event) {
    var $event;
    if ('string' === typeof(event)) {
      $event = $.Event(event);
      this.$element.trigger($event);
    }
  };

  /**
   * Get target tab
   * @returns {*|Number}
   */
  Tabs.prototype.getTargetTab = function () {
    var $this;
    $this = this.$element;

    if (!this.isCacheUsed()) {
      return $this.closest(this.tabSelector);
    }

    if ('undefined' === typeof(this.$targetTab)) {
      this.$targetTab = $this.closest(this.tabSelector);
    }

    return this.$targetTab;
  };

  /**
   * Tab Clicked
   */
  Tabs.prototype.tabClick = function () {
    this.getRelatedAccordion().trigger('click')
  };

  /**
   * Move tab title slider
   */
  Tabs.prototype.moveSlider = function () {
    var target = this.getTargetTab();
    var targetTitle = target.find('[class*="title"]');
    var targetAccordion = this.getRelatedAccordion();
    var targetAccordionTitle = targetAccordion.find('span');
    var tabsVisible = this.getTargetTab().is(':visible');
    var width = tabsVisible ? targetTitle.width() : targetAccordionTitle.width();
    var margin = parseInt(targetTitle.css('marginLeft')) || 0;
    var left = tabsVisible && target ? target.position().left + margin : this.getTabPosition(target);
    var slider = this.getContainer().find('.vce-tabs-with-slide-slider').first();
    slider.css('width', width);
    slider.css('left', left);
  };

  /**
   * Get tab left position from related accordion
   */
  Tabs.prototype.getTabPosition = function (target) {
    var title = target.find('[class*="title"]');
    var tabs = this.getContainer().find(this.tabSelector);
    var accordions = this.getContainerAccordion();
    var activeTabIndex = tabs.index(target);
    var position = parseInt(title.css('marginLeft'));

    for (var i = 0; i < activeTabIndex; i++) {
      var $tab = $(tabs[i]).find('[class*="title"]');
      var $accordion = $(accordions[i]).find('span');
      var marginLeft = parseInt($tab.css('marginLeft'));
      var marginRight = (i - 1) === activeTabIndex ? 0 : parseInt($tab.css('marginRight'));
      var width = parseInt($accordion.width());
      position += marginLeft + width + marginRight;
    }

    return position;
  };

  /**
   * Tab Show
   */
  Tabs.prototype.show = function () {
    this.moveSlider();
    // if showed no need to do anything
    // if (this.getTargetTab().hasClass(this.activeClass)) {
    if (this.getTargetTab().attr(this.activeAttribute) === 'true') {
      return;
    }

    this.triggerEvent('show.vce.tab');
    this.getTargetTab().attr(this.activeAttribute, true);
  };

  /**
   * Tab Hide
   */
  Tabs.prototype.hide = function () {
    // if showed no need to do anything
    // if (!this.getTargetTab().hasClass(this.activeClass)) {
    if (!this.getTargetTab().attr(this.activeAttribute) || this.getTargetTab().attr(this.activeAttribute) === 'false') {
      return;
    }

    this.triggerEvent('hide.vce.tab');
    this.getTargetTab().removeAttr(this.activeAttribute);
  };

  //Tabs.prototype

  // Tabs plugin definition
  // ==========================
  function Plugin (action, options) {
    var args;

    args = Array.prototype.slice.call(arguments, 1);
    return this.each(function () {
      var $this, data;

      $this = $(this);
      data = $this.data('vce.tabs');
      if (!data) {
        data = new Tabs($this, $.extend(true, {}, options));
        $this.data('vce.tabs', data)
      }
      if ('string' === typeof(action)) {
        data[action].apply(data, args)
      }
    })
  }

  old = $.fn.vceTabs;

  $.fn.vceTabs = Plugin;
  $.fn.vceTabs.Constructor = Tabs;

  // Tabs no conflict
  // ==========================
  $.fn.vceTabs.noConflict = function () {
    $.fn.vceTabs = old
    return this
  };

  // Tabs data-api
  // =================

  clickHandler = function (e) {
    var $this
    $this = $(this)
    e.preventDefault()
    Plugin.call($this, 'tabClick')
  };

  changeHandler = function (e) {
    var caller
    caller = $(e.target).data('vce.accordion')

    if ('undefined' === typeof(caller.getRelatedTab)) {
      /**
       * Get related tab from accordion
       * @returns {*}
       */
      caller.getRelatedTab = function () {
        var findTargets

        findTargets = function () {
          var $targets
          $targets = caller.getContainer().find('[data-vce-tabs]').filter(function () {
            var $this, tab
            $this = $(this)

            tab = $this.data('vce.accordion')
            if ('undefined' === typeof(tab)) {
              $this.vceAccordion()
            }
            tab = $this.data('vce.accordion')

            return tab.getSelector() === caller.getSelector()
          })

          return $targets
        }

        if (!caller.isCacheUsed()) {
          return findTargets()
        }

        if ('undefined' === typeof(caller.relatedTab)) {
          caller.relatedTab = findTargets()
        }

        return caller.relatedTab
      }
    }

    Plugin.call(caller.getRelatedTab(), e.type)
  };

  function setActiveTab (action, elementId) {
    var $tabs = $('.vce-tabs-with-slide');

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

      if (!$tabs) {
        id = '#el-' + elementId + '-temp';
        $tabs = $(id + '.vce-tabs-with-slide');
      }
    }

    $tabs && $tabs.each(function (index, element) {
      var $element = $(element);
      var activeTabIndex = parseInt($element.attr('data-active-tab'));
      var tabsSlider = $element.find('.vce-tabs-with-slide-slider')[0];
      var tabContainer = $element.find('.vce-tabs-with-slide-list')[0];
      var tabHeadings = $(tabContainer).find('> [data-vce-tab]');
      var resizeContainer = element;
      var activeElem = null

      activeTabIndex = tabHeadings.length >= activeTabIndex ? activeTabIndex - 1 : 0;

      $(tabHeadings).each(function (i, elem) {
        if (i === activeTabIndex) {
          activeElem =  $(elem)
        }
      });

      if ($(element).find('> .vce-tabs-with-slide-resize-helper').length) {
        resizeContainer = $(element).find('> .vce-tabs-with-slide-resize-helper')[0]
      }

      addResizeListener(resizeContainer, checkOnResize, { tabSlider: $(tabsSlider), activeTab: activeElem });
    })
  }

  function setSliderPosition ($tabs, tabsSlider, activeTab) {
    if (activeTab && activeTab.length) {
      if (activeTab.is(':visible')) {
        var width = parseInt(activeTab.find('[class*="title"]').width());
        var margin = parseInt(activeTab.find('[class*="title"]').css('marginLeft'));
        var left = activeTab.position().left;

        if (width > 0) {
          tabsSlider.css('width', width);
          tabsSlider.css('left', left + margin);
        }
      } else {
        var modelId = activeTab.attr('data-vce-target-model-id');
        var accordion = $tabs.find('[data-model-id="' + modelId + '"]');
        var accordionTitle = accordion.find('.vce-tabs-with-slide-panel-title');
        var width = accordionTitle.find('span').width();
        tabsSlider.css('width', width);
      }
    } else {
      tabsSlider.css('width', 0);
      tabsSlider.css('left', 0);
    }
  }

  function addResizeListener (element, fn, options) {
    var _this = this
    if ($(element).find('> object').length) {
      return;
    }
    var isIE = !!(navigator.userAgent.match(/Trident/) || navigator.userAgent.match(/Edge/));
    if (window.getComputedStyle(element).position === 'static') {
      element.style.position = 'relative';
    }
    var obj = element.__resizeTrigger__ = document.createElement('object');
    obj.setAttribute('style', 'display: block; position: absolute; top: 0; left: 0; height: 100%; width: 100%; overflow: hidden; opacity: 0; pointer-events: none; z-index: -1;');
    obj.__resizeElement__ = element;
    obj.onload = function () {
      obj.contentDocument.defaultView.addEventListener('resize', fn.bind(_this, element));
      fn(element);

      var $element = $(element);
      if (!$element.attr('data-vcv-initialized')) {
        setSliderPosition($element, options && options.tabSlider, options && options.activeTab);
      }
      $(element).attr('data-vcv-initialized', true);
    };
    obj.type = 'text/html';
    if (isIE) {
      element.appendChild(obj);
    }
    obj.data = 'about:blank';
    if (!isIE) {
      element.appendChild(obj);
    }
  }

  function checkOnResize (element) {
    var $element = $(element);
    var tabContainer = $element.find('.vce-tabs-with-slide-list').first();
    var $tabs = $(tabContainer).find('> [data-vce-tab]');
    var totalTabsWidth = 0;
    var tabContainerWidth = $element.width();

    $tabs.each(function (i, tab) {
      totalTabsWidth += $(tab).width();
    });

    // if container is bigger, make it tabs
    if (tabContainerWidth > totalTabsWidth) {
      $element.attr('data-vcv-tabs-state', 'tabs')
    } else { // make it accordion
      $element.attr('data-vcv-tabs-state', 'accordion')
    }
  }

  window.vcv ? window.vcv.on('ready', setActiveTab) : setActiveTab();
  $(document).on('click.vce.tabs.data-api', '[data-vce-tabs]', clickHandler);
  $(document).on('show.vce.accordion hide.vce.accordion', changeHandler);
}(window.jQuery);
