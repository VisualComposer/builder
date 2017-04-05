const _ = require('lodash')
const $ = require('jquery')
/**
 * From to highlight position
 * @constructor
 */
const SmartLine = function (options) {
  Object.defineProperty(this, 'options', {
    enumerable: false,
    configurable: false,
    writable: false,
    value: _.defaults(options, {
      document: document,
      container: document.body
    })
  })
  this.create()
}

SmartLine.prototype.create = function () {
  this.el = document.createElement('svg')
  this.el.id = 'vcv-dnd-smart-line'
  this.currentElement = null
  this.prevElement = null
  this.point = { x: 0, y: 0 }
  this.options.container.appendChild(this.el)
}
SmartLine.prototype.setPoint = function (x, y) {
  this.point.x = x
  this.point.y = y
}
SmartLine.prototype.remove = function () {
  this.options.container.removeChild(this.el)
  this.prevElement = null
}
SmartLine.prototype.setCurrentElement = function (element) {
  this.currentElement = element
}
SmartLine.prototype.isSameElementPosition = function (point, element) {
  return this.point.x === point.x && this.point.y === point.y && element === this.prevElement
}
SmartLine.prototype.setStyle = function (point, width, height, frame) {
  this.el.setAttribute('style', _.reduce({
    width: width,
    height: height,
    top: point.y,
    left: point.x
  }, function (result, value, key) {
    return result + key + ':' + value + 'px;'
  }, ''))
  frame === true && this.el.classList.add('vcv-dnd-smart-line-frame')
}
SmartLine.prototype.clearStyle = function () {
  this.el.classList.remove('vcv-dnd-smart-line-frame', 'vcv-is-shown')
}
SmartLine.prototype.getVcvIdFromElement = function (element) {
  return element.dataset.vcvDndElement || null
}
SmartLine.prototype.redraw = function (element, point, settings, parents = []) {
  let position = false
  let $element = $(element)
  let subRect
  let lineWidth = 2
  let lineHeight = 2
  let linePoint = { x: 0, y: 0 }
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
    let prevElement = $element.prevAll('[data-vcv-dnd-element]').get(0)
    let nextElement = $element.nextAll('[data-vcv-dnd-element]').get(0)

    if (position === 'before') {
      // set default point position
      linePoint.x = rect.left
      linePoint.y = rect.top
      let elRects = { prev: rect, next: rect }

      // check if has other elements
      if (prevElement) {
        subRect = prevElement.getBoundingClientRect()
        elRects = { prev: subRect, next: rect }
      } else if (nextElement) {
        subRect = nextElement.getBoundingClientRect()
        elRects = { prev: subRect, next: rect }
      }

      // Define ordering
      if (elRects.prev.left === elRects.next.left) {
        // Vertical order
        lineWidth = rect.width
        let posModificator = (elRects.next.top - elRects.prev.bottom) / 2
        posModificator = posModificator > 0 ? posModificator : 0
        linePoint.y -= posModificator + lineHeight / 2
      } else {
        // Horizontal order
        lineHeight = rect.height
        let posModificator = (elRects.next.left - elRects.prev.right) / 2
        posModificator = posModificator > 0 ? posModificator : 0
        linePoint.x -= posModificator + lineWidth / 2
      }
    } else {
      // set default point position
      linePoint.x = rect.left
      linePoint.y = rect.bottom
      let elRects = { prev: rect, next: rect }

      // check if has other elements
      if (nextElement) {
        subRect = nextElement.getBoundingClientRect()
        elRects = { prev: rect, next: subRect }
      } else if (prevElement) {
        subRect = prevElement.getBoundingClientRect()
        elRects = { prev: rect, next: subRect }
      }

      // Define ordering
      if (elRects.prev.left === elRects.next.left) {
        // Vertical order
        lineWidth = rect.width
        let posModificator = (elRects.next.top - elRects.prev.bottom) / 2
        posModificator = posModificator > 0 ? posModificator : 0
        linePoint.y += posModificator - lineHeight / 2
      } else {
        // Horizontal order
        lineHeight = rect.height
        let posModificator = (elRects.next.left - elRects.prev.right) / 2
        posModificator = posModificator > 0 ? posModificator : 0
        linePoint.y = elRects.prev.top
        linePoint.x = elRects.prev.right + posModificator - lineWidth / 2
      }
    }
  }

  if (position && !this.isSameElementPosition(linePoint, this.getVcvIdFromElement(element))) {
    this.clearStyle()
    this.setPoint(linePoint.x, linePoint.y)
    this.setStyle(linePoint, lineWidth, lineHeight, frame)
    window.setTimeout(function () {
      this.el && this.el.classList.add('vcv-is-shown')
    }.bind(this), 0)
  } else {
    position = false
  }

  if (this.prevElement !== this.getVcvIdFromElement(element)) {
    this.prevElement = this.getVcvIdFromElement(element)
  }

  return position
}

module.exports = SmartLine
