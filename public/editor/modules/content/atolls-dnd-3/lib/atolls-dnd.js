import {default as _} from 'lodash'
const $ = require('jquery')
const Atoll = require('./atoll')

/**
 * Drag&drop builder
 * @param container
 * @param options
 * @constructor
 */
const Builder = function (container, options) {
  this.container = container
  this.atolls = {}
  this.hover = ''
  this.dragingElement = null
  this.options = _.defaults(options, {
    radius: 20,
    cancelMove: false,
    moveCallback: function () {},
    documentDOM: document
  })
}
Builder.prototype.init = function () {
  // this.initContainer()
  this.buildHelper()
  // this.buildHover()
}
Builder.prototype.initContainer = function () {
  this.container.addEventListener('drag', this.handleDrag.bind(this), false)
}
Builder.prototype.addItem = function (id) {
  this.atolls[ id ] = new Atoll(id, this.options)
    // .on('dragstart', this.handleDragStart.bind(this))
    // .on('dragend', this.handleDragEnd.bind(this))
    // .on('mouseover', this.handleDrag.bind(this))
    .on('mousedown', this.handleDragStart.bind(this))
    .on('mouseup', this.handleDragEnd.bind(this))
}
Builder.prototype.removeItem = function (id) {
  this.atolls[ id ]
    // .off('dragstart', this.handleDragStart.bind(this))
    // .off('dragend', this.handleDragEnd.bind(this))
    .off('mousedown', this.handleDragStart.bind(this))
    .off('mouseup', this.handleDragEnd.bind(this))
  delete this.atolls[ id ]
}
Builder.prototype.watchMouse = function () {
  this.container.addEventListener('mousemove', this.handleDrag, false)
}
Builder.prototype.forgetMouse = function () {
  console.log('forget mouse')
  console.log(this.container)
  this.container.removeEventListener('mousemove', this.handleDrag, false)
}
/**
 * Helper
 */
Builder.prototype.buildHelper = function () {
  this.helper = document.createElement('div')
  this.helper.classList.add('vcv-drag-helper')
  document.body.appendChild(this.helper)
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
/**
 * Hover
 */
Builder.prototype.buildHover = function () {
  this.hover = document.createElement('div')
  this.hover.classList.add('vcv-atolls-hover')
  document.body.appendChild(this.hover)
}
Builder.prototype.showHover = function () {
  _.defer(function () {
    this.hover && this.hover.classList.add('vcv-visible')
  }.bind(this))
}
Builder.prototype.hideHover = function () {
  _.defer(function () {
    this.hover && this.hover.classList.remove('vcv-visible')
  }.bind(this))
}
/**
 * Menage atolls
 */
Builder.prototype.renderControls = function () {
  _.defer(function () {
    Object.keys(this.atolls).forEach(function (key) {
      var atoll = this.atolls[ key ]
      if (atoll.el !== this.dragingElement) {
        atoll.setControls()
      }
    }, this)
  }.bind(this))
}
Builder.prototype.checkControls = function (center) {
  Object.keys(this.atolls).forEach(function (key) {
    var atoll = this.atolls[ key ]
    if (atoll.el !== this.dragingElement) {
      atoll.checkControls(this.options.radius, center)
    }
  }, this)
}
Builder.prototype.hideControls = function () {
  $('.vcv-atoll-control').remove()
  Object.keys(this.atolls).forEach(function (key) {
    this.atolls[ key ].removeControls()
  }, this)
}
/**
 * Drag handlers
 */
Builder.prototype.handleDrag = function (e) {
  console.log(this)
  console.log(e)
  // this.checkControls({ x: e.clientX, y: e.clientY })
}
/**
 *
 * @param {object} e
 */
Builder.prototype.handleDragStart = function (e) {
  if (e.stopPropagation) {
    e.stopPropagation()
  }
  console.log('start')
  this.dragingElement = e.currentTarget
  /*if (e.dataTransfer) {
    e.dataTransfer.setDragImage(this.getHelper(), 20, 20)
    e.dataTransfer.effectAllowed = 'copy' // only dropEffect='copy' will be dropable
    e.dataTransfer.setData('Text', e.currentTarget.getAttribute('data-vc-element')) // required otherwise doesn't work
    this.hideHelper()
  }*/
  this.watchMouse()
  // this.showHover()
  this.renderControls()
}
Builder.prototype.handleDragEnd = function () {
  console.log('end')
  this.dragingElement = null
  this.forgetMouse()
  this.hideControls()
  // this.hideHover()
}
/**
 * Global Constructor
 * @type {Builder}
 */
module.exports = Builder
