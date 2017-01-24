export default class Outline {
  constructor (props) {
    this.iframeContainer = props.iframeContainer
    this.iframeOverlay = props.iframeOverlay
    this.iframe = props.iframe
    this.iframeWindow = props.iframeWindow
    this.iframeDocument = props.iframeDocument

    this.outline = null

    this.state = {
      outlineTimeout: null
    }

    this.setup()
  }

  /**
   * Generate outline and add it to overlay
   */
  setup () {
    this.outline = document.createElement('svg')
    this.outline.classList.add('vcv-ui-element-outline')
    this.iframeOverlay.appendChild(this.outline)
  }

  /**
   * Show outline
   * @param element
   */
  show (element) {
    this.outline.classList.add('vcv-state--visible')
    this.autoUpdatePosition(element)
  }

  /**
   * Hide outline
   */
  hide () {
    this.outline.classList.remove('vcv-state--visible')
    this.stopAutoUpdatePosition()
  }

  /**
   * Update outline position
   * @param element
   * @param frame
   */
  updatePosition (element, frame) {
    let { top, left, width, height } = element.getBoundingClientRect()
    if (this.iframe.tagName.toLowerCase() !== 'iframe') {
      let iframePos = this.iframe.getBoundingClientRect()
      top -= iframePos.top
      left -= iframePos.left
    }
    frame.style.top = top + 'px'
    frame.style.left = left + 'px'
    frame.style.width = width + 'px'
    frame.style.height = height + 'px'
  }

  /**
   * Automatically update outline position after timeout
   * @param element
   */
  autoUpdatePosition (element) {
    this.stopAutoUpdatePosition()
    if (!this.state.outlineTimeout) {
      this.updatePosition(element, this.outline)
      this.state.outlineTimeout = this.iframeWindow.setInterval(this.updatePosition.bind(this, element, this.outline), 16)
    }
  }

  /**
   * Stop automatically update outline position and clear timeout
   */
  stopAutoUpdatePosition () {
    if (this.state.outlineTimeout) {
      this.iframeWindow.clearInterval(this.state.outlineTimeout)
      this.state.outlineTimeout = null
    }
  }
}

