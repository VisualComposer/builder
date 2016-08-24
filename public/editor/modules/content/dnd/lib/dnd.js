import $ from 'jquery'
import _ from 'lodash'
import {getService, getData} from 'vc-cake'
import SmartLine from './smart-line'
import Helper from './helper'
import DOMElement from './dom-element'

const documentManager = getService('document')
const cook = getService('cook')
/**
 * Drag&drop builder.
 *
 * @param {string} container DOMNode to use as container
 * @param {Object} options Settings for Dnd builder to define how it should interact with layout
 * @constructor
 */
var Builder = function (container, options) {
  this.container = container
  this.items = {}
  this.hover = ''
  this.point
  this.draggingElement = null
  this.currentElement = null
  this.placeholder = null
  this.position = null
  Object.defineProperty(this, 'options', {
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
  })
}
Builder.prototype.option = function (name, value) {
  this.options[name] = value
}
Builder.prototype.init = function () {
  this.items[this.options.rootID] = new DOMElement(this.options.rootID, this.container, {
    containerFor: this.options.rootContainerFor
  })
  this.handleDragFunction = this.handleDrag.bind(this)
  this.handleDragStartFunction = this.handleDragStart.bind(this)
  this.handleDragEndFunction = this.handleDragEnd.bind(this)
}
Builder.prototype.addItem = function (id) {
  let element = cook.get(documentManager.get(id))
  if (!element) { return }
  let containerFor = element.get('containerFor')
  let relatedTo = element.get('relatedTo')
  let domNode = this.options.document.querySelector('[data-vc-element="' + id + '"]')
  if (!domNode || !domNode.ELEMENT_NODE) { return }
  this.items[ id ] = new DOMElement(id, domNode, {
    containerFor: containerFor ? containerFor.value : null,
    relatedTo: relatedTo ? relatedTo.value : null,
    parent: element.get('parent') || this.options.rootID,
    handler: this.options.handler
  })
    .on('dragstart', function (e) { e.preventDefault() })
    .on('mousedown', this.handleDragStartFunction)
    .on('mousedown', this.handleDragFunction)
}
Builder.prototype.removeItem = function (id) {
  this.items[ id ]
    .off('mousedown', this.handleDragStartFunction)
    .off('mousedown', this.handleDragFunction)
  delete this.items[ id ]
}
Builder.prototype.removePlaceholder = function () {
  if (this.placeholder !== null) {
    this.placeholder.remove()
    this.placeholder = null
  }
}
Builder.prototype.findElementWithValidParent = function (domElement) {
  var parentElement = domElement.parent() ? this.items[domElement.parent()] : null
  if (parentElement && this.draggingElement.isChild(parentElement)) {
    return domElement
  } else if (parentElement) {
    return this.findElementWithValidParent(parentElement)
  }
  return null
}
Builder.prototype.isDraggingElementParent = function (domElement) {
  return domElement.$node.closest('[data-vcv-dnd-element="' + this.draggingElement.id + '"]').length > 0
}
/**
 * Menage items
 */
Builder.prototype.findDOMNode = function (point) {
  let domNode = this.options.document.elementFromPoint(point.x, point.y)
  if (domNode && !domNode.getAttribute('data-vcv-dnd-element')) {
    domNode = $(domNode).closest('[data-vcv-dnd-element]').get(0)
  }
  return domNode || null
}

Builder.prototype.checkItems = function (point) {
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

Builder.prototype.setPosition = function (position) {
  this.position = position
}
Builder.prototype.start = function (id, point) {
  this.options.document.addEventListener('mouseup', this.handleDragEndFunction, false)
  this.draggingElement = id ? this.items[id] : null
  if (!this.draggingElement) {
    this.draggingElement = null
    return false
  }
  // Create helper/clone of element
  this.helper = new Helper(this.draggingElement.node, point)
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
  window.setTimeout(() => { this.helper && this.helper.show() }, 200)
}
Builder.prototype.end = function () {
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

  // Set callback on dragEnd
  this.options.document.removeEventListener('mouseup', this.handleDragEndFunction, false)
}
Builder.prototype.check = function (point = null) {
  this.helper && this.helper.setPosition(point)
  this.placeholder && this.checkItems(point)
}

// Mouse events
Builder.prototype.watchMouse = function () {
  this.options.document.body.addEventListener('mousemove', this.handleDragFunction, false)
}
Builder.prototype.forgetMouse = function () {
  this.options.document.body.removeEventListener('mousemove', this.handleDragFunction, false)
}
Builder.prototype.createPlaceholder = function () {
  this.placeholder = new SmartLine(_.pick(this.options, 'document', 'container'))
}
/**
 * Drag handlers
 */
Builder.prototype.handleDrag = function (e) {
  getData('vcv-dnd-disabled') !== true && this.check({ x: e.clientX, y: e.clientY })
}
/**
 * @param {object} e Handled event
 */
Builder.prototype.handleDragStart = function (e) {
  if (e.stopPropagation) {
    e.stopPropagation()
    // e.preventDefault()
  }
  if (e.which > 1) {
    return
  }
  let id = e.currentTarget.getAttribute('data-vcv-dnd-element-handler')
  this.start(id, { x: e.clientX, y: e.clientY })
}
Builder.prototype.handleDragEnd = function (e) {
  if (e.stopPropagation) {
    e.stopPropagation()
  }
  this.end()
}

/**
 * Global Constructor
 * @type {Builder}
 */
module.exports = Builder
