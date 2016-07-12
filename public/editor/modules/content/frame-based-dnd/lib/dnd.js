import Item from './item'
import SmartLine from './smart-line'
import Helper from './helper'
import DOMElement from './dom-element'
import $ from 'jquery'
import _ from 'lodash'

/**
 * Drag&drop builder.
 *
 * @param {string} container DOMNode to use as container
 * @param {Object} options Settings for Dnd builder to define how it should interact with layout
 * @constructor
 */
var Builder = function (container, options) {
  /**
   * Container to work with
   * @type {DOMNode}
   */
  this.container = container
  this.items = {}
  this.hover = ''
  this.dragingElement = null
  this.dragingElementObject = null
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
    boundariesGap: 6
  })
}
Builder.prototype.option = function (name, value) {
  this.options[name] = value
}
Builder.prototype.init = function () {
  this.handleDragFunction = this.handleDrag.bind(this)
  this.handleDragStartFunction = this.handleDragStart.bind(this)
  this.handleDragEndFunction = this.handleDragEnd.bind(this)
}
Builder.prototype.addItem = function (id) {
  this.items[ id ] = new Item(id, this.options.document)
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
Builder.prototype.findValidParent = function (domElement) {
  if (this.dragingElement.isChild(domElement)) {
    return domElement
  } else if (domElement.hasParent()) {
    return this.findValidParent(domElement.parent())
  }
  return null
}
/**
 * Menage items
 */

Builder.prototype.checkItems = function (point) {
  let DOMNode = this.options.document.elementFromPoint(point.x, point.y)
  if (DOMNode && !DOMNode.getAttribute('data-vc-element')) {
    DOMNode = $(DOMNode).closest('[data-vc-element]').get(0)
  }
  let domElement = new DOMElement(DOMNode, this.options.document)
  if (domElement.isElement() && domElement.equals(this.dragingElement)) {
    return false
  }
  let parentDomElement = domElement.parent()
  if (parentDomElement.isNearBoundaries(point, this.options.boundariesGap)) {
    domElement = this.findValidParent(parentDomElement.parent())
  }
  let position = this.placeholder.redraw(domElement.node, point, {
    allowBeforeAfter: !parentDomElement.isElement() || this.dragingElement.isChild(parentDomElement),
    allowAppend: domElement.data.containerFor().length ? this.dragingElement.isChild(domElement) : false
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
  this.dragingElement = new DOMElement(DOMNode, this.options.document)
  if (!this.dragingElement.isElement()) {
    this.dragingElement = null
    return false
  }
  // Creat helper/clone of element
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
  this.options.document.removeEventListener('mouseup', this.handDragEndFunction, false)
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
