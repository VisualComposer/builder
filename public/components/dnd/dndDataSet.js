import _ from 'lodash'
import { getService, setData, getData, getStorage } from 'vc-cake'
import SmartLine from './smartLine'
import TrashBin from './trashBin'
import Helper from './helper'
import HelperClone from './helperClone'
import Api from './api'
import DOMElement from './domElement'

const documentManager = getService('document')
const cook = getService('cook')
const hubCategories = getService('hubCategories')
const workspaceStorage = getStorage('workspace')

export default class DndDataSet {
  /**
   * Drag&drop builder.
   *
   * @param {string} container DOMNode to use as container
   * @param {Object} options Settings for Dnd builder to define how it should interact with layout
   * @constructor
   */
  constructor (container, options) {
    Object.defineProperties(this, {
      /**
       * @memberOf! DndDataSet
       */
      helper: {
        enumerable: false,
        configurable: false,
        writable: true,
        value: null
      },
      /**
       * @memberOf! DndDataSet
       */
      position: {
        enumerable: false,
        configurable: false,
        writable: true,
        value: null
      },
      /**
       * @memberOf! DndDataSet
       */
      placeholder: {
        enumerable: false,
        configurable: false,
        writable: true,
        value: null
      },
      /**
       * @memberOf! DndDataSet
       */
      currentElement: {
        enumerable: false,
        configurable: false,
        writable: true,
        value: null
      },
      /**
       * @memberOf! DndDataSet
       */
      draggingElement: {
        enumerable: false,
        configurable: false,
        writable: true,
        value: null
      },
      /**
       * @memberOf! DndDataSet
       */
      point: {
        enumerable: false,
        configurable: false,
        writable: true,
        value: null
      },
      /**
       * @memberOf! DndDataSet
       */
      hover: {
        enumerable: false,
        configurable: false,
        writable: true,
        value: ''
      },
      /**
       * @memberOf! DndDataSet
       */
      container: {
        enumerable: false,
        configurable: false,
        writable: false,
        value: container
      },
      /**
       * @memberOf! DndDataSet
       */
      manualScroll: {
        enumerable: false,
        configurable: false,
        writable: true,
        value: false
      },
      /**
       * @memberOf! DndDataSet
       */
      options: {
        enumerable: false,
        configurable: false,
        writable: false,
        value: _.defaults(options, {
          cancelMove: false,
          moveCallback: function () {
          },
          dropCallback: function () {
          },
          startCallback: function () {
          },
          endCallback: function () {
          },
          window: window,
          document: document,
          container: document.body,
          wrapper: null,
          boundariesGap: 10,
          rootContainerFor: [ 'RootElements' ],
          rootID: 'vcv-content-root',
          handler: null,
          ignoreHandling: null,
          disabled: false,
          helperType: null,
          manualScroll: false,
          drop: false,
          allowMultiNodes: false,
          enableTrashBin: (options && options.container && options.container.id === 'vcv-editor-iframe-overlay') || false,
          customScroll: false,
          scrollContainer: null,
          scrollCallback: function () {
          },
          isAttribute: false,
          disableMobile: false,
          isIframe: (options && options.container && options.container.id === 'vcv-editor-iframe-overlay') || false
        })
      }
    })

    this.api = new Api(this)
  }

  option (name, value) {
    this.options[ name ] = value
  }

  init () {
    const root = new DOMElement(this.options.rootID, this.container, {
      containerFor: this.options.rootContainerFor
    })
    this.handleDragFunction = this.handleDrag.bind(this)
    this.handleMobileCancelDragFunction = this.handleMobileCancelDrag.bind(this)
    this.handleDragStartFunction = this.handleDragStart.bind(this)
    this.handleMobileDragStartFunction = this.handleMobileDragStart.bind(this)
    this.handleDragEndFunction = this.handleDragEnd.bind(this)
    this.handleRightMouseClickFunction = this.handleRightMouseClick.bind(this)
    root.refresh()
    if (this.options.enableTrashBin && this.options.isIframe) {
      this.trash = new TrashBin({
        ..._.pick(this.options, 'document', 'container'),
        handleDrag: this.handleDragFunction,
        handleDragEnd: this.handleDragEndFunction
      })
    }
  }

