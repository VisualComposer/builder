import React from 'react'
import lodash from 'lodash'
import PropTypes from 'prop-types'

class Resizer extends React.Component {
  static propTypes = {
    params: PropTypes.object.isRequired
  }

  state = {
    resizerOptions: lodash.defaults(this.props.params, {
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
      $overlay: window.jQuery('<div></div>')
    })
  }

  constructor (props) {
    super(props)
    this.resizerRef = React.createRef()
  }

  componentDidMount () {
    window.jQuery(this.resizerRef.current)
      .on('mousedown.vcv-resizer', this.bindDrag)
      .on('touchstart.vcv-resizer', this.bindDrag)
      .on('dragstart.vcv-resizer', (e) => {
        e && e.preventDefault && e.preventDefault()
        return false
      })

    const $target = this.state.resizerOptions.resizerTarget ? window.jQuery(this.state.resizerOptions.resizerTarget) : false
    this.$targetTop = this.state.resizerOptions.resizerTargetTop ? window.jQuery(this.state.resizerOptions.resizerTargetTop) : $target
    this.$targetBottom = this.state.resizerOptions.resizerTargetBottom ? window.jQuery(this.state.resizerOptions.resizerTargetBottom) : $target
    this.$targetLeft = this.state.resizerOptions.resizerTargetLeft ? window.jQuery(this.state.resizerOptions.resizerTargetLeft) : $target
    this.$targetRight = this.state.resizerOptions.resizerTargetRight ? window.jQuery(this.state.resizerOptions.resizerTargetRight) : $target
  }

  componentWillUnmount () {
    this.stopResize()
    window.jQuery(this.resizerRef.current).off('mousedown.vcv-resizer').off('touchstart.vcv-resizer')
    this.state.resizerOptions.$overlay.remove()
  }

  bindDrag = (e) => {
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
    window.jQuery(document)
      .on('mousemove.vcv-resizer', this.doResize)
      .on('mouseup.vcv-resizer', this.stopResize)
      .on('touchmove.vcv-resizer', this.doResize)
      .on('touchend.vcv-resizer', this.stopResize)
  }

  getClientX (e) {
    return e.originalEvent && e.originalEvent.touches ? e.originalEvent.touches[0].clientX : e.clientX
  }

  getClientY (e) {
    return e.originalEvent && e.originalEvent.touches ? e.originalEvent.touches[0].clientY : e.clientY
  }

  doResize = (e) => {
    if (e.which === 1 || (e.originalEvent && e.originalEvent.touches)) {
      const $window = window.jQuery(window)
      const clientX = this.getClientX(e)
      const clientY = this.getClientY(e)
      const offsetX = this.startClientX - clientX
      const offsetY = this.startClientY - clientY

      if (clientX < 0 || clientX > $window.width() || clientY < 0 || clientY > $window.height()) {
        return
      }

      e.offsetX = offsetX
      e.offsetY = offsetY
      e.$targetTop = this.$targetTop
      e.$targetBottom = this.$targetBottom
      e.$targetLeft = this.$targetLeft
      e.$targetRight = this.$targetRight

      if (this.state.resizerOptions.resizeTop) {
        this.resizeTop(offsetY, clientY, e)
      } else if (this.state.resizerOptions.resizeBottom) {
        this.resizeBottom(offsetY, clientY, e)
      }
      if (this.state.resizerOptions.resizeRight) {
        this.resizeRight(offsetX, clientX, e)
      } else if (this.state.resizerOptions.resizeLeft) {
        this.resizeLeft(offsetX, clientX, e)
      }
    } else {
      this.stopResize()
    }
  }

  resizeLeft (offsetX, clientX, e) {
    const oldW = parseInt(this.$targetLeft.css('width'))
    const w = oldW + (offsetX) + 'px'
    this.$targetLeft.css('width', w)
    const doResize = (window.getComputedStyle(this.$targetLeft[0]).width === w)
    if (doResize) {
      this.startClientX = clientX
      e.direction = 'left'
      this.state.resizerOptions.callback && this.state.resizerOptions.callback(e)
    } else {
      this.$targetLeft.css('width', oldW)
    }

    return doResize
  }

  resizeRight (offsetX, clientX, e) {
    const oldW = parseInt(this.$targetRight.css('width'))
    const w = oldW - (offsetX) + 'px'
    this.$targetRight.css('width', w)
    const doResize = (window.getComputedStyle(this.$targetRight[0]).width === w)
    if (doResize) {
      this.startClientX = clientX
      e.direction = 'right'
      this.state.resizerOptions.callback && this.state.resizerOptions.callback(e)
    } else {
      this.$targetRight.css('width', oldW)
    }

    return doResize
  }

  resizeBottom (offsetY, clientY, e) {
    const oldH = parseInt(this.$targetBottom.css('height'))
    const h = oldH - (offsetY) + 'px'
    this.$targetBottom.css('height', h)
    const doResize = (window.getComputedStyle(this.$targetBottom[0]).height === h)
    if (doResize) {
      this.startClientY = clientY
      e.direction = 'bottom'
      this.state.resizerOptions.callback && this.state.resizerOptions.callback(e)
    } else {
      this.$targetBottom.css('height', oldH)
    }

    return doResize
  }

  resizeTop (offsetY, clientY, e) {
    const oldH = parseInt(this.$targetTop.css('height'))
    const h = oldH + offsetY + 'px'
    this.$targetTop.css('height', h)
    const doResize = (window.getComputedStyle(this.$targetTop[0]).height === h)
    if (doResize) {
      this.startClientY = clientY
      e.direction = 'top'
      this.state.resizerOptions.callback && this.state.resizerOptions.callback(e)
    } else {
      this.$targetTop.css('height', oldH)
    }

    return doResize
  }

  stopResize = () => {
    this.state.resizerOptions.$overlay.detach()
    window.jQuery(document)
      .off('mousemove.vcv-resizer')
      .off('mouseup.vcv-resizer')
      .off('touchmove.vcv-resizer')
      .off('touchend.vcv-resizer')
  }

  render () {
    return (
      <div ref={this.resizerRef} className={this.state.resizerOptions.resizerClasses} />
    )
  }
}

export default Resizer
