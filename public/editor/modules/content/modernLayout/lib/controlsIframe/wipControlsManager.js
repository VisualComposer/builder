import vcCake from 'vc-cake'
import ControlsHandler from './controlsHandler'
import OutlineHandler from './outlineHandler'
import FramesHandler from './framesHandler'

const layoutStorage = vcCake.getStorage('layout')
const workspaceStorage = vcCake.getStorage('workspace')

require('../../../../../../sources/less/content/layout/controls/init.less')
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

    this.findElement = this.findElement.bind(this)
    this.controlElementFind = this.controlElementFind.bind(this)
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

    let systemData = {
      iframeContainer: this.iframeContainer,
      iframeOverlay: this.iframeOverlay,
      iframe: this.iframe,
      iframeWindow: this.iframeWindow,
      iframeDocument: this.iframeDocument
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

    // Subscribe to main event to interact with content elements
    this.iframeDocument.body.addEventListener('mousemove', this.findElement)
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
    if (e.target !== this.state.prevTarget) {
      this.state.prevTarget = e.target
      // get all vcv elements
      let path = this.getPath(e)
      let elPath = path.filter((el) => {
        return el.dataset && (el.dataset.hasOwnProperty('vcvElement') || el.dataset.hasOwnProperty('vcvLinkedElement'))
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

  /**
   * Initialize
   */
  init (options = {}) {
    let defaultOptions = {
      iframeUsed: true,
      iframeContainer: document.querySelector('.vcv-layout-iframe-container'),
      iframeOverlay: document.querySelector('#vcv-editor-iframe-overlay'),
      iframe: document.querySelector('#vcv-editor-iframe')
    }
    defaultOptions.iframeWindow = defaultOptions.iframe && defaultOptions.iframe.contentWindow
    defaultOptions.iframeDocument = defaultOptions.iframeWindow && defaultOptions.iframeWindow.document

    options = Object.assign({}, defaultOptions, options)
    this.setup(options)

    // Check custom layout mode
    vcCake.onDataChange('vcv:layoutCustomMode', (state) => {
      this.state.showOutline = !state
      this.state.showFrames = !state
      if (state === 'dnd') {
        this.state.showFrames = true
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

    // check remove element
    /*
     this.api.reply('data:remove', () => {
     this.findElement()
     this.controlElementFind()
     })
     */

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
    // Content interaction
    layoutStorage.state('interactWithContent').onChange((data) => {
      if (data && data.type === 'mouseEnter') {
        if (this.state.showControls) {
          this.controls.show(data)
        }
        if (this.state.showFrames) {
          this.showFrames(data)
        }
      }
      if (data && data.type === 'mouseLeave') {
        if (this.state.showControls) {
          this.controls.hide()
        }
        if (this.state.showFrames) {
          this.frames.hide()
        }
      }
    })
  }

  /**
   * Interact with tree
   */
  interactWithTree () {
    workspaceStorage.state('userInteractWith').onChange((id = false) => {
      if (id && this.state.showOutline) {
        let element = this.iframeDocument.querySelector(`[data-vcv-element="${id}"]`)
        if (element) {
          this.outline.show(element)
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

  /**
   * Handle control click
   */
  handleControlClick (controlsContainer, e) {
    console.log('handlecontrolsclick')
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
        let options = {
          insertAfter: el.dataset.vcControlEventOptionInsertAfter || false
        }
        let elementId = el.dataset.vcvElementId
        if (event === 'remove') {
          this.findElement()
          this.controlElementFind()
        }
        workspaceStorage.trigger(event, elementId, tag, options)
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
            vcCake.setData('draggingElement', { id: el.dataset.vcDragHelper, point: { x: e.clientX, y: e.clientY } })
          }
        }
      }
    )

    // Controls interaction
    layoutStorage.state('interactWithControls').onChange((data) => {
      if (data && data.type === 'mouseEnter') {
        if (this.state.showOutline) {
          // show outline over content element
          let contentElement = this.iframeDocument.querySelector(`[data-vcv-element="${data.vcElementId}"]`)
          if (contentElement) {
            this.outline.show(contentElement)
          }
        }
      }
      if (data && data.type === 'mouseLeave') {
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
      } else {
        elementsToShow.push(documentElement.id)
      }
    })
    elementsToShow = elementsToShow.map((id) => {
      let selector = `[data-vcv-element="${id}"]`
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
      let selector = `[data-vcv-element="${id}"]`
      return this.iframeDocument.querySelector(selector)
    })
    elementsToShow = elementsToShow.filter((el) => {
      return el
    })
    this.frames.show({ path: elementsToShow })
  }
}

