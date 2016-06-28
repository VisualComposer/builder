import {default as _} from 'lodash'
const $ = require('jquery')
const AtollControl = require('./atoll-control')
/**
 * Atoll for DOM element
 * @param el  DOM element
 * @constructor
 */
var Atoll = function (id, options) {
  this.id = id
  this.options = _.defaults(options, {
    cancelMove: false,
    moveCallback: function () {},
    documentDOM: document,
    offsetTop: 0,
    offsetLeft: 0
  })
  this.el = this.options.documentDOM.querySelector('[data-vc-element="' + this.id + '"]')
  this.$el = $(this.el)
  this.points = {}
  this.helper = null
  this.controls = []
  this.init()
}
Atoll.prototype.init = function () {
  this.el.setAttribute('data-vcv-draggable', 'true')
  // this.el.setAttribute('draggable', 'true')
  return this
}
// @todo remove jquery offset with more optimized
Atoll.prototype.getPosition = function (position) {
  var rect = this.getRect()
  var offset = this.getOffset()
  var point
  if (position === 'top') {
    point = {
      y: offset.top,
      x: offset.left + rect.width / 2
    }
  } else if (position === 'bottom') {
    point = {
      y: offset.top + rect.height,
      x: offset.left + rect.width / 2
    }
  } else if (position === 'left') {
    point = {
      y: offset.top + rect.height / 2,
      x: offset.left
    }
  } else if (position === 'right') {
    point = {
      y: offset.top + rect.height / 2,
      x: offset.left + rect.width
    }
  } else if (position === 'center') {
    point = {
      y: offset.top + rect.height / 2,
      x: offset.left + rect.width / 2
    }
  }
  point.y += this.depositionTop()
  point.x += this.depositionLeft()
  return point
}
Atoll.prototype.getRect = function () {
  if (!this.points) {
    this.points = this.el.getBoundingClientRect()
  }
  return this.points
}
Atoll.prototype.getOffset = function () {
  if (!this.offset) {
    this.offset = this.$el.offset()
  }
  return this.offset
}
Atoll.prototype.depositionTop = function () {
  return this.options.offsetTop - this.options.documentDOM.body.scrollTop
}
Atoll.prototype.depositionLeft = function () {
  return this.options.offsetLeft - this.options.documentDOM.body.scrollLeft
}
Atoll.prototype.setControls = function () {
  this.points = null
  this.offset = null
  var style = window.getComputedStyle(this.el)
  var inline = style.display.match(/inline/)
  var before = inline ? 'left' : 'top'
  var after = inline ? 'right' : 'bottom'
  this.controls = [
    this.createControl(before)
  ]
  if (Array.prototype.indexOf.call(this.el.parentNode.children, this.el) === this.el.parentNode.children.length - 1) {
    this.controls.push(this.createControl(after))
  }
  if (this.el.getAttribute('data-vc-element-type') === 'container' && this.$el.find('[data-vc-element]').length === 0) {
    this.controls.push(this.createControl('center'))
  }
}
Atoll.prototype.checkControls = function (radius, center) {
  this.controls.forEach(function (control) {
    var rect = control.getRect()
    var distance = Math.sqrt(Math.pow(Math.abs(center.y - rect.top), 2) + Math.pow(Math.abs(center.x - rect.left), 2))
    var rate = distance / radius
    if (rate <= 0.10) {
      control.setSize(4)
    } else if (rate <= 0.45) {
      control.setSize(3)
    } else if (rate <= 0.75) {
      control.setSize(2)
    } else if (rate <= 1) {
      control.setSize(1)
    } else {
      control.setSize(0)
    }
  })
}
Atoll.prototype.removeControls = function () {
  this.controls = []
}
Atoll.prototype.on = function (event, callback, capture) {
  this.el.addEventListener(event, callback, !!capture)
  return this
}
Atoll.prototype.off = function (event, callback, capture) {
  this.el.removeEventListener(event, callback, !!capture)
  return this
}
Atoll.prototype.createControl = function (position) {
  var control = new AtollControl()
  var cord = this.getPosition(position)
  var dropPosition = position === 'center' ? 'append' : position === 'top' || position === 'left' ? 'before' : 'after'
  control
    .setPosition(cord)
    .setDropPosition(dropPosition)
    .add(document.body)
  /*control
    .on('dragenter', this.controlHandleDragEnter.bind(this))
    .on('dragleave', this.controlHandleDragLeave.bind(this))
    .on('dragover', this.controlHandleDragOver.bind(this))
    .on('drop', this.controlHandleDropOver.bind(this))*/
  return control
}
Atoll.prototype.controlHandleDragEnter = function (e) {
  e.currentTarget.classList.add('vcv-over')
}
Atoll.prototype.controlHandleDragOver = function (e) {
  if (e.preventDefault) {
    e.preventDefault()
  }
  e.dataTransfer.dropEffect = 'copy'
  return false
}
Atoll.prototype.controlHandleDragLeave = function (e) {
  e.currentTarget.classList.remove('vcv-over')
}
Atoll.prototype.controlHandleDragLeave = function (e) {
  e.currentTarget.classList.remove('vcv-over')
}
Atoll.prototype.controlHandleDropOver = function (e) {
  if (e.stopPropagation) {
    e.stopPropagation()
  }
  var control = e.currentTarget
  var id = e.dataTransfer.getData('Text')
  var element = document.querySelector('[data-vcv="' + id + '"]')
  var dropPosition = control.getAttribute('data-vcv-drop-position')
  if (!this.options.cancelMove) {
    if (dropPosition === 'after') {
      this.dropAfter(element)
    } else if (dropPosition === 'append') {
      this.dropChild(element)
    } else {
      this.dropBefore(element)
    }
  }
  if (typeof this.options.moveCallback === 'function') {
    this.options.moveCallback(id, dropPosition, this.id)
  }
}
Atoll.prototype.dropAfter = function (element) {
  $(element).insertAfter(this.el)
}
Atoll.prototype.dropBefore = function (element) {
  $(element).insertBefore(this.el)
}
Atoll.prototype.dropChild = function (element) {
  this.el.appendChild(element)
}
module.exports = Atoll
