import vcCake from 'vc-cake'
import FramesHandler from './framesHandler'

const layoutStorage = vcCake.getStorage('layout')
const workspaceStorage = vcCake.getStorage('workspace')
const workspaceContentStartState = workspaceStorage.state('contentStart')
const documentManager = vcCake.getService('document')

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
      hoverRoot: null,
      scroll: false
    }

    this.editElement = this.editElement.bind(this)
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

    // Subscribe to main event to interact with content elements
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

  scrollPage (x, y) {
    let posY = this.iframeWindow.scrollY
    let posX = this.iframeWindow.scrollX
    if (posX === this.windowWidth || posY === this.windowHeight) {
      return
    }
    this.iframeWindow.scroll(posX + x, posY + y)
    if (this.state.scroll) {
      setTimeout(() => {
        this.scrollPage(x, y)
      }, 20)
    }
  }

  touchStart (e) {
    let data = this.findElement(e)
    this.windowHeight = this.iframeWindow.innerHeight
    let innerWidth = this.iframeWindow.innerWidth
    let outerWidth = this.iframeWindow.outerWidth
    this.windowWidth = innerWidth <= outerWidth ? innerWidth : outerWidth
    if (!this.state.dragging && e.touches && e.touches.length === 1) {
      if (data.element) {
        this.touchStartTimer = setTimeout(() => {
          e.preventDefault && e.preventDefault()
          e.stopPropagation && e.stopPropagation()
          this.startDragging(e, data)
        }, 450)
      }
      if (this.doubleTapTimer) {
        this.editElement(e)
        this.doubleTapTimer = null
        clearTimeout(this.touchStartTimer)
      } else {
        this.doubleTapTimer = setTimeout(() => {
          this.doubleTapTimer = null
        }, 250)
      }
    }
  }

  startDragging (e, { element, elPath }) {
    clearTimeout(this.touchStartTimer)
    this.touchStartTimer = null
    this.state.dragging = true
    if (element && elPath && this.state.showFrames && this.state.dragging) {
      this.state.element = element
      this.state.hoverElement = element
      this.state.hoverPath = elPath
      this.state.hoverRoot = elPath[ elPath.length - 1 ]
      this.showFrames(element, elPath)
      vcCake.setData('draggingElement', { id: this.state.element.dataset.vcvElement, point: { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY } })
    }
  }

  touchMove (e) {
    if (this.touchStartTimer) {
      clearTimeout(this.touchStartTimer)
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

      let { clientX, clientY } = e.changedTouches && e.changedTouches[0] || {}
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

      // this.state.scroll = false
      // let stepX = 0
      // let stepY = 0
      // if (screenX < 100) {
      //   stepX = -1
      // } else if (this.windowWidth - 100 < screenX) {
      //   stepX = 1
      // }
      // if (clientY < 100) {
      //   stepY = -1
      // } else if (this.windowHeight - 150 < clientY) {
      //   stepY = 1
      // }
      // if (stepX || stepY) {
      //   this.state.scroll = true
      //   this.scrollPage(stepX, stepY)
      // }
    }
  }

  touchEnd (e) {
    this.state.scroll = false
    if (this.touchStartTimer) {
      clearTimeout(this.touchStartTimer)
      this.touchStartTimer = null
      return
    }
    if (this.state.dragging) {
      this.frames.hide()
      this.state.dragging = false
    }
  }

  editElement (e) {
    let { element } = this.findElement(e)
    if (this.editFormId) {
      let settings = workspaceStorage.state('settings').get()
      if (settings && settings.action === 'edit') {
        workspaceStorage.state('settings').set(false)
      }
    } else if (element) {
      let elementData = documentManager.get(element.dataset.vcvElement)
      if (elementData) {
        this.editFormId = element.dataset.vcvElement
        workspaceStorage.trigger('edit', element.dataset.vcvElement, elementData.tag)
        if (workspaceContentStartState.get() === 'treeView') {
          workspaceContentStartState.set('treeView', element.dataset.vcvElement)
        }
      }
    }
    // remove treeView outline bug on mobile
    layoutStorage.state('userInteractWith').set(false)
  }
}
