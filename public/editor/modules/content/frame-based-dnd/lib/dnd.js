import {getService} from 'vc-cake'
import Item from './item'
import SmartLine from './smart-line'
import Helper from './helper'

const cook = getService('cook')
const $ = require('jquery')
const _ = require('lodash')
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
    offsetLeft: 0
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
/**
 * Menage items
 */

Builder.prototype.checkItems = function (point) {
  let DOMelement = this.options.document.elementFromPoint(point.x, point.y)
  if (DOMelement && !DOMelement.getAttribute('data-vc-element')) {
    DOMelement = $(DOMelement).closest('[data-vc-element]').get(0)
  }
  let isElement = DOMelement && DOMelement.getAttribute && DOMelement.getAttribute('data-vc-element') !== this.dragingElementId
  if (!isElement) {
    return false
  }
  let id = DOMelement.getAttribute('data-vc-element')
  let parentId = $(DOMelement).parents('[data-vc-element]:first').attr('data-vc-element')
  let data = getService('document').get(id)
  let element = cook.get(data)
  let parentData = getService('document').get(parentId)
  let parentElement = cook.get(parentData)
  if (!element) {
    return false
  }
  let position = this.placeholder.redraw(DOMelement, point, {
    allowBeforeAfter: !parentElement || this.dragingElementObject.relatedTo(parentElement.containerFor()),
    allowAppend: !$(DOMelement).find('[data-vc-element]').length && element.containerFor().length ? this.dragingElementObject.relatedTo(element.containerFor()) : false
  })
  if (position) {
    this.setPosition(position)
    this.currentElement = DOMelement.getAttribute('data-vc-element')
    this.placeholder.setCurrentElement(this.currentElement)
  }
}

Builder.prototype.setPosition = function (position) {
  this.position = position
}
Builder.prototype.start = function (DOMNode) {
  this.dragingElement = DOMNode
  this.dragingElementId = this.dragingElement.getAttribute('data-vc-element')
  if (this.dragingElementId === null) {
    return false
  }
  // Creat helper/clone of element
  this.helper = new Helper(this.dragingElement)
  // Add css class for body to enable visual setings for all document
  this.options.document.body.classList.add('vcv-dragstart')
  let data = getService('document').get(this.dragingElementId)
  this.dragingElementObject = cook.get(data)

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
      this.dragingElement.getAttribute('data-vc-element'),
      this.position,
      this.currentElement
    )
  }
  this.dragingElement = null
  this.currentElement = null
  this.dragingElementObject = null
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
  this.container.addEventListener('mousemove', this.handleDragFunction, false)
}
Builder.prototype.forgetMouse = function () {
  this.container.removeEventListener('mousemove', this.handleDragFunction, false)
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