  addItem (id) {
    if (!documentManager.get(id)) { return }
    if (this.options.allowMultiNodes) {
      let domNodes = this.container.querySelectorAll('[data-vcv-element="' + id + '"]')
      domNodes = Array.prototype.slice.call(domNodes)
      domNodes.forEach((domNode) => {
        if (domNode && domNode.ELEMENT_NODE) {
          this.buildNodeElement(domNode, id)
        }
      })
    } else {
      let domNode = this.container.querySelector('[data-vcv-element="' + id + '"]')
      if (domNode && domNode.ELEMENT_NODE) {
        this.buildNodeElement(domNode, id)
      }
    }
  }

  dOMElementCreate (domNode, id) {
    if (id === this.options.rootID) {
      return new DOMElement(this.options.rootID, this.container, {
        containerFor: this.options.rootContainerFor
      })
    }
    let element = cook.get(documentManager.get(id))
    if (!element) { return null }
    const containerFor = element.get('containerFor')
    const relatedTo = element.get('relatedTo')
    return new DOMElement(id, domNode, {
      containerFor: containerFor ? containerFor.value : null,
      relatedTo: relatedTo ? relatedTo.value : null,
      parent: element.get('parent') || this.options.rootID,
      handler: this.options.handler,
      tag: element.get('tag'),
      iconLink: hubCategories.getElementIcon(element.get('tag'))
    })
  }

  buildNodeElement (domNode, id) {
    const dOMElement = this.dOMElementCreate(domNode, id)
    dOMElement
      .on('dragstart', (e) => { e.preventDefault() })
      .on('mousedown', this.handleDragStartFunction)
      .on('mousedown', this.handleDragFunction)

    if (!this.options.disableMobile) {
      dOMElement
        .on('touchstart', this.handleMobileDragStartFunction)
        .on('touchmove', this.handleMobileCancelDragFunction)
        .on('touchend', this.handleMobileCancelDragFunction)
    }
  }

  updateItem (id) {
    this.addItem(id)
  }

  removeItem (id) {
  }

  removePlaceholder () {
    if (this.placeholder !== null) {
      this.placeholder.remove()
      this.placeholder = null
    }
  }

  getDomElement (domNode) {
    if (!domNode || !domNode.ELEMENT_NODE) {
      return null
    }
    const elementID = domNode.dataset.vcvDndElement || domNode.dataset.vcvDndElementHandler
    return this.dOMElementCreate(domNode, elementID)
  }

  getDomElementParent (id) {
    let domNode = this.container.querySelector(`[data-vcv-dnd-element="${id}"]:not([data-vcv-dnd-helper="true"])`)
    if (id === 'vcv-content-root') {
      domNode = this.container
    }
    return this.getDomElement(domNode)
  }

  findElementWithValidParent (domElement) {
    let parentElement = domElement.parent() ? this.getDomElementParent(domElement.parent()) : null
    if (parentElement && this.draggingElement.isChild(parentElement)) {
      return domElement
    } else if (parentElement) {
      return this.findElementWithValidParent(parentElement)
    }
    return null
  }

  isDraggingElementParent (domElement) {
    return domElement.$node.parents('[data-vcv-dnd-element="' + this.draggingElement.id + '"]').length > 0
  }

  findDOMNode (point) {
    let domNode = this.options.document.elementFromPoint(point.x, point.y)
    const domNodeAttr = domNode && domNode.getAttribute('data-vcv-dnd-element')
    const domNodeDomElementAttr = domNode && domNode.getAttribute('data-vcv-dnd-dom-element')
    const domNodeDomElement = window.jQuery(domNode).closest(`.${domNodeDomElementAttr}`).get(0)

    if (domNode && !domNodeAttr) {
      domNode = window.jQuery(domNode).closest('[data-vcv-dnd-element]:not([data-vcv-dnd-element="vcv-content-root"])').get(0)
    }

    if (domNode && domNodeAttr && domNodeAttr === 'vcv-content-root') {
      const domElement = this.getDomElement(domNode)
      if (!this.draggingElement.relatedTo(domElement.containerFor())) {
        domNode = null
      }
    }
    if (domNode && domNodeDomElement) {
      domNode = domNodeDomElement
    }
    return domNode || null
  }

