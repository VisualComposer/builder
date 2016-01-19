/* =========================================================
 * vc-tabs.js v1.0.0
 * =========================================================
 * Copyright 2013 Wpbakery
 *
 * Visual composer Tabs
 * ========================================================= */
+ function ( $ ) {
	'use strict';

	var Tabs, old, clickHandler, changeHandler;

	/**
	 * Tabs object definition
	 * @param element
	 * @constructor
	 */
	Tabs = function ( element, options ) {
		this.$element = $( element );
		this.activeClass = 'vc_active';
		this.tabSelector = '[data-vc-tab]';

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
			return false !== that.$element.data( 'vcUseCache' );
		};

		if ( 'undefined' === typeof(this.useCacheFlag) ) {
			this.useCacheFlag = useCache();
		}

		return this.useCacheFlag;
	};

	/**
	 * Get container
	 * @returns {*|Number}
	 */
	Tabs.prototype.getContainer = function () {
		if ( ! this.isCacheUsed() ) {
			return this.findContainer();
		}

		if ( 'undefined' === typeof(this.$container) ) {
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
		$container = this.$element.closest( this.$element.data( 'vcContainer' ) );
		if ( ! $container.length ) {
			$container = $( 'body' );
		}
		return $container;
	};

	/**
	 * Get container accordions
	 * @returns {*}
	 */
	Tabs.prototype.getContainerAccordion = function () {
		return this.getContainer().find( '[data-vc-accordion]' );
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

			selector = $this.data( 'vcTarget' );
			if ( ! selector ) {
				selector = $this.attr( 'href' );
			}

			return selector;
		};

		if ( ! this.isCacheUsed() ) {
			return findSelector();
		}

		if ( 'undefined' === typeof(this.selector) ) {
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

		if ( ! this.isCacheUsed() ) {
			return this.getContainer().find( selector );
		}

		if ( 'undefined' === typeof(this.$target) ) {
			this.$target = this.getContainer().find( selector );
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

			$elements = tab.getContainerAccordion().filter( function () {
				var $that, accordion;
				$that = $( this );

				accordion = $that.data( 'vc.accordion' );

				if ( 'undefined' === typeof(accordion) ) {
					$that.vcAccordion();
					accordion = $that.data( 'vc.accordion' );
				}

				return tab.getSelector() === accordion.getSelector();
			} );

			if ( $elements.length ) {
				return $elements;
			}

			return undefined;
		};
		if ( ! this.isCacheUsed() ) {
			return filterElements();
		}

		if ( 'undefined' === typeof(this.$relatedAccordion) ) {
			this.$relatedAccordion = filterElements();
		}

		return this.$relatedAccordion;
	};

	/**
	 * Trigger event
	 * @param event
	 */
	Tabs.prototype.triggerEvent = function ( event ) {
		var $event;
		if ( 'string' === typeof(event) ) {
			$event = $.Event( event );
			this.$element.trigger( $event );
		}
	};

	/**
	 * Get target tab
	 * @returns {*|Number}
	 */
	Tabs.prototype.getTargetTab = function () {
		var $this;
		$this = this.$element;

		if ( ! this.isCacheUsed() ) {
			return $this.closest( this.tabSelector );
		}

		if ( 'undefined' === typeof(this.$targetTab) ) {
			this.$targetTab = $this.closest( this.tabSelector );
		}

		return this.$targetTab;
	};

	/**
	 * Tab Clicked
	 */
	Tabs.prototype.tabClick = function () {

		this.getRelatedAccordion().trigger( 'click' );
	};

	/**
	 * Tab Show
	 */
	Tabs.prototype.show = function () {
		// if showed no need to do anything
		if ( this.getTargetTab().hasClass( this.activeClass ) ) {
			return;
		}

		this.triggerEvent( 'show.vc.tab' );

		this.getTargetTab().addClass( this.activeClass );
	};

	/**
	 * Tab Hide
	 */
	Tabs.prototype.hide = function () {
		// if showed no need to do anything
		if ( ! this.getTargetTab().hasClass( this.activeClass ) ) {
			return;
		}

		this.triggerEvent( 'hide.vc.tab' );

		this.getTargetTab().removeClass( this.activeClass );
	};

	//Tabs.prototype

	// Tabs plugin definition
	// ==========================
	function Plugin( action, options ) {
		var args;

		args = Array.prototype.slice.call( arguments, 1 );
		return this.each( function () {
			var $this, data;

			$this = $( this );
			data = $this.data( 'vc.tabs' );
			if ( ! data ) {
				data = new Tabs( $this, $.extend( true, {}, options ) );
				$this.data( 'vc.tabs', data );
			}
			if ( 'string' === typeof(action) ) {
				data[ action ].apply( data, args );
			}
		} );
	}

	old = $.fn.vcTabs;

	$.fn.vcTabs = Plugin;
	$.fn.vcTabs.Constructor = Tabs;

	// Tabs no conflict
	// ==========================
	$.fn.vcTabs.noConflict = function () {
		$.fn.vcTabs = old;
		return this;
	};

	// Tabs data-api
	// =================

	clickHandler = function ( e ) {
		var $this;
		$this = $( this );
		e.preventDefault();
		Plugin.call( $this, 'tabClick' );
	};

	changeHandler = function ( e ) {
		var caller;
		caller = $( e.target ).data( 'vc.accordion' );

		if ( 'undefined' === typeof(caller.getRelatedTab) ) {
			/**
			 * Get related tab from accordion
			 * @returns {*}
			 */
			caller.getRelatedTab = function () {
				var findTargets;

				findTargets = function () {
					var $targets;
					$targets = caller.getContainer().find( '[data-vc-tabs]' ).filter( function () {
						var $this, tab;
						$this = $( this );

						tab = $this.data( 'vc.accordion' );
						if ( 'undefined' === typeof(tab) ) {
							$this.vcAccordion();
						}
						tab = $this.data( 'vc.accordion' );

						return tab.getSelector() === caller.getSelector();
					} );

					return $targets;
				};

				if ( ! caller.isCacheUsed() ) {
					return findTargets();
				}

				if ( 'undefined' === typeof(caller.relatedTab) ) {
					caller.relatedTab = findTargets();
				}

				return caller.relatedTab;
			};
		}

		Plugin.call( caller.getRelatedTab(), e.type );
	};

	$( document ).on( 'click.vc.tabs.data-api', '[data-vc-tabs]', clickHandler );
	$( document ).on( 'show.vc.accordion hide.vc.accordion', changeHandler );
}( window.jQuery );
