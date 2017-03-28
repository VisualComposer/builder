export default class Frames {
  constructor (sliceSize, props) {
    Object.defineProperty(this, 'sliceSize', {
      enumerable: false,
      configurable: false,
      writable: false,
      value: sliceSize
    })
    this.iframeContainer = props.iframeContainer
    this.iframeOverlay = props.iframeOverlay
    this.iframe = props.iframe
    this.iframeWindow = props.iframeWindow
    this.iframeDocument = props.iframeDocument

    this.frames = []

    this.state = {
      framesTimeout: []
    }

    this.setup()
  }

  /**
   * Generate frames and add them to overlay
   */
  setup () {
    for (let i = 0; i < this.sliceSize; i++) {
      let frame = document.createElement('svg')
      frame.classList.add('vcv-ui-element-frame')
      this.iframeOverlay.appendChild(frame)
      this.frames.push(frame)
    }
  }

  /**
   * Update frame position
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
   * Show frames
   * @param data
   */
  show (data) {
    if (this.sliceSize) {
      let slicedElements = data.path.slice(0, this.sliceSize)
      slicedElements.forEach((element, index) => {
        this.frames[ index ].classList.add('vcv-state--visible')
      })
      this.autoUpdatePosition(slicedElements)
    }
  }

  /**
   * Hide frames
   */
  hide () {
    this.frames.forEach((frame) => {
      frame.classList.remove('vcv-state--visible')
    })
    this.stopAutoUpdatePosition()
  }

  /**
   * Automatically update frames position after timeout
   * @param elements
   */
  autoUpdatePosition (elements) {
    this.stopAutoUpdatePosition()
    elements.forEach((element, index) => {
      this.updatePosition(element, this.frames[ index ])
      this.state.framesTimeout.push(this.iframeWindow.setInterval(this.updatePosition.bind(this, element, this.frames[ index ]), 16))
    })
  }

  /**
   * Stop automatically update frames position and clear timeout
   */
  stopAutoUpdatePosition () {
    this.state.framesTimeout.forEach((timeout) => {
      this.iframeWindow.clearInterval(timeout)
    })
    this.state.framesTimeout = []
  }
}