  checkTrashBin ({ x, y, left = 0, top = 0 }) {
    let iframeParent = this.options && this.options.container && this.options.container.parentNode ? this.options.container.parentNode : null
    if (iframeParent) {
      x += iframeParent.offsetLeft
      y += iframeParent.offsetTop
    }
    let domNode = document.elementFromPoint(x - left, y - top)
    if (domNode && domNode.id === 'vcv-dnd-trash-bin') {
      return window.jQuery(domNode).get(0)
    }
    return null
  }

  checkBlankRow ({ x, y }) {
    const domNode = this.options.document.elementFromPoint(x, y)
    return domNode && window.jQuery(domNode).closest('#vcv-ui-blank-row').get(0)
  }

  checkHFS ({ x, y }) {
    const domNode = this.options.document.elementFromPoint(x, y)
    return domNode && window.jQuery(domNode).closest('[data-vcv-layout-zone]').get(0)
  }

  checkItems (point) {
    let trashBin = this.checkTrashBin(point)
    let blankRow = this.checkBlankRow(point)
    let hfs = this.checkHFS(point)

    if (blankRow) {
      let position = this.placeholder && this.placeholder.redraw(blankRow, point)
      if (position) {
        this.setPosition(position)
      }
      this.currentElement = 'vcv-ui-blank-row'
      this.removeHFSActive()
      this.setMouseOverStartBlank()
    } else if (trashBin) {
      this.trash && this.trash.setActive()
      this.placeholder && this.placeholder.clearStyle()
      this.placeholder && this.placeholder.setPoint(point)
      this.helper && this.helper.setOverTrash && this.helper.setOverTrash()
      this.currentElement = 'vcv-dnd-trash-bin'
      this.removeHFSActive()
      this.removeMouseOverStartBlank()
    } else if (hfs) {
      hfs.classList.add('vcv-drag-helper-over-hfs')
      this.removeMouseOverStartBlank()
    } else {
      this.trash && this.trash.removeActive()

      if (this.currentElement === 'vcv-dnd-trash-bin') {
        this.currentElement = null
      }
      this.helper && this.helper.removeOverTrash && this.helper.removeOverTrash()
      let domNode = this.findDOMNode(point)
      let domElement = this.getDomElement(domNode)
      if (!domElement) {
        return
      }
      let parentDOMElement = this.getDomElementParent(domElement.parent()) || null
      if (domElement.isNearBoundaries(point, this.options.boundariesGap) && parentDOMElement && parentDOMElement.id !== this.options.rootID) {
        domElement = this.findElementWithValidParent(parentDOMElement) || domElement
        parentDOMElement = this.getDomElementParent(domElement.parent()) || null
      }
      if (this.isDraggingElementParent(domElement)) {
        return
      }
      let afterLastContainerElement = false
      let allowApend = !documentManager.children(domElement.id).length
      if (!allowApend && domElement.node && domElement.node.classList && domElement.node.dataset.vcvDndElementExpandStatus === 'closed') {
        allowApend = true
      }

      this.removeHFSActive()
      this.removeMouseOverStartBlank()

      if (domElement.id === this.options.rootID) {
        const lastContainerElementId = domElement.$node.children('[data-vcv-dnd-element]').last().attr('data-vcv-dnd-element')
        if (lastContainerElementId) {
          domNode = this.container.querySelector(`[data-vcv-dnd-element="${lastContainerElementId}"]:not([data-vcv-dnd-helper="true"])`)
          domElement = this.getDomElement(domNode)
          domElement && (afterLastContainerElement = true)
        } else {
          domElement = null
        }
      }

      let position = this.placeholder.redraw(domElement.node, point, {
        attribute: this.options.isAttribute,
        afterLastContainerElement,
        allowBeforeAfter: parentDOMElement && this.draggingElement.isChild(parentDOMElement),
        allowAppend: !afterLastContainerElement && !this.isDraggingElementParent(domElement) &&
        domElement && this.draggingElement.isChild(domElement) &&
        allowApend &&
        !domElement.node.dataset.vceTab &&
        ((domElement.options.tag === 'tab') ? domElement.node.dataset.vcvActive === 'true' : true)
      })

      if (position) {
        this.point = point
        this.setPosition(position)
        this.currentElement = domElement.id
        this.placeholder.setCurrentElement(domElement.id)
      }
    }
  }

