export default class Frames {
  constructor (props) {
    this.iframeContainer = props.iframeContainer
    this.iframeOverlay = props.iframeOverlay
    this.iframe = props.iframe
    this.iframeWindow = props.iframeWindow
    this.iframeDocument = props.iframeDocument
    this.framesContainer = null

    this.frames = []

    this.state = {
      framesTimeout: []
    }

    this.setup()
  }

  setup () {
    this.framesContainer = document.createElement('div')
    this.framesContainer.classList.add('vcv-ui-element-frames-container')
    this.iframeOverlay.appendChild(this.framesContainer)
  }

  /**
   * Create frame and add it to frame list
   */
  addFrame () {
    let frame = document.createElement('svg')
    frame.classList.add('vcv-ui-element-frame')
    this.framesContainer.appendChild(frame)
    this.frames.push(frame)
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
    let elements = data.path
    // add frames if current frames count is not enough
    while (elements.length > this.frames.length) {
      this.addFrame()
    }
    elements.forEach((element, index) => {
      this.frames[ index ].classList.add('vcv-state--visible')
    })
    this.autoUpdatePosition(elements)
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
