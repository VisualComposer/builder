import vcCake from 'vc-cake'
import ControlsHandler from './controlsHandler'
import OutlineHandler from './outlineHandler'
import FramesHandler from './framesHandler'

const layoutStorage = vcCake.getStorage('layout')
const workspaceStorage = vcCake.getStorage('workspace')
const workspaceContentState = workspaceStorage.state('content')
const elementsStorage = vcCake.getStorage('elements')
const documentManager = vcCake.getService('document')
const cook = vcCake.getService('cook')

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
      prevTarget: null,
      prevElement: null,
      prevElementPath: [],
      controlsPrevTarget: null,
      controlsPrevElement: null,
      showOutline: true,
      showFrames: true,
      showControls: true
    }

    this.resizeColumns = false
    this.isScrolling = false

    this.findElement = this.findElement.bind(this)
    this.controlElementFind = this.controlElementFind.bind(this)
    this.handleFrameLeave = this.handleFrameLeave.bind(this)
    this.handleFrameMousemoveOnce = this.handleFrameMousemoveOnce.bind(this)
    this.handleOverlayMouseLeave = this.handleOverlayMouseLeave.bind(this)
    this.handleFrameContainerLeave = this.handleFrameContainerLeave.bind(this)
    this.updateIframeVariables = this.updateIframeVariables.bind(this)
    this.handleScroll = this.handleScroll.bind(this)
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
      },
      /**
       * @memberOf! OutlineManager
       */
      outline: {
        value: new OutlineHandler(systemData),
        writable: false,
        enumerable: false,
        configurable: false
      },
      /**
       * @memberOf! ControlsManager
       */
      controls: {
        value: new ControlsHandler(systemData),
        writable: false,
        enumerable: false,
        configurable: false
      }
    })

    this.subscribeToCurrentIframe()
    this.subscribeToControlsContainer()
  }

  subscribeToCurrentIframe () {
    // Subscribe to main event to interact with content elements
    this.iframeDocument.body.addEventListener('mousemove', this.findElement)
    this.iframeDocument.body.addEventListener('mouseleave', this.handleFrameLeave)
    // show frames on mouseleave, if edit form for row is opened
    this.iframeContainer.addEventListener('mouseleave', this.handleFrameContainerLeave)
    // handle scroll of iframe window
    this.iframeWindow.addEventListener('scroll', this.handleScroll)
  }

  subscribeToControlsContainer () {
    // add controls interaction with content
    this.controls.getControlsContainer().addEventListener('mousemove', this.controlElementFind)
    this.controls.getControlsContainer().addEventListener('mouseleave', this.controlElementFind)
  }

  /**
   * Find element by event and run cake events on element over and out
   * @param e
   */
  findElement (e = null) {
    // need to run all events, so creating fake event
    if (!e) {
      e = {
        target: null
      }
    }
    if ((e.target !== this.state.prevTarget) || !layoutStorage.state('interactWithContent').get()) {
      this.state.prevTarget = e.target
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
      if (this.state.prevElement !== element) {
        // unset prev element
        if (this.state.prevElement) {
          layoutStorage.state('interactWithContent').set({
            type: 'mouseLeave',
            element: this.state.prevElement,
            vcElementId: this.state.prevElement.dataset.vcvElement,
            path: this.state.prevElementPath,
            vcElementsPath: this.state.prevElementPath.map((el) => {
              return el.dataset.vcvElement
            })
          })
        }
        // set new element
        if (element) {
          layoutStorage.state('interactWithContent').set({
            type: 'mouseEnter',
            element: element,
            vcElementId: element.dataset.vcvElement,
            path: elPath,
            vcElementsPath: elPath.map((el) => {
              return el.dataset.vcvElement
            })
          })
          layoutStorage.state('interactWithContent').set({
            type: 'mouseDown',
            element: element,
            vcElementId: element.dataset.vcvElement,
            path: elPath,
            vcElementsPath: elPath.map((el) => {
              return el.dataset.vcvElement
            })
          })
        }

        this.state.prevElement = element
        this.state.prevElementPath = elPath
      }
    }
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

  getDOMNodes () {
    const iframe = document.querySelector('#vcv-editor-iframe')
    return {
      iframeContainer: document.querySelector('.vcv-layout-iframe-container'),
      iframeOverlay: document.querySelector('#vcv-editor-iframe-overlay'),
      iframeWrapper: document.querySelector('.vcv-layout-iframe-wrapper'),
      iframe: iframe,
      documentBody: document.body,
      iframeWindow: iframe && iframe.contentWindow,
      iframeDocument: iframe && iframe.contentDocument
    }
  }

  /**
   * Initialize
   */
  init (options = {}) {
    let defaultOptions = {
      iframeUsed: true,
      ...this.getDOMNodes()
    }

    options = Object.assign({}, defaultOptions, options)
    this.setup(options)

    // Check custom layout mode
    vcCake.onDataChange('vcv:layoutCustomMode', (state) => {
      this.state.showOutline = !state
      this.state.showFrames = !state
      if (state === 'dnd') {
        this.state.showFrames = true
      }
      if (state === 'contentEditable') {
        this.frames.hide()
      }
      this.state.showControls = !state
      this.findElement()
      this.controlElementFind()
    })

    // check column resize
    vcCake.onDataChange('vcv:layoutColumnResize', (rowId) => {
      if (rowId) {
        this.showChildrenFrames(rowId)
      } else {
        this.frames.hide()
      }
    })

    elementsStorage.state('elementAdd').onChange((data) => {
      if (data && data.tag === 'row') {
        this.showChildrenFramesWithDelay(data.id)
      }
    })

    // check remove element
    this.api.on('element:unmount', () => {
      this.findElement()
      this.controlElementFind()
      this.outline.hide()
    })

    // Interact with content
    this.interactWithContent()

    // Interact with tree
    this.interactWithTree()

    // interact with controls
    this.interactWithControls()
  }

  /**
   * Interact with content
   */
  interactWithContent () {
    layoutStorage.state('resizeColumns').onChange((data) => {
      this.resizeColumns = data
    })
    // Content interaction
    layoutStorage.state('interactWithContent').onChange((data) => {
      if (this.resizeColumns && data && data.type === 'mouseDown') {
        this.frames.hide()
        this.showFrames(data)
      }
      if (data && data.type === 'mouseEnter') {
        if (this.closingControlsInterval) {
          clearInterval(this.closingControlsInterval)
          this.closingControlsInterval = null
        }
        if (this.closingControls) {
          if (this.closingControls === data.vcElementId) {
            return
          }

          this.controls.hide()
          if (this.state.showFrames) {
            this.frames.hide()
          }
          this.closingControls = null
        }

        if (this.state.showControls) {
          let element = documentManager.get(data.vcElementId)
          let cookElement = cook.get(element)
          let attribute = cookElement.filter(a => cookElement.settings(a).settings && cookElement.settings(a).settings.type === 'htmleditor')
          if (attribute) {
            let options = cookElement.settings(attribute).settings && cookElement.settings(attribute).settings.options
            if (options && options.inline) {
              data.elementInlineEdit = true
            }
          }
          this.controls.show(data)
        }
        if (this.state.showFrames) {
          this.showFrames(data)
        }
      }
      if (data && data.type === 'mouseLeave') {
        this.closingControls = data.vcElementId
        if (this.closingControlsInterval) {
          clearInterval(this.closingControlsInterval)
          this.closingControlsInterval = null
        }
        this.closingControlsInterval = setInterval(() => {
          if (this.closingControls) {
            this.controls.hide()
            if (this.state.showFrames) {
              this.frames.hide()
            }
            this.closingControls = null
          }
          clearInterval(this.closingControlsInterval)
          this.closingControlsInterval = null
        }, 400)
      }
    })
  }

  /**
   * Interact with tree
   */
  interactWithTree () {
    workspaceStorage.state('userInteractWith').onChange((id = false) => {
      if (id && this.state.showOutline) {
        let element = this.iframeDocument.querySelector(`[data-vcv-element="${id}"]:not([data-vcv-interact-with-controls="false"])`)
        if (element) {
          this.outline.show(element, id)
        }
      } else {
        this.outline.hide()
      }
    })
    // Controls interaction
    layoutStorage.state('interactWithControls').onChange((data) => {
      if (data && data.type === 'mouseEnter') {
        layoutStorage.state('userInteractWith').set(data.vcElementId)
      }
      if (data && data.type === 'mouseLeave') {
        layoutStorage.state('userInteractWith').set(false)
      }
    })
  }

  handleScroll () {
    const contentState = layoutStorage.state('interactWithContent')
    if (!contentState.get() || !contentState.get().type || contentState.get().type !== 'scrolling') {
      contentState.set({ type: 'scrolling' })
      this.outline.hide()
      this.frames.hide()
      this.controls.hide()
    }

    window.clearTimeout(this.isScrolling)

    this.isScrolling = setTimeout(() => {
      contentState.set(false)
      this.state.prevElement = null
    }, 150)
  }

  /**
   * Handle control click
   */
  handleControlClick (controlsContainer, e) {
    e && e.button === 0 && e.preventDefault()
    if (e.button === 0) {
      let path = this.getPath(e)
      // search for event
      let i = 0
      let el = null
      while (i < path.length && path[ i ] !== controlsContainer) {
        if (path[ i ].dataset && path[ i ].dataset.vcControlEvent) {
          el = path[ i ]
          i = path.length
        }
        i++
      }
      if (el) {
        let event = el.dataset.vcControlEvent
        let tag = el.dataset.vcControlEventOptions || false
        if (el.dataset.vcControlEventDisabled) {
          return
        }
        let options = {
          insertAfter: el.dataset.vcControlEventOptionInsertAfter || false
        }
        let elementId = el.dataset.vcvElementId
        if (event === 'treeView') {
          workspaceContentState.set('treeView', elementId)
        } else if (event === 'edit') {
          workspaceContentState.set(false)
          let settings = workspaceStorage.state('settings').get()
          if (settings && settings.action === 'edit') {
            workspaceStorage.state('settings').set(false)
          }
          workspaceStorage.trigger(event, elementId, tag, options)
        } else if (event === 'remove') {
          this.controls.hide()
          this.findElement()
          this.controlElementFind()
          this.iframeDocument.body.removeEventListener('mousemove', this.findElement)
          workspaceStorage.trigger(event, elementId, tag, options)
          setTimeout(() => {
            this.iframeDocument.body.addEventListener('mousemove', this.findElement)
          }, 100)
        } else if (event === 'copy') {
          this.controls.hide()
          workspaceStorage.trigger(event, elementId, tag, options)
        } else if (event === 'hide') {
          this.controls.hide()
          workspaceStorage.trigger(event, elementId)
        } else {
          workspaceStorage.trigger(event, elementId, tag, options)
        }
      }
    }
  }

  /**
   * Interact with controls
   */
  interactWithControls () {
    // click on action
    this.controls.getControlsContainer().addEventListener('click',
      this.handleControlClick.bind(this, this.controls.getControlsContainer())
    )
    this.controls.getAppendControlContainer().addEventListener('click',
      this.handleControlClick.bind(this, this.controls.getAppendControlContainer())
    )
    // drag control
    this.controls.getControlsContainer().addEventListener('mousedown',
      (e) => {
        e && e.button === 0 && e.preventDefault()
        if (e.button === 0) {
          let path = this.getPath(e)
          // search for event
          let i = 0
          let el = null
          while (i < path.length && path[ i ] !== this.controls.getControlsContainer()) {
            if (path[ i ].dataset && path[ i ].dataset.vcDragHelper) {
              el = path[ i ]
              i = path.length
            }
            i++
          }
          if (el) {
            this.outline.hide()
            this.controls.hide()
            vcCake.setData('draggingElement', { id: el.dataset.vcDragHelper, point: { x: e.clientX, y: e.clientY } })
          }
        }
      }
    )

    // Controls interaction
    layoutStorage.state('interactWithControls').onChange((data) => {
      if (data && data.type === 'mouseEnter') {
        if (this.closingControlsInterval) {
          clearInterval(this.closingControlsInterval)
          this.closingControlsInterval = null
        }
        if (this.state.showOutline) {
          // show outline over content element
          let contentElement = this.iframeDocument.querySelector(`[data-vcv-element="${data.vcElementId}"]:not([data-vcv-interact-with-controls="false"])`)
          if (contentElement) {
            this.outline.show(contentElement, data.vcElementId)
          }
        }
      }
      if (data && data.type === 'mouseLeave') {
        if (this.closingControlsInterval) {
          clearInterval(this.closingControlsInterval)
          this.closingControlsInterval = null
        }
        this.closingControlsInterval = setInterval(() => {
          if (this.closingControls) {
            this.controls.hide()
            if (this.state.showFrames) {
              this.frames.hide()
            }
            this.closingControls = null
          }
          clearInterval(this.closingControlsInterval)
          this.closingControlsInterval = null
        }, 400)
        if (this.state.showOutline) {
          this.outline.hide()
        }
      }
    })
  }

  /**
   * Find element in controls (needed for controls interaction)
   * @param e
   */
  controlElementFind (e) {
    // need to run all events, so creating fake event
    if (!e) {
      e = {
        target: null
      }
    }
    if (e.target !== this.state.controlsPrevTarget) {
      this.state.controlsPrevTarget = e.target
      // get all vcv elements
      let path = this.getPath(e)
      // search for event
      let i = 0
      let element = null
      while (i < path.length && path[ i ] !== this.controls.getControlsContainer()) {
        // select handler for draw outline trigger
        if (path[ i ].dataset && path[ i ].dataset.vcvElementControls) {
          element = path[ i ].dataset.vcvElementControls
          i = path.length
        }
        i++
      }
      if (this.state.controlsPrevElement !== element) {
        // unset prev element
        if (this.state.controlsPrevElement) {
          layoutStorage.state('interactWithControls').set({
            type: 'mouseLeave',
            vcElementId: this.state.controlsPrevElement
          })
        }
        // set new element
        if (element) {
          layoutStorage.state('interactWithControls').set({
            type: 'mouseEnter',
            vcElementId: element
          })
        }
        this.state.controlsPrevElement = element
      }
    }
  }

  /**
   * Show frames with custom path
   */
  showFrames (data) {
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

  /**
   * Show frames on elements children
   */
  showChildrenFrames (parentId) {
    const documentService = vcCake.getService('document')
    let elementsToShow = []
    let children = documentService.children(parentId)
    children.forEach((child) => {
      elementsToShow.push(child.id)
    })
    elementsToShow = elementsToShow.map((id) => {
      let selector = `[data-vcv-element="${id}"]:not([data-vcv-interact-with-controls="false"])`
      return this.iframeDocument.querySelector(selector)
    })
    elementsToShow = elementsToShow.filter((el) => {
      return el
    })
    this.frames.show({ path: elementsToShow })
  }

  /**
   * Show frames on elements children for columns, when they are not ready yet
   */
  showChildrenFramesWithDelay (id) {
    setTimeout(() => {
      this.showChildrenFrames(id)
    }, 100)
  }

  /**
   * Show frames on one element
   * @param id
   */
  showFramesOnOneElement (id) {
    const selector = `[data-vcv-element="${id}"]:not([data-vcv-interact-with-controls="false"])`
    let elementsToShow = []
    elementsToShow.push(this.iframeDocument.querySelector(selector))
    this.frames.show({ path: elementsToShow })
  }

  /**
   * Add event listener on documentBody to check if hide controls
   */
  handleFrameLeave () {
    this.documentBody.addEventListener('mousemove', this.handleFrameMousemoveOnce)
  }

  /**
   * Check if mouse is out of iframe overlay
   * @param e
   */
  handleFrameMousemoveOnce (e) {
    this.documentBody.removeEventListener('mousemove', this.handleFrameMousemoveOnce)
    const paths = this.getPath(e).filter((path) => {
      return path === this.iframeOverlay
    })
    if (!paths.length) {
      this.findElement()
    } else {
      this.iframeOverlay.addEventListener('mouseleave', this.handleOverlayMouseLeave)
    }
  }

  /**
   * Remove listener if mouse is not in iframe overlay
   */
  handleOverlayMouseLeave () {
    this.iframeOverlay.removeEventListener('mouseleave', this.handleOverlayMouseLeave)
    this.findElement()
  }

  /**
   * Show frames if mouse is out of iframe and edit form for row is opened
   */
  handleFrameContainerLeave () {
    let data = workspaceStorage.state('settings').get()
    // TODO: Check accessPoint?
    if (data && data.element) {
      if (data.element.tag === 'row') {
        this.editFormId = data.element.id
        this.showChildrenFramesWithDelay(this.editFormId)
      } else if (data.element.tag === 'column') {
        this.editFormId = data.element.id
        this.showFramesOnOneElement(this.editFormId)
      }
    }
  }

  updateIframeVariables () {
    const DOMNodes = this.getDOMNodes()
    this.iframe = DOMNodes.iframe
    this.iframeWindow = DOMNodes.iframeWindow
    this.iframeDocument = DOMNodes.iframeDocument
    this.frames.updateIframeVariables(DOMNodes)
    this.outline.updateIframeVariables(DOMNodes)
    this.controls.updateIframeVariables(DOMNodes)
    this.subscribeToCurrentIframe()
  }
}
