import {getService} from 'vc-cake'
import Item from './item'
import Frame from './frame'
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
  this.frame = null
  this.position = null
  this.linePosition = null
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
Builder.prototype.init = function () {
  this.initContainer()
  // this.buildHelper()
}
Builder.prototype.initContainer = function () {
  // this.container.addEventListener('mousedown', this.handleDragStart.bind(this), false)
  this.handleDragFunction = this.handleDrag.bind(this)
  this.handleDragStartFunction = this.handleDragStart.bind(this)
  this.handleDragEndFunction = this.handleDragEnd.bind(this)
}
Builder.prototype.addItem = function (id) {
  this.items[ id ] = new Item(id, this.options.document)
    .on('mousedown', this.handleDragStartFunction)
  // .on('mouseup', this.handleDragEndFunction)
    // .on('mouseup', this.handleDragEnd.bind(this))
    // .on('dragstart', this.handleDragStart.bind(this))
    // .on('dragend', this.handleDragEnd.bind(this))
}
Builder.prototype.removeItem = function (id) {
  this.items[ id ]
    .off('mousedown', this.handleDragStartFunction)
    // .off('mouseup', this.handleDragEndFunction)
    // .off('dragstart', this.handleDragStart.bind(this))
    // .off('dragend', this.handleDragEnd.bind(this))
  delete this.items[ id ]
}
Builder.prototype.watchMouse = function () {
  // this.container.addEventListener('mousemove', this.handleDrag, false)
  this.options.document.body.addEventListener('mousemove', this.handleDragFunction, false)
}
Builder.prototype.forgetMouse = function () {
  this.options.document.body.removeEventListener('mousemove', this.handleDragFunction, false)
}
/**
 * Helper
 */
Builder.prototype.buildHelper = function () {
  this.helper = this.options.document.createElement('div')
  this.helper.classList.add('vcv-drag-helper')
  this.options.document.body.appendChild(this.helper)
}
Builder.prototype.getHelper = function () {
  this.helper.classList.add('vcv-visible')
  return this.helper
}
Builder.prototype.hideHelper = function () {
  _.defer(function () {
    this.helper.classList.remove('vcv-visible')
  }.bind(this))
}
Builder.prototype.createFrame = function () {
  this.frame = new Frame(_.pick(this.options, 'document', 'offsetLeft', 'offsetTop'))
}
Builder.prototype.removeFrame = function () {
  this.frame.remove()
  this.frame = null
}
/**
 * Menage items
 */

Builder.prototype.checkItems = function (point) {
  let DOMelement = this.options.document.elementFromPoint(point.x, point.y)
  if (DOMelement && !DOMelement.getAttribute('data-vc-element')) {
    DOMelement = $(DOMelement).closest('[data-vc-element]')
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
  let position = this.frame.redraw(DOMelement, point, {
    allowBeforeAfter: !parentElement || this.dragingElementObject.relatedTo(parentElement.containerFor()),
    allowAppend: element.containerFor().length ? this.dragingElementObject.relatedTo(element.containerFor()) : false
  })
  if (position) {
    this.setPosition(position)
    this.currentElement = DOMelement.getAttribute('data-vc-element')
    this.frame.setCurrentElement(this.currentElement)
  }
}

Builder.prototype.setPosition = function (position) {
  this.position = position
}

/**
 * Drag handlers
 */
Builder.prototype.handleDrag = function (e) {
  this.frame && this.checkItems({ x: e.clientX, y: e.clientY })
}
/**
 * @param {object} e Handled event
 */
Builder.prototype.handleDragStart = function (e) {
  if (e.stopPropagation) {
    e.stopPropagation()
  }
  this.dragingElement = e.currentTarget
  this.dragingElementId = this.dragingElement.getAttribute('data-vc-element')
  if (this.dragingElementId === null) {
    return false
  }
  /* if (e.dataTransfer) {
    e.dataTransfer.setDragImage(this.getHelper(), 20, 20)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.dropEffect = 'none'
    e.dataTransfer.setData('Text', this.dragingElementId) // required otherwise doesn't work
    this.hideHelper()
  }*/
  let data = getService('document').get(this.dragingElementId)
  this.dragingElementObject = cook.get(data)
  this.watchMouse()
  this.createFrame()
  if (typeof this.options.startCallback === 'function') {
    this.options.startCallback(this.dragingElement)
  }
  this.options.document.addEventListener('mouseup', this.handleDragEndFunction, false)
}
Builder.prototype.handleDragEnd = function (e) {
  if (e.stopPropagation) {
    e.stopPropagation()
  }
  this.forgetMouse()
  this.removeFrame()
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
  this.linePosition = null
  this.options.document.removeEventListener('mouseup', this.handDragEndFunction, false)
}
/**
 * Global Constructor
 * @type {Builder}
 */
module.exports = Builder