  setPosition (position) {
    this.position = position
  }

  setMouseOverStartBlank () {
    this.options.document.querySelector('#vcv-ui-blank-row').classList.add('vcv-drag-helper-over-blank-row')
  }

  removeMouseOverStartBlank () {
    this.options.document.querySelector('#vcv-ui-blank-row').classList.remove('vcv-drag-helper-over-blank-row')
  }

  removeHFSActive () {
    const hfsElements = [].slice.call(this.options.document.querySelectorAll('[data-vcv-layout-zone]'))
    if (hfsElements.length) {
      hfsElements.forEach((item) => {
        item.classList.remove('vcv-drag-helper-over-hfs')
      })
    }
  }

  start (id, point, tag, domNode, disableTrashBin = false) {
    if (!disableTrashBin) {
      this.trashBinTimeout = setTimeout(() => {
        this.trashBinTimeout = null
        this.trash && this.trash.create()
      }, 300)
    }
    if (!this.dragStartHandled) {
      this.dragStartHandled = true
    }
    if (id && tag) {
      this.draggingElement = this.createDraggingElementFromTag(tag, domNode)
    } else {
      this.draggingElement = this.getDomElement(domNode)
      this.options.drop = false
      if (!this.draggingElement) {
        this.dragStartHandled = false
        this.draggingElement = null
        return false
      }
    }

    this.options.document.addEventListener('mousedown', this.handleRightMouseClickFunction, false)
    this.options.document.addEventListener('mouseup', this.handleDragEndFunction, false)
    this.options.document.addEventListener('touchend', this.handleDragEndFunction, false)
    // Create helper/clone of element
    if (this.options.helperType === 'clone') {
      this.helper = new HelperClone(this.draggingElement.node.closest('[data-vcv-element]'), point)
    } else {
      this.helper = new Helper(this.draggingElement, {
        container: this.options.container,
        wrapper: this.options.isIframe && this.options.wrapper
      })
    }

    // Add css class for body to enable visual settings for all document
    this.options.document.body.classList.add('vcv-dnd-dragging--start', 'vcv-is-no-selection')

    this.watchMouse()
    this.createPlaceholder()
    this.scrollEvent = () => {
      if (this.placeholder) {
        this.placeholder.clearStyle()
        this.placeholder.setPoint(0, 0)
      }
      this.check(this.point || {})
    }
    this.options.document.addEventListener('scroll', this.scrollEvent)
    if (typeof this.options.startCallback === 'function') {
      this.options.startCallback(this.draggingElement)
    }
    window.setTimeout(() => {
      this.helper && this.helper.show()
    }, 200)

    this.dragStartedAt = (new Date()).getTime()
  }

  createDraggingElementFromTag (tag, domNode) {
    let element = cook.get({ tag: tag })
    if (!element) { return }
    let containerFor = element.get('containerFor')
    let relatedTo = element.get('relatedTo')
    return new DOMElement('dropElement', domNode, {
      containerFor: containerFor ? containerFor.value : null,
      relatedTo: relatedTo ? relatedTo.value.concat([ 'RootElements' ]) : null,
      parent: this.options.rootID,
      handler: this.options.handler,
      tag: element.get('tag'),
      iconLink: hubCategories.getElementIcon(element.get('tag'))
    })
  }

