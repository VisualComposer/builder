import $ from 'jquery'
import lodash from 'lodash'

export default class Resizer {
  constructor ($target, settings) {
    if (!$target || !$target.length) {
      throw new Error('Invalid target for Resizer')
    }
    if ($target.data('vcvResizer')) {
      $target.data('vcvResizer').destroy()
    }
    this.settings = lodash.defaults(settings, {
      resizeX: true,
      resizeY: true,
      callback: false,
      resizerTarget: $target,
      resizerClasses: 'vcv-ui-resizer',
      overlayClasses: 'vcv-ui-resizer-overlay',
      resizerAppend: true,
      $resizer: $('<div></div>'),
      $overlay: $('<div></div>')
    })
    this.$target = $target
    this.settings.$resizer.on('mousedown.resizer', this.bindDrag.bind(this))
    this.settings.resizerClasses && this.settings.$resizer.addClass(this.settings.resizerClasses)
    this.settings.resizerAppend && this.settings.$resizer.appendTo(this.settings.resizerTarget)
    this.$target.data('vcvResizer', this)
  }

  destroy () {
    this.stopResize()
    this.settings.$resizer.off('mousedown.resizer')
    this.settings.resizerAppend && this.settings.$resizer.remove()
    this.settings.$overlay.remove()
  }

  bindDrag () {
    this.settings.overlayClasses && this.settings.$overlay.addClass(this.settings.overlayClasses)
    this.settings.$overlay.appendTo('body')
    $(document)
      .on('mousemove.resizer', this.doResize.bind(this))
      .on('mouseup.resizer', this.stopResize.bind(this))
  }

  doResize (e) {
    if (!e || e.which !== 1) {
      this.stopResize()
      return
    }
    let offset = this.$target.offset()
    if (this.settings.resizeY) {
      this.$target.css('height', e.pageY - offset.top + 'px')
    }
    if (this.settings.resizeX) {
      this.$target.css('width', e.pageX - offset.left + 'px')
    }

    e.relatedTarget = this.$target
    e.resizerSettings = this.settings
    this.settings.callback && this.settings.callback(e)
  }

  stopResize () {
    this.settings.$overlay.detach()
    $(document)
      .off('mousemove.resizer')
      .off('mouseup.resizer')
  }
}
