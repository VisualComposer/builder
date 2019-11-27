/* =========================================================
 * Visual Composer tabs, accordion auto play plugin
 * ========================================================= */

+(function ($) {
  'use strict'

  window.VcvAccordionAutoplay = function (props) {
    let Plugin, TtaAutoPlay, old
    const settings = props

    Plugin = function (action, options) {
      const args = Array.prototype.slice.call(arguments, 1)
      return this.each(function () {
        const $this = $(this)
        let data = $this.data(settings.autoplayDataSelector)

        if ($this.data('vcv-autoplay-on-editor-disabled')) {
          return
        }

        if (!data) {
          data = new TtaAutoPlay($this,
            $.extend(true, {}, TtaAutoPlay.DEFAULTS, $this.data('vce-tta-autoplay'), options))
          $this.data(settings.autoplayDataSelector, data)
        }
        if (typeof (action) === 'string') {
          data[ action ].apply(data, args)
        } else {
          data.start(args) // start the auto play by default
        }
      })
    }

    /**
     * AutoPlay constuctor
     * @param $element
     * @param options
     * @constructor
     */
    TtaAutoPlay = function ($element, options) {
      this.$element = $element
      this.options = options
    }

    TtaAutoPlay.DEFAULTS = {
      delay: 5000,
      pauseOnHover: true,
      stopOnClick: true
    }

    /**
     * Method called on timeout hook call
     */
    TtaAutoPlay.prototype.show = function () {
      this.$element.find(settings.accordionDataSelector + ':eq(0)')[ settings.accordionPropertyName ]('showNext', { changeHash: false, scrollTo: false })
    }

    /**
     * Check is container has set window.setInterval
     *
     * @returns {boolean}
     */
    TtaAutoPlay.prototype.hasTimer = function () {
      return undefined !== this.$element.data(settings.autoplayTimerSelector)
    }

    /**
     * Set for container window.setInterval and save it in data-attribute
     *
     * @param windowInterval
     */
    TtaAutoPlay.prototype.setTimer = function (windowInterval) {
      this.$element.data(settings.autoplayTimerSelector, windowInterval)
    }

    /**
     * Get containers timer from data-attributes
     *
     * @returns {*|Number}
     */
    TtaAutoPlay.prototype.getTimer = function () {
      return this.$element.data(settings.autoplayTimerSelector)
    }

    /**
     * Removes from container data-attributes timer
     */
    TtaAutoPlay.prototype.deleteTimer = function () {
      this.$element.removeData(settings.autoplayTimerSelector)
    }

    /**
     * Starts the autoplay timer with multiple call preventions
     */
    TtaAutoPlay.prototype.start = function () {
      const $this = this.$element
      const that = this

      /**
       * Local method called when accordion title being clicked
       * Used to stop autoplay
       *
       * @param e {jQuery.Event}
       */
      function stopHandler (e) {
        e.preventDefault && e.preventDefault()

        if (that.hasTimer()) {
          Plugin.call($this, 'stop')
        }
      }

      /**
       * Local method called when mouse hovers a [data-vce-tta-autoplay] element( this.$element )
       * Used to pause/resume autoplay
       *
       * @param e {jQuery.Event}
       */
      function hoverHandler (e) {
        e.preventDefault && e.preventDefault()

        if (that.hasTimer()) {
          Plugin.call($this, e.type === 'mouseleave' ? 'resume' : 'pause')
        }
      }

      if (!this.hasTimer()) {
        this.setTimer(window.setInterval(this.show.bind(this), this.options.delay))

        // On switching tab by click it stop/clears the timer
        this.options.stopOnClick && $this.on(settings.autoplayOnEventSelector,
          settings.accordionDataSelector,
          stopHandler)

        // On hover it pauses/resumes the timer
        this.options.pauseOnHover && $this.hover(hoverHandler)
      }
    }

    /**
     * Resumes the paused autoplay timer
     */
    TtaAutoPlay.prototype.resume = function () {
      if (this.hasTimer()) {
        this.setTimer(window.setInterval(this.show.bind(this), this.options.delay))
      }
    }

    /**
     * Stop the autoplay timer
     */
    TtaAutoPlay.prototype.stop = function () {
      this.pause()
      this.deleteTimer()
      // Remove bind events in TtaAutoPlay.prototype.start method
      this.$element.off(settings.autoplayOnEventSelector + ' mouseenter mouseleave')
    }

    /**
     * Pause the autoplay timer
     */
    TtaAutoPlay.prototype.pause = function () {
      const timer = this.getTimer()
      if (undefined !== timer) {
        window.clearInterval(timer)
      }
    }

    this.setupAutoplayProperty = function () {
      old = $.fn[ settings.autoplayPropertyName ]
      $.fn[ settings.autoplayPropertyName ] = Plugin
      $.fn[ settings.autoplayPropertyName ].Constructor = TtaAutoPlay

      $.fn[ settings.autoplayPropertyName ].noConflict = function () {
        $.fn[ settings.autoplayPropertyName ] = old
        return this
      }
    }

    /**
     * Find all autoplay elements and start the timer
     */
    this.startAutoPlay = function () {
      $(settings.autoplaySelector).each(function () {
        $(this)[ settings.autoplayPropertyName ]()
      })
    }
  }

  window.VcvAccordionAutoplay.prototype.init = function () {
    this.setupAutoplayProperty()
    this.startAutoPlay()
  }
}(window.jQuery))