  end () {
    let dragEndedAt = (new Date()).getTime()
    let dragStartedAt = this.dragStartedAt
    this.dragStartedAt = null
    // Remove helper
    this.helper && this.helper.remove()
    // Remove css class for body
    this.options.document.body.classList.remove('vcv-dnd-dragging--start', 'vcv-is-no-selection')
    // Remove trash bin
    if (this.trashBinTimeout) {
      clearTimeout(this.trashBinTimeout)
      this.trashBinTimeout = null
    }
    this.trash && this.trash.remove()
    if (!this.position && this.currentElement === 'vcv-dnd-trash-bin') {
      this.position = 'after'
    }
    this.forgetMouse()
    this.removePlaceholder()
    this.options.document.removeEventListener('scroll', this.scrollEvent)
    this.point = null
    this.options.manualScroll = false
    if (typeof this.options.endCallback === 'function') {
      this.options.endCallback(this.draggingElement)
    }
    const isValidLayoutCustomMode = getData('vcv:layoutCustomMode') === 'dnd'

    // prevent quick multiple click
    if (dragEndedAt - dragStartedAt > 250) {
      if (this.options.drop === true && this.draggingElement && typeof this.options.dropCallback === 'function') {
        this.position && this.options.dropCallback(
          this.draggingElement.id,
          this.position,
          this.currentElement,
          this.draggingElement
        )
        if (!this.position) {
          workspaceStorage.state('drag').set({ terminate: true })
        }
      } else if (isValidLayoutCustomMode && this.draggingElement && typeof this.options.moveCallback === 'function' && this.draggingElement.id !== this.currentElement) {
        this.position && this.options.moveCallback(
          this.draggingElement.id,
          this.position,
          this.currentElement
        )
      }
    }
    this.draggingElement = null
    this.currentElement = null
    this.position = null
    this.helper = null
    this.startPoint = null
    if (getData('vcv:layoutCustomMode') !== 'contentEditable' && getData('vcv:layoutCustomMode') !== 'columnResizer' && getData('vcv:layoutCustomMode') !== null) {
      setData('vcv:layoutCustomMode', null)
    }
    // Set callback on dragEnd
    this.options.document.removeEventListener('mouseup', this.handleDragEndFunction, false)
    this.options.document.removeEventListener('touchend', this.handleDragEndFunction, false)
  }

  scrollManually (point) {
    let body = this.options.isIframe ? this.options.window : this.options.document.body
    let clientHeight = this.options.document.documentElement.clientHeight
    let top = null
    let speed = 30
    let gap = 10
    let bodyTop = this.options.isIframe ? body.scrollY : body.scrollTop
    if (clientHeight - gap <= point.y - point.top) {
      top = bodyTop + speed
    } else if (point.y - point.top <= gap && bodyTop >= speed) {
      top = bodyTop - speed
    }
    if (top !== null) {
      this.options.isIframe ? body.scroll(0, top) : body.scrollTop = top > 0 ? top : 0
    }
  }

  check (point = null) {
    if (this.options.disabled === true) {
      this.handleDragEnd()
      return
    }
    if (this.draggingElement && getData('vcv:layoutCustomMode') !== 'dnd') {
      setData('vcv:layoutCustomMode', 'dnd')
    }
    this.options.manualScroll && this.scrollManually(point)
    if (this.dragStartHandled) {
      this.options.customScroll && this.options.scrollCallback(point)
    }
    window.setTimeout(() => {
      if (!this.startPoint) {
        this.startPoint = point
      }
    }, 0)
    this.helper && this.helper.setPosition(point)
    this.placeholder && this.checkItems(point)
  }

  // Mouse events
  watchMouse () {
    this.options.document.addEventListener('mousemove', this.handleDragFunction, false)
    this.options.document.addEventListener('touchmove', this.handleDragFunction, false)
  }

