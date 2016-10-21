import $ from 'jquery'
import _ from 'lodash'
import {getService} from 'vc-cake'
import SmartLine from './smart-line'
import Helper from './helper'
import Api from './api'
import DOMElement from './dom-element'

const documentManager = getService('document')
const cook = getService('cook')

export default class DnD {
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
       * @memberOf! DnD
       */
      helper: {
        enumerable: false,
        configurable: false,
        writable: true,
        value: null
      },
      /**
       * @memberOf! DnD
       */
      position: {
        enumerable: false,
        configurable: false,
        writable: true,
        value: null
      },
      /**
       * @memberOf! DnD
       */
      placeholder: {
        enumerable: false,
        configurable: false,
        writable: true,
        value: null
      },
      /**
       * @memberOf! DnD
       */
      currentElement: {
        enumerable: false,
        configurable: false,
        writable: true,
        value: null
      },
      /**
       * @memberOf! DnD
       */
      draggingElement: {
        enumerable: false,
        configurable: false,
        writable: true,
        value: null
      },
      /**
       * @memberOf! DnD
       */
      point: {
        enumerable: false,
        configurable: false,
        writable: true,
        value: null
      },
      /**
       * @memberOf! DnD
       */
      hover: {
        enumerable: false,
        configurable: false,
        writable: true,
        value: ''
      },
      /**
       * @memberOf! DnD
       */
      items: {
        enumerable: false,
        configurable: false,
        writable: true,
        value: {}
      },
      /**
       * @memberOf! DnD
       */
      container: {
        enumerable: false,
        configurable: false,
        writable: false,
        value: container
      },
      /**
       * @memberOf! DnD
       */
      options: {
        enumerable: false,
        configurable: false,
        writable: false,
        value: _.defaults(options, {
          cancelMove: false,
          moveCallback: function () {
          },
          startCallback: function () {
          },
          endCallback: function () {
          },
          document: document,
          container: document.body,
          boundariesGap: 10,
          rootContainerFor: ['RootElements'],
          rootID: 'vcv-content-root',
          handler: null,
          disabled: false
        })
      }
    })
  }
  static api (dnd) {
    return new Api(dnd)
  }
  option (name, value) {
    this.options[name] = value
  }
  init () {
    this.items[this.options.rootID] = new DOMElement(this.options.rootID, this.container, {
      containerFor: this.options.rootContainerFor
    })
    this.handleDragFunction = this.handleDrag.bind(this)
    this.handleDragStartFunction = this.handleDragStart.bind(this)
    this.handleDragEndFunction = this.handleDragEnd.bind(this)
    this.handleRightMouseClickFunction = this.handleRightMouseClick.bind(this)
  }
  addItem (id) {
    let element = cook.get(documentManager.get(id))
    if (!element) { return }
    let containerFor = element.get('containerFor')
    let relatedTo = element.get('relatedTo')
    let domNode = this.options.document.querySelector('[data-vcv-element="' + id + '"]')
    if (!domNode || !domNode.ELEMENT_NODE) { return }
    this.items[ id ] = new DOMElement(id, domNode, {
      containerFor: containerFor ? containerFor.value : null,
      relatedTo: relatedTo ? relatedTo.value : null,
      parent: element.get('parent') || this.options.rootID,
      handler: this.options.handler,
      tag: element.get('tag')
    })
      .on('dragstart', function (e) { e.preventDefault() })
      .on('mousedown', this.handleDragStartFunction)
      .on('mousedown', this.handleDragFunction)
  }
  removeItem (id) {
    this.items[ id ]
      .off('mousedown', this.handleDragStartFunction)
      .off('mousedown', this.handleDragFunction)
    delete this.items[ id ]
  }
  removePlaceholder () {
    if (this.placeholder !== null) {
      this.placeholder.remove()
      this.placeholder = null
    }
  }
  findElementWithValidParent (domElement) {
    var parentElement = domElement.parent() ? this.items[domElement.parent()] : null
    if (parentElement && this.draggingElement.isChild(parentElement)) {
      return domElement
    } else if (parentElement) {
      return this.findElementWithValidParent(parentElement)
    }
    return null
  }
  isDraggingElementParent (domElement) {
    return domElement.$node.closest('[data-vcv-dnd-element="' + this.draggingElement.id + '"]').length > 0
  }
  findDOMNode (point) {
    let domNode = this.options.document.elementFromPoint(point.x, point.y)
    if (domNode && !domNode.getAttribute('data-vcv-dnd-element')) {
      domNode = $(domNode).closest('[data-vcv-dnd-element]').get(0)
    }
    return domNode || null
  }
  checkItems (point) {
    let domNode = this.findDOMNode(point)
    if (!domNode || !domNode.ELEMENT_NODE) { return }
    let domElement = this.items[domNode.getAttribute('data-vcv-dnd-element')]
    if (!domElement) { return }
    let parentDOMElement = this.items[domElement.parent()] || null
    if (domElement.isNearBoundaries(point, this.options.boundariesGap) && parentDOMElement && parentDOMElement.id !== this.options.rootID) {
      domElement = this.findElementWithValidParent(parentDOMElement) || domElement
      parentDOMElement = this.items[domElement.parent()] || null
    }
    if (this.isDraggingElementParent(domElement)) { return }
    let position = this.placeholder.redraw(domElement.node, point, {
      allowBeforeAfter: parentDOMElement && this.draggingElement.isChild(parentDOMElement),
      allowAppend: domElement && this.draggingElement.isChild(domElement)
    })
    if (position) {
      this.point = point
      this.setPosition(position)
      this.currentElement = domElement.id
      this.placeholder.setCurrentElement(domElement.id)
    }
  }
  setPosition (position) {
    this.position = position
  }
  start (id, point) {
    this.draggingElement = id ? this.items[id] : null
    if (!this.draggingElement) {
      this.draggingElement = null
      return false
    }
    this.options.document.addEventListener('mousedown', this.handleRightMouseClickFunction, false)
    this.options.document.addEventListener('mouseup', this.handleDragEndFunction, false)
    // Create helper/clone of element
    this.helper = new Helper(this.draggingElement, {
      container: this.options.container
    })
    // Add css class for body to enable visual settings for all document
    this.options.document.body.classList.add('vcv-dnd-dragging--start', 'vcv-is-no-selection')

    this.watchMouse()
    this.createPlaceholder()
    this.scrollEvent = () => {
      this.placeholder.clearStyle()
      this.placeholder.setPoint(0, 0)
      this.check(this.point || {})
    }
    this.options.document.addEventListener('scroll', this.scrollEvent)
    if (typeof this.options.startCallback === 'function') {
      this.options.startCallback(this.draggingElement)
    }
    window.setTimeout(() => {
      this.helper && this.helper.show()
    }, 200)
  }
  end () {
    // Remove helper
    this.helper && this.helper.remove()
    // Remove css class for body
    this.options.document.body.classList.remove('vcv-dnd-dragging--start', 'vcv-is-no-selection')

    this.forgetMouse()
    this.removePlaceholder()
    this.options.document.removeEventListener('scroll', this.scrollEvent)
    this.point = null
    if (typeof this.options.endCallback === 'function') {
      this.options.endCallback(this.draggingElement)
    }
    if (typeof this.options.moveCallback === 'function') {
      this.position && this.options.moveCallback(
        this.draggingElement.id,
        this.position,
        this.currentElement
      )
    }
    this.draggingElement = null
    this.currentElement = null
    this.position = null
    this.helper = null
    this.startPoint = null
    // setData('vcv:layoutMode', 'view')
    // Set callback on dragEnd
    this.options.document.removeEventListener('mouseup', this.handleDragEndFunction, false)
  }
  check (point = null) {
    if (this.options.disabled === true) {
      this.handleDragEnd()
      return
    }
    window.setTimeout(() => {
      if (!this.startPoint) {
        this.startPoint = point
      } else {
        // setData('vcv:layoutMode', 'dnd')
      }
    }, 0)
    this.helper && this.helper.setPosition(point)
    this.placeholder && this.checkItems(point)
  }

  // Mouse events
  watchMouse () {
    this.options.document.body.addEventListener('mousemove', this.handleDragFunction, false)
  }
  forgetMouse () {
    this.options.document.body.removeEventListener('mousemove', this.handleDragFunction, false)
  }
  createPlaceholder () {
    this.placeholder = new SmartLine(_.pick(this.options, 'document', 'container'))
  }
  /**
   * Drag handlers
   */
  handleDrag (e) {
    e.clientX !== undefined && e.clientY !== undefined && this.check({ x: e.clientX, y: e.clientY })
  }
  /**
   * @param {object} e Handled event
   */
  handleDragStart (e) {
    if (this.options.disabled === true || this.dragStartHandled) { // hack not to use stopPropogation
      return
    }
    if (!this.dragStartHandled) {
      this.dragStartHandled = true
    }
    if (e.which > 1) {
      return
    }
    let id = e.currentTarget.getAttribute('data-vcv-dnd-element-handler')
    this.start(id, { x: e.clientX, y: e.clientY })
  }
  handleDragEnd () {
    this.dragStartHandled = false
    this.end()
  }
  handleRightMouseClick (e) {
    if (e.button && e.button === 2) {
      this.options.document.removeEventListener('mousedown', this.handleRightMouseClickFunction, false)
      this.handleDragEnd()
    }
  }
}
