import { getService, env } from 'vc-cake'

const cook = getService('cook')
const roleManager = getService('roleManager')

export default class Frames {
  constructor (props) {
    this.iframeContainer = props.iframeContainer
    this.iframeOverlay = props.iframeOverlay
    this.iframeWrapper = props.iframeWrapper
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
    const frame = document.createElement('svg')
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
      const iframePos = this.iframe.getBoundingClientRect()
      top -= iframePos.top
      left -= iframePos.left
    }
    let isElementLocked = false
    let isParentElementLocked = false
    let isTopParent = false
    if (env('VCV_ADDON_ROLE_MANAGER_ENABLED') && !roleManager.can('editor_settings_element_lock', roleManager.defaultAdmin())) {
      const id = element.dataset.vcvElement
      const cookElement = cook.getById(id)
      if (!cookElement) {
        return
      }
      const parentElement = cookElement.toJS().parent
      let cookParent = false
      if (parentElement) {
        cookParent = cook.getById(parentElement)
        if (cookParent.get('metaIsElementLocked')) {
          isParentElementLocked = true
        }
      } else {
        isTopParent = true
      }
      if (cookElement.get('metaIsElementLocked')) {
        isElementLocked = true
      }
    }
    frame.classList.remove('vcv-ui-element-frame--locked')
    frame.classList.remove('vcv-ui-element-frame--parent-locked')
    if (isElementLocked) {
      if (isParentElementLocked || isTopParent) {
        frame.classList.add('vcv-ui-element-frame--parent-locked')
      } else {
        frame.classList.add('vcv-ui-element-frame--locked')
      }
    }
    const scrollTop = this.iframeWrapper && this.iframeWrapper.scrollTop ? this.iframeWrapper.scrollTop : 0
    const scrollLeft = this.iframeWrapper && this.iframeWrapper.scrollLeft ? this.iframeWrapper.scrollLeft : 0
    frame.style.top = top - scrollTop + 'px'
    frame.style.left = left - scrollLeft + 'px'
    frame.style.width = width + 'px'
    frame.style.height = height + 'px'
  }

  /**
   * Show frames
   * @param data
   */
  show (data) {
    const elements = data.path
    // add frames if current frames count is not enough
    while (elements.length > this.frames.length) {
      this.addFrame()
    }
    elements.forEach((element, index) => {
      this.frames[index].classList.add('vcv-state--visible')
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
      this.updatePosition(element, this.frames[index])
      this.state.framesTimeout.push(this.iframeWindow.setInterval(this.updatePosition.bind(this, element, this.frames[index]), 16))
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

  /**
   * Update iframe variables
   */
  updateIframeVariables (DOMNodes) {
    this.iframe = DOMNodes.iframe
    this.iframeWindow = DOMNodes.iframeWindow
    this.iframeDocument = DOMNodes.iframeDocument
  }
}