  forgetMouse () {
    this.options.document.removeEventListener('mousemove', this.handleDragFunction, false)
    this.options.document.removeEventListener('touchmove', this.handleDragFunction, false)
  }

  createPlaceholder () {
    this.placeholder = new SmartLine(_.pick(this.options, 'document', 'container'))
  }

  /**
   * Drag handlers
   */
  handleDrag (e, offsetX = 0, offsetY = 0) {
    // disable dnd on right button click
    if (e.button && e.button === 2) {
      this.handleDragEnd()
      return false
    }
    let scrollX = this.options.isIframe && this.options.wrapper && this.options.wrapper.scrollLeft ? this.options.wrapper.scrollLeft : 0
    let scrollY = this.options.isIframe && this.options.wrapper && this.options.wrapper.scrollTop ? this.options.wrapper.scrollTop : 0
    if (e.touches && e.touches[ 0 ] && this.dragStartHandled) {
      e.preventDefault()
      e.touches[ 0 ].clientX !== undefined && e.touches[ 0 ].clientY !== undefined && this.check({ x: e.touches[ 0 ].clientX - offsetX, y: e.touches[ 0 ].clientY - offsetY, left: scrollX, top: scrollY })
    } else {
      e.clientX !== undefined && e.clientY !== undefined && this.check({ x: e.clientX - offsetX, y: e.clientY - offsetY, left: scrollX, top: scrollY })
    }
  }

  handleMobileCancelDrag (e) {
    if (this.startDragTimeout) {
      clearTimeout(this.startDragTimeout)
      this.startDragTimeout = null
    } else {
      this.handleDrag(e)
    }
  }

  /**
   * @param {object} e Handled event
   */
  handleDragStart (e) {
    if (this.options.disabled === true || this.dragStartHandled) { // hack not to use stopPropogation
      return
    }
    if (this.options.ignoreHandling && window.jQuery(e.currentTarget).is(this.options.ignoreHandling)) {
      return
    }
    if (e.which > 1) {
      return
    }
    let scrollX = this.options.isIframe && this.options.wrapper && this.options.wrapper.scrollLeft ? this.options.wrapper.scrollLeft : 0
    let scrollY = this.options.isIframe && this.options.wrapper && this.options.wrapper.scrollTop ? this.options.wrapper.scrollTop : 0
    let id = e.currentTarget.getAttribute('data-vcv-dnd-element-handler')
    if (e.touches && e.touches[ 0 ]) {
      e.preventDefault()
      this.start(id, { x: e.touches[ 0 ].clientX, y: e.touches[ 0 ].clientY, left: scrollX, top: scrollY }, null, e.currentTarget)
    } else {
      this.start(id, { x: e.clientX, y: e.clientY, left: scrollX, top: scrollY }, null, e.currentTarget)
    }
  }

  handleMobileDragStart (e) {
    if (this.options.disabled === true || this.dragStartHandled) { // hack not to use stopPropogation
      return
    }
    if (this.options.ignoreHandling && window.jQuery(e.currentTarget).is(this.options.ignoreHandling)) {
      return
    }
    if (e.which > 1) {
      return
    }
    let id = e.currentTarget.getAttribute('data-vcv-dnd-element-handler')
    if (e.touches && e.touches[ 0 ]) {
      this.startDragTimeout = setTimeout(() => {
        this.startDragTimeout = null
        e.preventDefault()
        this.start(id, { x: e.touches[ 0 ].clientX, y: e.touches[ 0 ].clientY }, null, this.findDOMNode({ x: e.touches[ 0 ].clientX, y: e.touches[ 0 ].clientY }))
      }, 450)
    }
  }

  handleDragEnd () {
    this.dragStartHandled = false
    this.options.customScroll && this.options.scrollCallback({ end: true })
    this.end()
  }

  handleRightMouseClick (e) {
    if (e.button && e.button === 2) {
      this.options.document.removeEventListener('mousedown', this.handleRightMouseClickFunction, false)
      this.handleDragEnd()
    }
  }
}
