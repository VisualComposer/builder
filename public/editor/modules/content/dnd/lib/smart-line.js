const _ = require('lodash')
const $ = require('jquery')
/**
 * From to highlight position
 * @constructor
 */
const SmartLine = function (options) {
  this.options = _.defaults(options, {
    document: document,
    offsetTop: 0,
    offsetLeft: 0
  })
  this.create()
}

SmartLine.prototype.create = function () {
  this.el = document.createElement('svg')
  this.el.id = 'vcv-dnd-smart-line'
  this.currentElement = null
  this.point = {x: 0, y: 0}
  document.body.appendChild(this.el)
}
SmartLine.prototype.setPoint = function (x, y) {
  this.point.x = x
  this.point.y = y
}
SmartLine.prototype.remove = function () {
  document.body.removeChild(this.el)
}
SmartLine.prototype.depositionTop = function () {
  return this.options.offsetTop
}
SmartLine.prototype.depositionLeft = function () {
  return this.options.offsetLeft
}
SmartLine.prototype.setCurrentElement = function (element) {
  this.currentElement = element
}
SmartLine.prototype.isSameElementPosition = function (point) {
  return false // this.point.x === point.x && this.point.y === point.y
}
SmartLine.prototype.setStyle = function (point, width, height, frame) {
  this.el.setAttribute('style', _.reduce({
    width: width,
    height: height,
    top: point.y + this.depositionTop(),
    left: point.x + this.depositionLeft()
  }, function (result, value, key) {
    return result + key + ':' + value + 'px;'
  }, ''))
  frame === true && this.el.classList.add('vcv-dnd-smart-line-frame')
}
SmartLine.prototype.clearStyle = function () {
  this.el.classList.remove('vcv-dnd-smart-line-frame')
}
SmartLine.prototype.redraw = function (element, point, settings, parents = []) {
  let position = false
  let $element = $(element)
  let subElement
  let subRect
  let lineWidth = 2
  let lineHeight = 2
  let linePoint = {x: 0, y: 0}
  let frame = false
  settings = _.defaults(settings || {}, {
    allowAppend: true,
    allowBeforeAfter: true
  })
  let rect = element.getBoundingClientRect()
  let positionY = point.y - (rect.top + rect.height / 2)
  let positionX = point.x - (rect.left + rect.width / 2)
  if (settings.allowAppend === true) {
    position = 'append'
  } else if (settings.allowBeforeAfter === true && Math.abs(positionX) / rect.width > Math.abs(positionY) / rect.height) {
    position = positionX > 0 ? 'after' : 'before'
  } else if (settings.allowBeforeAfter === true) {
    position = positionY > 0 ? 'after' : 'before'
  }

  if (position === 'append') {
    linePoint.x = rect.left
    linePoint.y = rect.top
    lineWidth = rect.width
    lineHeight = rect.height
    frame = true
  } else {
    subElement = position === 'before' ? $element.prev(':not([data-vcv-dnd-helper])').get(0) : $element.next(':not([data-vcv-dnd-helper])').get(0)
    if (subElement) {
      subRect = subElement.getBoundingClientRect()
      // Define ordering
      if (rect.left !== subRect.left) {
        // Horizontal order
        lineHeight = subRect.height > rect.height ? subRect.height : rect.height
        linePoint.y = rect.top
        let elRects = position === 'before' ? {l: subRect, r: rect} : {l: rect, r: subRect}
        linePoint.x = elRects.r.left - elRects.l.right > 0 ? elRects.r.right + (elRects.r.left - elRects.l.right) / 2 : elRects.r.left
      } else {
        // Vertical order
        lineWidth = subRect.width > rect.width ? subRect.width : rect.width
        linePoint.x = rect.left
        let elRects = position === 'before' ? {b: rect, t: subRect} : {b: subRect, t: rect}
        linePoint.y = elRects.b.top - elRects.t.bottom > 0 ? elRects.t.bottom + (elRects.b.top - elRects.t.bottom) / 2 : elRects.t.bottom
      }
    } else if (position === 'before') {
      // Default
      lineWidth = rect.width
      linePoint.x = rect.left
      linePoint.y = rect.top
      let nextSubling = $element.next(':not([data-vcv-dnd-helper])').get(0)
      if (nextSubling) {
        subRect = nextSubling.getBoundingClientRect()
        if (subRect.left !== rect.left) {
          lineWidth = 2
          lineHeight = rect.height
          linePoint.x = rect.left
          linePoint.y = rect.top
        }
      }
    } else {
      lineWidth = rect.width
      linePoint.x = rect.left
      linePoint.y = rect.bottom
      let prevSubling = $element.prev(':not([data-vcv-dnd-helper])').get(0)
      if (prevSubling) {
        subRect = prevSubling.getBoundingClientRect()
        if (subRect.left !== rect.left) {
          lineWidth = 2
          lineHeight = rect.height
          linePoint.x = rect.right
          linePoint.y = rect.top
        }
      }
    }
  }
  if (position && !this.isSameElementPosition(linePoint)) {
    this.clearStyle()
    this.setPoint(linePoint.x, linePoint.y)
    this.setStyle(linePoint, lineWidth, lineHeight, frame)
    window.setTimeout(function () {
      this.el && this.el.classList.add('vcv-js-show')
    }.bind(this), 0)
  } else {
    position = false
  }
  return position
}
module.exports = SmartLine
