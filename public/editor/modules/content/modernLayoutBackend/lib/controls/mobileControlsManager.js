import vcCake from 'vc-cake'
import FramesHandler from './framesHandler'

const workspaceStorage = vcCake.getStorage('workspace')

export default class ControlsManager {
  constructor (api) {
    Object.defineProperties(this, {
      /**
       * @memberOf! ControlsManager
       */
      api: {
        value: api,
        writable: false,
        enumerable: false,
        configurable: false
      }
    })

    this.state = {
      showFrames: true,
      dragging: false,
      element: null,
      hoverElement: null,
      hoverPath: null,
      hoverRoot: null
    }

    this.touchStart = this.touchStart.bind(this)
    this.touchMove = this.touchMove.bind(this)
    this.touchEnd = this.touchEnd.bind(this)
  }

  /**
   * Setup
   */
  setup (options) {
    // get system data
    this.iframeContainer = options.iframeContainer
    this.iframeOverlay = options.iframeOverlay
    this.iframe = options.iframe
    this.iframeWindow = options.iframeWindow
    this.iframeDocument = options.iframeDocument
    this.documentBody = options.documentBody
    this.isBackend = options.isBackend
    this.editFormId = null

    let systemData = {
      iframeContainer: this.iframeContainer,
      iframeOverlay: this.iframeOverlay,
      iframe: this.iframe,
      iframeWindow: this.iframeWindow,
      iframeDocument: this.iframeDocument,
      documentBody: this.documentBody
    }

    // define helpers
    Object.defineProperties(this, {
      /**
       * @memberOf! FramesManager
       */
      frames: {
        value: new FramesHandler(systemData),
        writable: false,
        enumerable: false,
        configurable: false
      }
    })

    this.iframeDocument.body.addEventListener('touchstart', this.touchStart, { passive: false })
    this.iframeDocument.body.addEventListener('touchmove', this.touchMove, { passive: false })
    this.iframeDocument.body.addEventListener('touchend', this.touchEnd, { passive: false })
  }

  /**
   * Initialize
   */
  init (options = {}) {
    let defaultOptions = {
      iframeUsed: true,
      iframeContainer: document.querySelector('.vcv-layout-iframe-container'),
      iframeOverlay: document.querySelector('#vcv-editor-iframe-overlay'),
      iframe: document.querySelector('#vcv-editor-iframe'),
      documentBody: document.body
    }
    defaultOptions.iframeWindow = defaultOptions.iframe && defaultOptions.iframe.contentWindow
    defaultOptions.iframeDocument = defaultOptions.iframeWindow && defaultOptions.iframeWindow.document

    options = Object.assign({}, defaultOptions, options)
    this.setup(options)

    workspaceStorage.state('contentEnd').onChange((action) => {
      this.editFormId = null
      this.frames.hide()
      let data = workspaceStorage.state('settings').get()
      if (data && action === 'editElement' && data.element) {
        this.editFormId = data.element.id
      }
    })
  }

  /**
   * Event.path shadow dom polyfill
   * @param e
   * @returns {*}
   */
  getPath (e) {
    if (e.path) {
      return e.path
    }
    let path = []
    let node = e.target

    while (node) {
      path.push(node)
      node = node.parentNode
    }
    return path
  }

  /**
   * Find element
   */
  findElement (e = null) {
    // need to run all events, so creating fake event
    if (!e) {
      e = {
        target: null
      }
    }
    // get all vcv elements
    let path = this.getPath(e)
    let elPath = []
    path.forEach((el) => {
      if (el.hasAttribute && (el.hasAttribute('data-vcv-element') || el.hasAttribute('data-vcv-linked-element'))) {
        elPath.push(el)
      }
    })
    let element = null
    if (elPath.length) {
      element = elPath[ 0 ] // first element in path always hovered element
    }
    // replace linked element with real element
    if (element && element.dataset.hasOwnProperty('vcvLinkedElement')) {
      element = this.iframeDocument.querySelector(`[data-vcv-element="${element.dataset.vcvLinkedElement}"]`)
      elPath[ 0 ] = element
    }
    return { element, elPath }
  }

  showFrames (element, elPath) {
    let data = {
      element: element,
      vcElementId: element && element.dataset && element.dataset.vcvElement,
      path: elPath,
      vcElementsPath: elPath && elPath.map((el) => {
        return el && el.dataset && el.dataset.vcvElement
      })
    }
    const documentService = vcCake.getService('document')
    let elementsToShow = []
    data.vcElementsPath.forEach((id) => {
      let documentElement = documentService.get(id)
      if (documentElement.tag === 'column') {
        let children = documentService.children(documentElement.parent)
        children.forEach((child) => {
          elementsToShow.push(child.id)
        })
      } else if (documentElement.tag === 'row') {
        let children = documentService.children(documentElement.id)
        elementsToShow.push(documentElement.id)
        children.forEach((child) => {
          elementsToShow.push(child.id)
        })
      } else {
        elementsToShow.push(documentElement.id)
      }
    })
    elementsToShow = elementsToShow.map((id) => {
      let selector = `[data-vcv-element="${id}"]:not([data-vcv-interact-with-controls="false"])`
      return this.iframeDocument.querySelector(selector)
    })
    elementsToShow = elementsToShow.filter((el) => {
      return el
    })
    this.frames.show({ element: data.element, path: elementsToShow })
  }

  touchStart (e) {
    let data = this.findElement(e)
    this.windowHeight = this.iframeWindow.innerHeight
    if (data.element && !this.state.dragging && e.touches && e.touches.length === 1) {
      this.touchStartTimer = setTimeout(() => {
        e.preventDefault && e.preventDefault()
        e.stopPropagation && e.stopPropagation()
        this.startDragging(e, data)
      }, 450)
    }
  }

  startDragging (e, { element, elPath }) {
    clearInterval(this.touchStartTimer)
    this.touchStartTimer = null
    this.state.dragging = true
    if (element && elPath && this.state.showFrames && this.state.dragging) {
      this.state.element = element
      this.state.hoverElement = element
      this.state.hoverPath = elPath
      this.state.hoverRoot = elPath[ elPath.length - 1 ]
      this.showFrames(element, elPath)
      vcCake.setData('draggingElement', { id: this.state.element.dataset.vcvElement, point: { x: e.touches[0].clientX, y: e.touches[0].clientY, left: 0, top: 0 } })
    }
  }

  touchMove (e) {
    if (this.touchStartTimer) {
      clearInterval(this.touchStartTimer)
      this.touchStartTimer = null
      return
    }

    if (this.state.showFrames && this.state.dragging) {
      e.preventDefault && e.preventDefault()
      // remove selection on move
      if (this.iframeDocument.selection) {
        this.iframeDocument.selection.empty()
      } else {
        this.iframeWindow.getSelection().removeAllRanges()
      }

      let { clientX, clientY } = e.touches && e.touches[0] || {}
      let element = this.iframeDocument.elementFromPoint(clientX, clientY)
      let { elPath } = this.findElement({ target: element })
      let elRoot = elPath[ elPath.length - 1 ]
      if (this.state.hoverRoot !== elRoot || this.state.hoverPath.indexOf(element) < 0) {
        this.frames.hide()
        this.state.hoverElement = element
        this.state.hoverPath = elPath
        this.state.hoverRoot = elRoot
        this.showFrames(element, elPath)
      }
    }
  }

  touchEnd () {
    if (this.touchStartTimer) {
      clearInterval(this.touchStartTimer)
      this.touchStartTimer = null
      return
    }
    if (this.state.dragging) {
      this.frames.hide()
      this.state.dragging = false
    }
  }
}
