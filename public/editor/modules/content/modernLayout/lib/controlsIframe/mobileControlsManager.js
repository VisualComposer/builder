import vcCake from 'vc-cake'
import FramesHandler from './framesHandler'
import MobileDetect from 'mobile-detect'

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
    this.iframeWrapper = options.iframeWrapper
    this.iframe = options.iframe
    this.iframeWindow = options.iframeWindow
    this.iframeDocument = options.iframeDocument
    this.documentBody = options.documentBody
    this.editFormId = null
    const mobileDetect = new MobileDetect(window.navigator.userAgent)
    this.iframeScrollable = this.iframeWindow
    if (mobileDetect.os() === 'iOS') {
      this.isIOS = true
      this.iframeScrollable = (this.iframeDocument && this.iframeDocument.body) || this.iframeWrapper
    }
    // this.iframeScrollable = mobileDetect.os() === 'iOS' ? this.iframeWrapper : this.iframeWindow
    this.isPhone = mobileDetect.mobile() && mobileDetect.phone()

    let systemData = {
      iframeContainer: this.iframeContainer,
      iframeOverlay: this.iframeOverlay,
      iframeWrapper: this.iframeWrapper,
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
      iframeWrapper: document.querySelector('.vcv-layout-iframe-wrapper'),
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
      if (documentElement && documentElement.tag === 'column') {
        let children = documentService.children(documentElement.parent)
        children.forEach((child) => {
          elementsToShow.push(child.id)
        })
      } else if (documentElement && documentElement.tag === 'row') {
        let children = documentService.children(documentElement.id)
        elementsToShow.push(documentElement.id)
        children.forEach((child) => {
          elementsToShow.push(child.id)
        })
      } else {
        elementsToShow.push(documentElement && documentElement.id)
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

  scrollPage (y) {
    if (this.iframeScrollable && !this.state.scrolling) {
      let posY = this.iframeScrollable.hasOwnProperty('scrollY') ? this.iframeScrollable.scrollY : this.iframeScrollable.scrollTop
      let posX = this.iframeScrollable.hasOwnProperty('scrollX') ? this.iframeScrollable.scrollX : this.iframeScrollable.scrollLeft
      if (this.isIOS && this.iframeScrollable.firstElementChild) {
        posY = -this.iframeScrollable.firstElementChild.getBoundingClientRect().top
      }
      if (posY === undefined || posX === undefined) {
        return
      }
      this.state.scrolling = true
      this.scroll(posX, posY, y, 100, () => {
        if (this.state.scroll) {
          setTimeout(() => {
            this.scrollPage(y)
          }, 100)
        }
      })
    }
  }

  scroll (posX, posY, y, amount, callback) {
    if (this.iframeScrollable && amount >= 0 + y) {
      this.iframeScrollable.scroll && !this.isIOS ? this.iframeScrollable.scroll(posX, posY + y) : this.iframeScrollable.scrollTop = posY + y
      setTimeout(() => {
        this.scroll(posX, posY + y, y, amount - Math.abs(y), callback)
      }, 30)
    } else {
      setTimeout(() => {
        this.state.scrolling = false
        callback()
      }, 100)
    }
  }

  touchStart (e) {
    let data = this.findElement(e)
    this.windowHeight = this.iframeScrollable.hasOwnProperty('innerHeight') ? this.iframeScrollable.innerHeight : this.iframeScrollable.clientHeight
    if (!this.state.dragging && e.touches && e.touches.length === 1 && data.element) {
      if (this.iframeDocument.selection) {
        this.iframeDocument.selection.empty()
      } else {
        this.iframeWindow.getSelection().removeAllRanges()
      }
      // if (!this.isPhone) {
      this.touchStartTimer = setTimeout(() => {
        e.preventDefault && e.preventDefault()
        e.stopPropagation && e.stopPropagation()
        this.startDragging(e, data)
      }, 450)
      // }
      if (this.doubleTapTimer && data.element === this.doubleTapElement) {
        this.editElement(e)
        this.doubleTapTimer = null
        clearTimeout(this.touchStartTimer)
      } else {
        this.doubleTapElement = data.element
        this.doubleTapTimer = setTimeout(() => {
          this.doubleTapTimer = null
          this.doubleTapElement = null
          if (!this.isPhone) {
            this.frames.hide()
            this.showFrames(data.element, data.elPath)
          }
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
      let scrollX = this.iframeWrapper && this.iframeWrapper.scrollLeft ? this.iframeWrapper.scrollLeft : 0
      let scrollY = this.iframeWrapper && this.iframeWrapper.scrollTop ? this.iframeWrapper.scrollTop : 0
      vcCake.setData('draggingElement', { id: this.state.element.dataset.vcvElement, point: { x: e.touches[ 0 ].clientX, y: e.touches[ 0 ].clientY, left: scrollX, top: scrollY } })
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

      let { clientX, clientY } = e.touches && e.touches[ 0 ] ? e.touches[ 0 ] : {}
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

      let scrollY = this.iframeWrapper && this.iframeWrapper.scrollTop ? this.iframeWrapper.scrollTop : 0
      let screenY = clientY - scrollY
      this.state.scroll = false
      let stepY = 0
      if (screenY <= 50) {
        stepY = -5
      } else if (this.windowHeight - 50 <= screenY) {
        stepY = 5
      }
      if (stepY) {
        this.state.scroll = true
        this.scrollPage(stepY)
      }
    } else {
      this.frames.hide()
    }
  }

  touchEnd () {
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
    this.frames.hide()
    if (this.iframeDocument.selection) {
      this.iframeDocument.selection.empty()
    } else {
      this.iframeWindow.getSelection().removeAllRanges()
    }
    if (element) {
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
