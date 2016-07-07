import React from 'react'
import $ from 'jquery'
import lodash from 'lodash'
import '../css/module.less'

class Resizer extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      resizerOptions: lodash.defaults(props.params, {
        resizeTop: false,
        resizeBottom: false,
        resizeLeft: false,
        resizeRight: false,
        callback: false,
        resizerTarget: '',
        resizerTargetTop: '',
        resizerTargetBottom: '',
        resizerTargetLeft: '',
        resizerTargetRight: '',
        resizerClasses: 'vcv-ui-resizer',
        overlayClasses: 'vcv-ui-resizer-overlay',
        $overlay: $('<div></div>')
      })
    }
  }

  componentDidMount () {
    $(this.refs.resizer)
      .on('mousedown.vcv-resizer', this.bindDrag.bind(this))
      .on('touchstart.vcv-resizer', this.bindDrag.bind(this))
      .on('dragstart.vcv-resizer', function (e) {
        e && e.preventDefault && e.preventDefault()
        return false
      })

    let $target = this.state.resizerOptions.resizerTarget ? $(this.state.resizerOptions.resizerTarget) : false
    this.$targetTop = this.state.resizerOptions.resizerTargetTop ? $(this.state.resizerOptions.resizerTargetTop) : $target
    this.$targetBottom = this.state.resizerOptions.resizerTargetBottom ? $(this.state.resizerOptions.resizerTargetBottom) : $target
    this.$targetLeft = this.state.resizerOptions.resizerTargetLeft ? $(this.state.resizerOptions.resizerTargetLeft) : $target
    this.$targetRight = this.state.resizerOptions.resizerTargetRight ? $(this.state.resizerOptions.resizerTargetRight) : $target
  }

  componentWillUnmount () {
    this.stopResize()
    $(this.refs.resizer).off('mousedown.vcv-resizer').off('touchstart.vcv-resizer')
    this.state.resizerOptions.$overlay.remove()
  }

  bindDrag (e) {
    this.startClientX = this.getClientX(e)
    this.startClientY = this.getClientY(e)
    // Disable highlighting while dragging
    if (e.stopPropagation) {
      e.stopPropagation()
    }
    if (e.preventDefault) {
      e.preventDefault()
    }
    e.cancelBubble = true
    e.returnValue = false
    this.state.resizerOptions.overlayClasses && this.state.resizerOptions.$overlay.addClass(this.state.resizerOptions.overlayClasses)
    this.state.resizerOptions.$overlay.appendTo('body')
    $(document)
      .on('mousemove.vcv-resizer', this.doResize.bind(this))
      .on('mouseup.vcv-resizer', this.stopResize.bind(this))
      .on('touchmove.vcv-resizer', this.doResize.bind(this))
      .on('touchend.vcv-resizer', this.stopResize.bind(this))
  }

  getClientX (e) {
    return e.originalEvent && e.originalEvent.touches ? e.originalEvent.touches[ 0 ].clientX : e.clientX
  }

  getClientY (e) {
    return e.originalEvent && e.originalEvent.touches ? e.originalEvent.touches[ 0 ].clientY : e.clientY
  }

  doResize (e) {
    if (e.which === 1 || (e.originalEvent && e.originalEvent.touches)) {
      var clientX = this.getClientX(e)
      var clientY = this.getClientY(e)
      var offsetX = this.startClientX - clientX
      var offsetY = this.startClientY - clientY
      var w, h
      e.offsetX = offsetX
      e.offsetY = offsetY
      e.$targetTop = this.$targetTop
      e.$targetBottom = this.$targetBottom
      e.$targetLeft = this.$targetLeft
      e.$targetRight = this.$targetRight

      if (this.state.resizerOptions.resizeTop) {
        h = parseInt(this.$targetTop.css('height'))
        h = h + (offsetY) + 'px'
        this.$targetTop.css('height', h)
        this.startClientY = clientY
        e.direction = 'top'
        this.state.resizerOptions.callback && this.state.resizerOptions.callback(e)
      } else if (this.state.resizerOptions.resizeBottom) {
        h = parseInt(this.$targetBottom.css('height'))
        h = h - (offsetY) + 'px'
        this.$targetBottom.css('height', h)
        this.startClientY = clientY
        e.direction = 'bottom'
        this.state.resizerOptions.callback && this.state.resizerOptions.callback(e)
      }
      if (this.state.resizerOptions.resizeRight) {
        w = parseInt(this.$targetRight.css('width'))
        w = w - (offsetX) + 'px'
        this.$targetRight.css('width', w)
        this.startClientX = clientX
        e.direction = 'right'
        this.state.resizerOptions.callback && this.state.resizerOptions.callback(e)
      } else if (this.state.resizerOptions.resizeLeft) {
        w = parseInt(this.$targetLeft.css('width'))
        w = w + (offsetX) + 'px'
        this.$targetLeft.css('width', w)
        this.startClientX = clientX
        e.direction = 'left'
        this.state.resizerOptions.callback && this.state.resizerOptions.callback(e)
      }
    } else {
      this.stopResize()
    }
  }

  stopResize () {
    this.state.resizerOptions.$overlay.detach()
    $(document)
      .off('mousemove.vcv-resizer')
      .off('mouseup.vcv-resizer')
      .off('touchmove.vcv-resizer')
      .off('touchend.vcv-resizer')
  }

  render () {
    return (<div ref='resizer' className={this.state.resizerOptions.resizerClasses}></div>)
  }
}

module.exports = Resizer
