class Outline {
  constructor () {
    this.iframeContainer = document.querySelector('.vcv-layout-iframe-container')
    this.iframeOverlay = document.querySelector('#vcv-editor-iframe-overlay')
    this.iframe = document.querySelector('#vcv-editor-iframe')
    this.iframeWindow = this.iframe && this.iframe.contentWindow
    this.iframeDocument = this.iframeWindow && this.iframeWindow.document

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
    let elementPos = element.getBoundingClientRect()
    frame.style.top = elementPos.top + 'px'
    frame.style.left = elementPos.left + 'px'
    frame.style.width = elementPos.width + 'px'
    frame.style.height = elementPos.height + 'px'
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

export default Outline
