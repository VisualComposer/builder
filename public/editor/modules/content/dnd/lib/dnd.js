import $ from 'jquery'
import _ from 'lodash'
import {getService} from 'vc-cake'
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
  this.dragingElement = null
  this.currentElement = null
  this.placeholder = null
  this.position = null
  this.options = _.defaults(options, {
    cancelMove: false,
    moveCallback: function () {
    },
    startCallback: function () {
    },
    endCallback: function () {
    },
    document: document,
    offsetTop: 0,
    offsetLeft: 0,
    boundariesGap: 6,
    rootContainerFor: ['RootElements'],
    rootID: 'vcv-content-root'
  })
}
Builder.prototype.option = function (name, value) {
  this.options[name] = value
}
Builder.prototype.init = function () {
  this.items[this.options.rootID] = new DOMElement(this.options.rootID, this.container, {
    containerFor: this.options.rootContainerFor,
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
  this.items[ id ] = new DOMElement(id, this.options.document.querySelector('[data-vc-element="' + id + '"]'), {
    containerFor: containerFor ? containerFor.value : null,
    relatedTo: relatedTo ? relatedTo.value : null,
    parent: element.get('parent') || this.options.rootID
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
  if (parentElement && this.dragingElement.isChild(parentElement)) {
    return domElement
  } else if (parentElement) {
    return this.findElementWithValidParent(parentElement)
  }
  return null
}

/**
 * Menage items
 */
Builder.prototype.findDOMNode = function (point) {
  let domNode = this.options.document.elementFromPoint(point.x, point.y)
  if (domNode && !domNode.getAttribute('data-vcv-dnd-element')) {
    domNode = $(domNode).closest('[data-vcv-dnd-element]')
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
    // domElement = this.findElementWithValidParent(this.items[parentDOMElement]) || domElement
    // parentDOMElement = domElement.hasParent() ? this.items[domElement.parent()] : null
  }
  let position = this.placeholder.redraw(domElement.node, point, {
    allowBeforeAfter: parentDOMElement && this.dragingElement.isChild(parentDOMElement),
    allowAppend: domElement && this.dragingElement.isChild(domElement)
  })
  if (position) {
    this.setPosition(position)
    this.currentElement = domElement.id
    this.placeholder.setCurrentElement(domElement.id)
  }
}

Builder.prototype.setPosition = function (position) {
  this.position = position
}
Builder.prototype.start = function (DOMNode) {
  this.dragingElement = DOMNode ? this.items[DOMNode.getAttribute('data-vcv-dnd-element')] : null
  if (!this.dragingElement) {
    this.dragingElement = null
    return false
  }
  // Create helper/clone of element
  this.helper = new Helper(this.dragingElement.node)
  // Add css class for body to enable visual setings for all document
  this.options.document.body.classList.add('vcv-dragstart')

  this.watchMouse()
  this.createPlaceholder()
  if (typeof this.options.startCallback === 'function') {
    this.options.startCallback(this.dragingElement)
  }
  // Set callback on dragend
  this.options.document.addEventListener('mouseup', this.handleDragEndFunction, false)
}
Builder.prototype.end = function () {
  // Remove helper
  this.helper && this.helper.remove()
  // Remove css class for body
  this.options.document.body.classList.remove('vcv-dragstart')

  this.forgetMouse()
  this.removePlaceholder()
  if (typeof this.options.endCallback === 'function') {
    this.options.endCallback(this.dragingElement)
  }
  if (typeof this.options.moveCallback === 'function') {
    this.position && this.options.moveCallback(
      this.dragingElement.id,
      this.position,
      this.currentElement
    )
  }
  this.dragingElement = null
  this.currentElement = null
  this.position = null
  this.helper = null

  // Set callback on dragend
  this.options.document.removeEventListener('mouseup', this.handleDragEndFunction, false)
}
Builder.prototype.check = function (point) {
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
  this.placeholder = new SmartLine(_.pick(this.options, 'document', 'offsetLeft', 'offsetTop'))
}
/**
 * Drag handlers
 */
Builder.prototype.handleDrag = function (e) {
  this.check({ x: e.clientX, y: e.clientY })
}
/**
 * @param {object} e Handled event
 */
Builder.prototype.handleDragStart = function (e) {
  if (e.stopPropagation) {
    e.stopPropagation()
    // e.preventDefault()
  }
  if (e.currentTarget.querySelector('[data-vc-editable-param]')) {
    return false
  }
  this.start(e.currentTarget)
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
