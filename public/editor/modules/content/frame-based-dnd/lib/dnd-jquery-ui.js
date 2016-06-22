import {getService} from 'vc-cake'
import Item from './item-jquery-ui'
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
  // this.container.addEventListener('drag', this.handleDrag.bind(this), false)
}
Builder.prototype.addItem = function (id) {
  this.items[ id ] = new Item(id, this.options.document)
    .on('dragstart', this.handleDragStart.bind(this))
    .on('drag', this.handleDrag.bind(this))
    .on('dragstop', this.handleDragEnd.bind(this))
}
Builder.prototype.removeItem = function (id) {
  this.items[ id ]
    .off('dragstart', this.handleDragStart.bind(this))
    .off('drag', this.handleDrag.bind(this))
    .off('dragstop', this.handleDragEnd.bind(this))
  delete this.items[ id ]
}
Builder.prototype.watchMouse = function () {
  this.container.addEventListener('drag', this.handleDrag.bind(this), false)
}
Builder.prototype.forgetMouse = function () {
  this.container.removeEventListener('drag', this.handleDrag.bind(this), false)
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
  this.frame = document.createElement('svg')
  this.frame.id = 'vcv-dnd-frame'
  document.body.appendChild(this.frame)
}
Builder.prototype.removeFrame = function () {
  this.frame = null
  var frame = document.getElementById('vcv-dnd-frame')
  frame && document.body.removeChild(frame)
}
/**
 * Menage items
 */
Builder.prototype.renderControls = function () {
  _.defer(function () {
    Object.keys(this.items).forEach(function (key) {

    }, this)
  }.bind(this))
}
Builder.prototype.hideControls = function () {

}
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
  if (element) {
    this.redrawFrame(DOMelement, point, {
      allowBeforeAfter: !parentElement || this.dragingElementObject.relatedTo(parentElement.containerFor()),
      allowAppend: element.containerFor().length ? this.dragingElementObject.relatedTo(element.containerFor()) : false
    })
  }
}
Builder.prototype.isSameElementPosition = function (element, position) {
  return this.currentElement === element.getAttribute('data-vc-element') && this.linePosition === position
}
Builder.prototype.setFrameSettings = function (rect, offset, cssClass) {
  this.frame.className = ''
  this.setFrameStyle(rect, offset)
  this.frame.classList.add(cssClass)
}
Builder.prototype.redrawFrame = function (element, point, settings) {
  let position, linePosition
  settings = _.defaults(settings || {}, {
    allowAppend: true,
    allowBeforeAfter: true
  })
  let rect = element.getBoundingClientRect()
  let offset = $(element).offset()
  let positionY = point.y - (rect.top + rect.height / 2)
  let positionX = point.x - (rect.left + rect.width / 2)
  if (settings.allowAppend === true) {
    position = 'append'
    linePosition = 'center'
  } else if (settings.allowBeforeAfter === true && Math.abs(positionX) / rect.width > Math.abs(positionY) / rect.height) {
    position = positionX > 0 ? 'after' : 'before'
    linePosition = position === 'after' ? 'right' : 'left'
  } else if (settings.allowBeforeAfter === true) {
    position = positionY > 0 ? 'after' : 'before'
    linePosition = position === 'after' ? 'bottom' : 'top'
  }
  if (!this.isSameElementPosition(element, linePosition)) {
    this.currentElement = element.getAttribute('data-vc-element')
    this.setPosition(position)
    this.setLinePosition(linePosition)
    this.setFrameSettings(rect, offset, 'vcv-dnd-frame-' + linePosition)
    window.setTimeout(function () {
      this.frame && this.frame.classList.add('vcv-js-show')
    }.bind(this), 0)
  }
}
Builder.prototype.setPosition = function (position) {
  this.position = position
}
Builder.prototype.setLinePosition = function (linePosition) {
  this.linePosition = linePosition
}
Builder.prototype.setFrameStyle = function (rect, offset) {
  this.frame.setAttribute('style', _.reduce({
    width: rect.width,
    height: rect.height,
    top: offset.top + this.depositionTop(),
    left: offset.left + this.depositionLeft()
  }, function (result, value, key) {
    return result + key + ':' + value + 'px;'
  }, ''))
}
Builder.prototype.depositionTop = function () {
  return this.options.offsetTop - this.options.document.body.scrollTop
}
Builder.prototype.depositionLeft = function () {
  return this.options.offsetLeft - this.options.document.body.scrollLeft
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
Builder.prototype.handleDragStart = function (e, ui) {
  if (e.stopPropagation) {
    e.stopPropagation()
  }
  if (ui.helper) {
    ui.helper.css('pointer-events', 'none')
  }
  this.dragingElement = e.currentTarget
  this.dragingElementId = this.dragingElement.getAttribute('data-vc-element')
  /*if (e.dataTransfer) {
   e.dataTransfer.setDragImage(this.getHelper(), 20, 20)
   e.dataTransfer.effectAllowed = 'copy'
   e.dataTransfer.dropEffect = 'none'
   e.dataTransfer.setData('Text', this.dragingElementId) // required otherwise doesn't work
   this.hideHelper()
   }*/
  let data = getService('document').get(this.dragingElementId)
  this.dragingElementObject = cook.get(data)

  // this.watchMouse()
  this.createFrame()
  this.renderControls()
  if (typeof this.options.startCallback === 'function') {
    this.options.startCallback(this.dragingElement)
  }
}
Builder.prototype.handleDragEnd = function (e) {
  if (e.stopPropagation) {
    e.stopPropagation()
  }
  // this.forgetMouse()
  this.hideControls()
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
}
/**
 * Global Constructor
 * @type {Builder}
 */
module.exports = Builder
