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

    this.outline = null
    this.frames = []

    this.state = {
      outlineTimeout: null,
      framesTimeout: []
    }

    this.setupOutline()
    this.setupFrames()
  }

  setupOutline () {
    this.outline = document.createElement('svg')
    this.outline.classList.add('vcv-ui-element-outline')
    this.iframeOverlay.appendChild(this.outline)
  }

  setupFrames () {
    for (let i = 0; i < this.sliceSize; i++) {
      let frame = document.createElement('svg')
      frame.classList.add('vcv-ui-element-frame')
      this.iframeOverlay.appendChild(frame)
      this.frames.push(frame)
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
   * Update frame position
   * @param element
   * @param frame
   */
  updateFrame (element, frame) {
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
  autoUpdateOutline (element) {
    this.stopAutoUpdateOutline()
    if (!this.state.outlineTimeout) {
      this.updateFrame(element, this.outline)
      this.state.outlineTimeout = this.iframeWindow.setInterval(this.updateFrame.bind(this, element, this.outline), 16)
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

  /**
   * Show frames
   * @param element
   */
  showFrames (data) {
    let slicedElements = data.path.slice(0, this.sliceSize)
    slicedElements.forEach((element, index) => {
      this.frames[index].classList.add('vcv-state--visible')
    })
    this.autoUpdateFrames(slicedElements)
  }

  /**
   * Hide frames
   */
  hideFrames () {
    this.frames.forEach((frame) => {
      frame.classList.remove('vcv-state--visible')
    })
    this.stopAutoUpdateFrames()
  }
  /**
   * Automatically update outline position after timeout
   * @param element
   */
  autoUpdateFrames (elements) {
    this.stopAutoUpdateFrames()
    elements.forEach((element, index) => {
      this.updateFrame(element, this.frames[index])
      this.state.framesTimeout.push(this.iframeWindow.setInterval(this.updateFrame.bind(this, element, this.frames[index]), 16))
    })
  }

  /**
   * Stop automatically update outline position and clear timeout
   */
  stopAutoUpdateFrames () {
    this.state.framesTimeout.forEach((timeout) => {
      this.iframeWindow.clearInterval(timeout)
    })
    this.state.framesTimeout = []
  }
}

export default ControlsHandler
