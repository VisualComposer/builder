const $ = require('jquery')
const _ = require('lodash')
/**
 * From to highlight position
 * @constructor
 */
const Frame = function (options) {
  this.options = _.defaults(options, {
    document: document,
    offsetTop: 0,
    offsetLeft: 0
  })
  this.create()
}

Frame.prototype.create = function () {
  this.el = document.createElement('svg')
  this.el.id = 'vcv-dnd-frame'
  this.currentElement = null
  this.linePosition = null
  document.body.appendChild(this.el)
}
Frame.prototype.remove = function () {
  document.body.removeChild(this.el)
}
Frame.prototype.depositionTop = function () {
  console.log(this.options.document.body.scrollTop)
  return this.options.offsetTop - (this.options.document.documentElement.scrollTop || this.options.document.body.scrollTop)
}
Frame.prototype.depositionLeft = function () {
  return this.options.offsetLeft - (this.options.document.documentElement.scrollLeft || this.options.document.body.scrollLeft)
}
Frame.prototype.setCurrentElement = function (element) {
  this.currentElement = element
}
Frame.prototype.setSettings = function (rect, offset, cssClass) {
  this.el.className = ''
  this.setStyle(rect, offset)
  this.el.classList.add(cssClass)
}
Frame.prototype.setLinePosition = function (position) {
  this.linePosition = position
}
Frame.prototype.isSameElementPosition = function (element, position) {
  return this.currentElement === element.getAttribute('data-vc-element') && this.linePosition === position
}
Frame.prototype.setStyle = function (rect, offset) {
  this.el.setAttribute('style', _.reduce({
    width: rect.width,
    height: rect.height,
    top: offset.top + this.depositionTop(),
    left: offset.left + this.depositionLeft()
  }, function (result, value, key) {
    return result + key + ':' + value + 'px;'
  }, ''))
}
Frame.prototype.redraw = function (element, point, settings) {
  let position = false
  let linePosition
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
  if (linePosition && !this.isSameElementPosition(element, linePosition)) {
    this.setLinePosition(linePosition)
    this.setSettings(rect, offset, 'vcv-dnd-frame-' + linePosition)
    window.setTimeout(function () {
      this.el && this.el.classList.add('vcv-js-show')
    }.bind(this), 0)
  } else {
    position = false
  }
  return position
}
module.exports = Frame
