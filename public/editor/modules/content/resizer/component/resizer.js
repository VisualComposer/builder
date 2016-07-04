import React from 'react'
import $ from 'jquery'
import lodash from 'lodash'
import '../css/module.less'

class Resizer extends React.Component {
  constructor (data) {
    super()

    this.state = {
      resizerOptions: lodash.defaults(data.params, {
        resizeX: true,
        resizeY: true,
        callback: false,
        resizerTarget: '',
        resizerTargetX: '',
        resizerTargetY: '',
        resizerClasses: 'vcv-ui-resizer',
        overlayClasses: 'vcv-ui-resizer-overlay',
        $overlay: $('<div></div>')
      })
    }
  }

  componentDidMount () {
    $(this.refs.resizer).on('mousedown.vcv-resizer', this.bindDrag.bind(this))
    this.$target = this.state.resizerOptions.resizerTarget ? $(this.state.resizerOptions.resizerTarget) : false
    this.$targetX = this.state.resizerOptions.resizerTargetX ? $(this.state.resizerOptions.resizerTargetX) : false
    this.$targetY = this.state.resizerOptions.resizerTargetY ? $(this.state.resizerOptions.resizerTargetY) : false
  }

  componentWillUnmount () {
    this.stopResize()
    $(this.refs.resizer).off('mousedown.vcv-resizer')
    this.state.resizerOptions.remove()
  }

  bindDrag () {
    this.state.resizerOptions.overlayClasses && this.state.resizerOptions.$overlay.addClass(this.state.resizerOptions.overlayClasses)
    this.state.resizerOptions.$overlay.appendTo('body')
    $(document)
      .on('mousemove.vcv-resizer', this.doResize.bind(this))
      .on('mouseup.vcv-resizer', this.stopResize.bind(this))
  }

  doResize (e) {
    if (!e || e.which !== 1) {
      this.stopResize()
      return
    }
    //    let offset; // this.$targetX.offset()
    let offset, $target
    if (this.$target) {
      $target = this.$target
      offset = this.$target.offset()
    }
    if (this.state.resizerOptions.resizeY) {
      if (this.$targetY) {
        $target = this.$targetY
        offset = this.$targetY.offset()
      }

      if (offset) {
        $target.css('height', e.pageY - offset.top + 'px')
      }
    }
    if (this.state.resizerOptions.resizeX) {
      if (this.$targetX) {
        $target = this.$targetX
        offset = this.$targetX.offset()
      }

      if (offset) {
        $target.css('width', e.pageX - offset.left + 'px')
      }
    }

    e.relatedTarget = $target
    e.resizerSettings = this.state.resizerOptions
    this.state.resizerOptions.callback && this.state.resizerOptions.callback(e)
  }

  stopResize () {
    this.state.resizerOptions.$overlay.detach()
    $(document)
      .off('mousemove.vcv-resizer')
      .off('mouseup.vcv-resizer')
  }

  render () {
    return <div ref='resizer' className={this.state.resizerOptions.resizerClasses}></div>
  }
}

module.exports = Resizer
