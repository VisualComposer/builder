import lodash from 'lodash'
import vcCake from 'vc-cake'
import store from 'public/editor/stores/store'
import {
  controlsDataChanged,
  appendControlDataChanged,
  resizeControlDataChanged,
  outlineDataChanged
} from 'public/editor/stores/controls/slice'
import FramesHandler from './framesHandler'

const layoutStorage = vcCake.getStorage('layout')
const workspaceStorage = vcCake.getStorage('workspace')
const elementsStorage = vcCake.getStorage('elements')
const documentManager = vcCake.getService('document')
const cook = vcCake.getService('cook')
const roleManager = vcCake.getService('roleManager')

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
      showOutline: true,
      showFrames: true,
      showControls: true
    }

    this.resizeColumns = false
    this.isScrolling = false

    this.findElement = this.findElement.bind(this)
    this.handleFrameLeave = this.handleFrameLeave.bind(this)
    this.handleFrameMousemoveOnce = this.handleFrameMousemoveOnce.bind(this)
    this.handleOverlayMouseLeave = this.handleOverlayMouseLeave.bind(this)
    this.handleFrameContainerLeave = this.handleFrameContainerLeave.bind(this)
    this.updateIframeVariables = this.updateIframeVariables.bind(this)
    this.handleScroll = this.handleScroll.bind(this)
  }

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

    const systemData = {
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

    this.subscribeToCurrentIframe()
  }

  toggleControls (data) {
    const isAbleToAdd = roleManager.can('editor_content_element_add', roleManager.defaultTrue())
    if (data?.vcvEditableElements?.length) {
      store.dispatch(controlsDataChanged({
        vcvEditableElements: data.vcvEditableElements,
        vcElementId: data.vcElementId,
        vcvDraggableIds: data.vcvDraggableIds
      }))
      if (isAbleToAdd) {
        store.dispatch(appendControlDataChanged({
          vcElementId: data.vcElementId,
          vcElementsPath: data.vcElementsPath
        }))
      }
    } else {
      store.dispatch(controlsDataChanged({}))
      if (isAbleToAdd) {
        store.dispatch(appendControlDataChanged({}))
      }
      this.state.prevTarget = null
      this.state.prevElementPath = []
    }
  }

  toggleElementResize (data) {
    const customMode = vcCake.getData('vcv:layoutCustomMode')?.mode
    if (customMode === 'elementResize') {
      return null
    }
    if (data?.vcvEditableElements?.length) {
      let rowId = null
      for (let i = 0; i < data.vcvEditableElements.length; i++) {
        const cookElement = cook.getById(data.vcvEditableElements[i])
        if (cookElement.get('tag') === 'row') {
          rowId = data.vcvEditableElements[i]
          break
        }
      }
      if (rowId) {
        store.dispatch(resizeControlDataChanged({
          vcElementContainerId: rowId
        }))
      }
    } else {
      store.dispatch(resizeControlDataChanged({}))
    }
  }

  toggleOutlines (selector, id) {
    if (selector) {
      store.dispatch(outlineDataChanged({
        selector: selector,
        id: id
      }))
    } else {
      store.dispatch(outlineDataChanged({}))
    }
  }

  subscribeToCurrentIframe () {
    // Subscribe to main event to interact with content elements
    const throttleFindElement = lodash.throttle(this.findElement, 20)
    this.iframeDocument.body.addEventListener('mousemove', throttleFindElement)
    this.iframeDocument.body.addEventListener('mouseleave', this.handleFrameLeave)
    // show frames on mouseleave, if edit form for row is opened
    this.iframeContainer.addEventListener('mouseleave', this.handleFrameContainerLeave)
    // handle scroll of iframe window
    this.iframeWindow.addEventListener('scroll', this.handleScroll)
    this.iframeWindow.addEventListener('resize', this.handleScroll)
  }

  /**
   * Find element by event and run cake events on element over and out
   * @param e
   */
  findElement (e = null) {
    if (layoutStorage.state('rightClickMenuActive').get() === true) {
      return null
    }

    // need to run all events, so creating fake event
    if (!e) {
      e = {
        target: null
      }
    }
    const interactState = layoutStorage.state('interactWithContent').get()

    if (e.target === this.state.prevTarget && interactState) {
      return null
    }

    const customMode = vcCake.getData('vcv:layoutCustomMode')?.mode
    if (customMode === 'contentEditable' || customMode === 'dnd' || customMode === 'columnResizerHover' || customMode === 'columnResizer' || customMode === 'elementResize') {
      return null
    }

    this.state.prevTarget = e.target
    // get all vcv elements
    const path = this.getPath(e)
    const elPath = []
    path.forEach((el) => {
      if (el.hasAttribute && (el.hasAttribute('data-vcv-element') || el.hasAttribute('data-vcv-linked-element'))) {
        elPath.push(el)
      }
    })
    let element = null
    if (elPath.length) {
      element = elPath[0] // first element in path always hovered element
    }
    // replace linked element with real element
    if (element && Object.prototype.hasOwnProperty.call(element.dataset, 'vcvLinkedElement')) {
      element = this.iframeDocument.querySelector(`[data-vcv-element="${element.dataset.vcvLinkedElement}"]`)
      elPath[0] = element
    }
    if (this.state.prevElement === element) {
      return null
    }

    // unset prev element
    if (this.state.prevElement) {
      layoutStorage.state('interactWithContent').set({
        type: 'mouseLeave',
        vcElementId: this.state.prevElement.dataset.vcvElement,
        vcElementsPath: this.state.prevElementPath.map((el) => {
          return el.dataset.vcvElement
        })
      })
      layoutStorage.state('interactWithControls').set({
        type: 'mouseLeave'
      })
    }
    // set new element
    if (element) {
      layoutStorage.state('interactWithContent').set({
        type: 'mouseEnter',
        vcElementId: element.dataset.vcvElement,
        vcElementsPath: elPath.map((el) => {
          return el.dataset.vcvElement
        })
      })
      layoutStorage.state('interactWithControls').set({
        type: 'mouseEnter',
        vcElementId: element.dataset.vcvElement,
        idSelector: element.id
      })
      layoutStorage.state('interactWithContent').set({
        type: 'mouseDown',
        vcElementId: element.dataset.vcvElement,
        vcElementsPath: elPath.map((el) => {
          return el.dataset.vcvElement
        })
      })

      clearInterval(this.hideControlsInterval)

      this.hideControlsInterval = setInterval(() => {
        layoutStorage.state('interactWithContent').set({
          type: 'mouseLeave',
          vcElementId: element.dataset.vcvElement,
          vcElementsPath: elPath.map((el) => {
            return el.dataset.vcvElement
          })
        })
        this.state.prevElement = null
        this.state.prevElementPath = []
        layoutStorage.state('interactWithContent').set(false)
        window.setTimeout(() => {
          layoutStorage.state('interactWithControls').set({
            type: 'mouseLeave'
          })
        }, 400)
        clearInterval(this.hideControlsInterval)
        layoutStorage.state('hideControlsInterval').set(false)
      }, 6600)

      layoutStorage.state('hideControlsInterval').set(this.hideControlsInterval)
    }

    this.state.prevElement = element
    this.state.prevElementPath = elPath
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
    const path = []
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
    const defaultOptions = {
      iframeUsed: true,
      ...this.getDOMNodes()
    }

    options = Object.assign({}, defaultOptions, options)
    this.setup(options)

    // Check custom layout mode
    vcCake.onDataChange('vcv:layoutCustomMode', (state) => {
      this.state.showOutline = !state
      this.state.showFrames = !state
      if (state?.mode === 'dnd') {
        this.state.showFrames = true
        this.toggleControls()
        this.toggleElementResize()
        this.toggleOutlines()
      } else if (state?.mode === 'contentEditable') {
        this.frames.hide()
        this.toggleControls()
        this.toggleElementResize()
        this.toggleOutlines()
      } else if (state?.mode === 'columnResizerHover') {
        this.frames.hide()
        this.toggleControls()
        this.toggleOutlines()
        this.toggleElementResize()
      } else if (state?.mode === 'elementResize') {
        this.frames.hide() // First - hide old frames
        this.state.showFrames = true
        this.toggleControls()
        this.toggleOutlines()
      }
      this.state.showControls = !state
      this.findElement()
    })

    // check column resize
    vcCake.onDataChange('vcv:layoutColumnResize', (rowId) => {
      this.frames.hide()
    })

    elementsStorage.state('elementAdd').onChange((data) => {
      if (data && data.tag === 'row') {
        this.showChildrenFramesWithDelay(data.id)
      }
    })

    // check remove element
    this.api.on('element:unmount', () => {
      this.findElement()
      this.toggleOutlines()
    })

    // Interact with content
    this.interactWithContent()

    // Interact with tree
    this.interactWithTree()

    layoutStorage.state('interactWithControls').onChange((data) => {
      if (data && data.type === 'mouseEnter') {
        let selector = `[data-vcv-element="${data.vcElementId}"]:not([data-vcv-interact-with-controls="false"])`
        if (data.idSelector) {
          selector = `#${data.idSelector + selector}`
        }
        this.toggleOutlines(selector, data.vcElementId)
      }
      if (data && data.type === 'mouseLeave') {
        this.toggleOutlines()
      }
      if (data && data.type === 'controlClick' && !data.vcControlIsPermanent) {
        this.toggleControls()
        this.toggleElementResize()
        this.toggleOutlines()
        this.frames.hide()
      }
      if (data && data.type === 'mouseEnterContainer') {
        this.closingControls = null
      }
      if (data && data.type === 'mouseLeaveContainer') {
        this.handleControlsMouseLeave(data.vcElementId)
      }
    })

    layoutStorage.state('rightClickMenuActive').onChange(() => {
      this.toggleControls()
      this.toggleElementResize()
    })
  }

  /**
   * Add a delay for controls when mouse leaves controls container
   */
  handleControlsMouseLeave (id) {
    this.closingControls = id
    if (this.closingControlsInterval) {
      clearInterval(this.closingControlsInterval)
      this.closingControlsInterval = null
    }
    this.closingControlsInterval = setInterval(() => {
      if (this.closingControls) {
        this.toggleControls()
        this.toggleElementResize()
        if (this.state.showFrames) {
          this.frames.hide()
        }
        this.closingControls = null
      }
      clearInterval(this.closingControlsInterval)
      this.closingControlsInterval = null
    }, 400)
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

          this.toggleControls()
          this.toggleElementResize()
          if (this.state.showFrames) {
            this.frames.hide()
          }
          this.closingControls = null
        }

        if (this.state.showControls) {
          const element = documentManager.get(data.vcElementId)
          const cookElement = cook.get(element)
          const attribute = cookElement.filter(a => cookElement.settings(a).settings && cookElement.settings(a).settings.type === 'htmleditor')
          if (attribute) {
            const options = cookElement.settings(attribute).settings && cookElement.settings(attribute).settings.options
            if (options && options.inline) {
              data.elementInlineEdit = true
            }
          }
          data.vcvDraggableIds = data.vcElementsPath.filter((id) => {
            const cookElement = cook.getById(id)
            const isDraggable = cookElement.get('metaIsDraggable')
            return isDraggable === undefined || isDraggable
          })
          data.vcvEditableElements = data.vcElementsPath.filter((id) => {
            if (vcCake.env('VCV_ADDON_ROLE_MANAGER_ENABLED') && !roleManager.can('editor_settings_element_lock', roleManager.defaultAdmin())) {
              const cookElement = cook.getById(id)
              const isLocked = cookElement.get('metaIsElementLocked')
              return !isLocked
            } else {
              return id
            }
          })
          this.toggleControls(data)
        }
        if (this.state.showFrames) {
          this.showFrames(data)
        }
        this.toggleElementResize(data)
      }
      if (data && data.type === 'mouseLeave') {
        this.handleControlsMouseLeave(data)
      }
    })
  }

  /**
   * Interact with tree
   */
  interactWithTree () {
    workspaceStorage.state('userInteractWith').onChange((id = false, selector = null) => {
      if ((id || selector) && this.state.showOutline) {
        const querySelector = id ? `[data-vcv-element="${id}"]:not([data-vcv-interact-with-controls="false"])` : selector
        this.toggleOutlines(querySelector, id)
      } else {
        this.toggleOutlines()
      }
    })
  }

  handleScroll () {
    const contentState = layoutStorage.state('interactWithContent')
    if (!contentState.get() || !contentState.get().type || contentState.get().type !== 'scrolling') {
      contentState.set({ type: 'scrolling' })
      this.toggleOutlines()
      this.frames.hide()
      this.toggleControls()
      this.toggleElementResize()
    }

    window.clearTimeout(this.isScrolling)

    this.isScrolling = setTimeout(() => {
      contentState.set(false)
      this.state.prevElement = null
    }, 150)
  }

  /**
   * Show frames with custom path
   */
  showFrames (data) {
    const documentService = vcCake.getService('document')
    let elementsToShow = []
    let elementTag = ''
    data.vcElementsPath.forEach((id, index) => {
      const documentElement = documentService.get(id)
      // Current element will always be 0 indexed
      if (index === 0) {
        elementTag = documentElement.tag
      }
      // Show frames for all except columns
      if (documentElement.tag !== 'column') {
        elementsToShow.push(documentElement.id)
      }
    })
    elementsToShow = elementsToShow.map((id) => {
      const selector = `[data-vcv-element="${id}"]:not([data-vcv-interact-with-controls="false"])`
      return this.iframeDocument.querySelector(selector)
    })
    elementsToShow = elementsToShow.filter((el) => {
      return el
    })
    this.frames.show({ vcElementId: data.vcElementId, path: elementsToShow, tag: elementTag })
  }

  /**
   * Show frames on elements children
   */
  showChildrenFrames (parentId) {
    const documentService = vcCake.getService('document')
    let elementsToShow = []
    const children = documentService.children(parentId)
    children.forEach((child) => {
      elementsToShow.push(child.id)
    })
    elementsToShow = elementsToShow.map((id) => {
      const selector = `[data-vcv-element="${id}"]:not([data-vcv-interact-with-controls="false"])`
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
    const elementsToShow = []
    elementsToShow.push(this.iframeDocument.querySelector(selector))
    this.frames.show({ path: elementsToShow })
  }

  /**
   * Add event listener on documentBody to check if hide controls
   */
  handleFrameLeave () {
    this.state.prevTarget = null
    this.state.prevElement = null
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
    const data = workspaceStorage.state('settings').get()
    if (data && data.elementAccessPoint) {
      if (data.elementAccessPoint.tag === 'row') {
        this.editFormId = data.elementAccessPoint.id
        this.showChildrenFramesWithDelay(this.editFormId)
      } else if (data.elementAccessPoint.tag === 'column') {
        this.editFormId = data.elementAccessPoint.id
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
    this.subscribeToCurrentIframe()
  }
}
