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
  let defaultLiteSize = 2
  let lineWidth = defaultLiteSize
  let lineHeight = defaultLiteSize
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
    let prevRect = prevElement ? prevElement.getBoundingClientRect() : null
    let nextRect = nextElement ? nextElement.getBoundingClientRect() : null
    let isHorizontalLine = prevRect && prevRect.left !== rect.left || nextRect && nextRect.left !== rect.left

    // set default line position
    linePoint.x = rect.left
    linePoint.y = position === 'before' ? rect.top : rect.bottom
    linePoint.y -= defaultLiteSize / 2
    lineWidth = rect.width

    // set horizontal line position
    if (isHorizontalLine) {
      lineWidth = defaultLiteSize
      lineHeight = rect.height
      linePoint.y = rect.top
      linePoint.x = position === 'before' ? rect.left : rect.right
      linePoint.x -= defaultLiteSize / 2
    }

    // modify line position for margins
    if (position === 'before' && prevRect) {
      if (isHorizontalLine) {
        let positionModificator = (rect.left - prevRect.right) / 2
        positionModificator = positionModificator > 0 ? positionModificator : 0
        linePoint.x -= positionModificator
      } else {
        let positionModificator = (rect.top - prevRect.bottom) / 2
        positionModificator = positionModificator > 0 ? positionModificator : 0
        linePoint.y -= positionModificator
      }
    }
    if (position === 'after' && nextRect) {
      if (isHorizontalLine) {
        let positionModificator = (nextRect.left - rect.right) / 2
        positionModificator = positionModificator > 0 ? positionModificator : 0
        linePoint.x += positionModificator
      } else {
        let positionModificator = (nextRect.top - rect.bottom) / 2
        positionModificator = positionModificator > 0 ? positionModificator : 0
        linePoint.y += positionModificator
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
