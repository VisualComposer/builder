// import {getService} from 'vc-cake'
// const documentManager = getService('document')
// const cook = getService('cook')
// const categoriesService = getService('categories')

class ControlsHandler {
  constructor () {
    Object.defineProperty(this, 'sliceSize', {
      enumerable: false,
      configurable: false,
      writable: false,
      value: 3
    })
    this.iframeContainer = document.querySelector('.vcv-layout-iframe-container')
    this.iframeOverlay = document.querySelector('#vcv-editor-iframe-overlay')
    this.iframe = document.querySelector('#vcv-editor-iframe')
    this.iframeWindow = this.iframe && this.iframe.contentWindow
    this.iframeDocument = this.iframeWindow && this.iframeWindow.document
    this.outline = document.createElement('svg')
    this.outline.classList.add('vcv-ui-element-outline')
    this.iframeOverlay.appendChild(this.outline)

    this.state = {
      outlines: [],
      frames: [],
      outlineTimeout: null
    }
  }

  /**
   * Show outline
   * @param element
   */
  showOutline (element) {
    this.outline.classList.add('vcv-state--visible')
    this.autoUpdateOutline(element)
  }

  /**
   * Hide outline
   */
  hideOutline () {
    this.outline.classList.remove('vcv-state--visible')
    this.stopAutoUpdateOutline()
  }

  /**
   * Update outline position
   * @param element
   */
  updateOutline (element) {
    let elementPos = element.getBoundingClientRect()
    this.outline.style.top = elementPos.top + 'px'
    this.outline.style.left = elementPos.left + 'px'
    this.outline.style.width = elementPos.width + 'px'
    this.outline.style.height = elementPos.height + 'px'
  }

  /**
   * Automatically update outline position after timeout
   * @param element
   */
  autoUpdateOutline (element) {
    this.stopAutoUpdateOutline()
    if (!this.state.outlineTimeout) {
      this.updateOutline(element)
      this.state.outlineTimeout = this.iframeWindow.setInterval(this.updateOutline.bind(this, element), 16)
    }
  }

  /**
   * Stop automatically update outline position and clear timeout
   */
  stopAutoUpdateOutline () {
    if (this.state.outlineTimeout) {
      this.iframeWindow.clearInterval(this.state.outlineTimeout)
      this.state.outlineTimeout = null
    }
  }
}

export default ControlsHandler
