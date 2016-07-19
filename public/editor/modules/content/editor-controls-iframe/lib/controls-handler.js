/*global $*/
import {getService} from 'vc-cake'
const documentManager = getService('document')
const cook = getService('cook')
var iframeOffsetTop = 0
var iframeOffsetLeft = 0
function ControlsHandler () {
  this.$currentElement = undefined
  this.sliceSize = 3
  this.elementsTree = []
  this.outlines = []
  this.$controlsContainer = null
  this.$controlsList = null
}

ControlsHandler.prototype.showOutline = function ($el, hideControls) {
  if ($el.data('vcElement') === undefined) {
    $el = $el.closest('[data-vc-element]')
  }

  if (!this.$currentElement || $el[ 0 ] !== this.$currentElement[ 0 ]) {
    this.$currentElement = $el
    this.updateElementsTree()
    this.drawOutlines()
    hideControls !== true && this.drawControls()
  }

  return this
}

ControlsHandler.prototype.hideOutline = function () {
  var outlines = this.getOutlines()
  for (var i in outlines) {
    outlines[ i ].css({
      'display': 'none'
    })
  }
  if (this.$currentElement !== undefined) {
    this.$currentElement = undefined
    this.clearElementsTree()
    this.removeControls()
  }

  return this
}

ControlsHandler.prototype.getElementsTree = function () {
  if (!this.elementsTree.length) {
    this.updateElementsTree()
  }
  return this.elementsTree
}

ControlsHandler.prototype.updateElementsTree = function () {
  var _this = this

  this.clearElementsTree()

  if (this.$currentElement === undefined) {
    return this
  }

  this.elementsTree.push(this.$currentElement)
  this.$currentElement.parents('[data-vc-element]').each(function () {
    _this.elementsTree.push($(this))
  })
  this.elementsTree = this.elementsTree.slice(0, this.sliceSize)
  this.elementsTree.reverse()

  return this
}

ControlsHandler.prototype.clearElementsTree = function () {
  this.elementsTree = []

  return this
}

ControlsHandler.prototype.getOutlines = function () {
  // Here comes wrapper for controls
  var controlsWrapper = document.getElementById('vcv-ui-controls-container')
  if (this.outlines.length < this.sliceSize) {
    var $outline
    $(controlsWrapper).find('.vcv-ui-outline').remove()
    this.outlines = []
    while (this.getElementsTree().length >= this.outlines.length) {
      $outline = $('<svg class="vcv-ui-outline"></svg>')
      this.outlines.push($outline)
      $outline.appendTo(controlsWrapper)
    }
  }
  return this.outlines
}

ControlsHandler.prototype.drawOutlines = function () {
  let outlines = this.getOutlines()
  let elemenstsTree = this.getElementsTree()
  let posLeft, posTop, width, height
  for (var i in outlines) {
    if (elemenstsTree[ i ] === undefined) {
      outlines[ i ].css({
        'display': 'none'
      })
    } else {
      var elementId = elemenstsTree[ i ][ 0 ].getAttribute('data-vc-element')
      var elementObject = this.getElement(elementId)
      var controlColorIndex = this.getElementColorIndex(elementObject)

      posTop = elemenstsTree[ i ].offset().top + iframeOffsetTop - this.$currentElement[ 0 ].ownerDocument.defaultView.pageYOffset
      posLeft = elemenstsTree[ i ].offset().left + iframeOffsetLeft - this.$currentElement[ 0 ].ownerDocument.defaultView.pageXOffset
      width = elemenstsTree[ i ].outerWidth()
      height = elemenstsTree[ i ].outerHeight()
      outlines[ i ].css({
        'top': posTop,
        'left': posLeft,
        'width': width,
        'height': height,
        'display': ''
      })
      outlines[ i ].attr('data-vc-outline-element-id', elementId)
      outlines[ i ].addClass('vcv-ui-outline-type-index-' + controlColorIndex)
    }
  }

  this.setControlsPosition()

  return this
}
ControlsHandler.prototype.getElement = function (id) {
  return cook.get(documentManager.get(id))
}
ControlsHandler.prototype.getElementColorIndex = function (element) {
  var colorIndex = 2
  if (element && element.containerFor().length > 0) {
    colorIndex = element.containerFor().indexOf('Column') > -1 ? 0 : 1
  }
  return colorIndex
}
ControlsHandler.prototype.drawControls = function () {
  let elemenstsTree = this.getElementsTree()
  let $controlElement, $dropdownContent, $controlAction
  if (!this.$controlsContainer) {
    // Here comes wrapper for controls
    var controlsWrapper = $('#vcv-ui-controls-container')
    /* vcv-ui-controls-o-inset for inset controls
     * vcv-ui-controls-o-controls-left to stick controls to left side
     */
    this.$controlsContainer = $('<div class="vcv-ui-outline-controls-container"/>')
    this.$controlsContainer.appendTo(controlsWrapper)
  }

  if (!this.$controlsList) {
    this.$controlsList = $('<nav class="vcv-ui-outline-controls" />')
    this.$controlsList.appendTo(this.$controlsContainer)
  }

  this.$controlsList.html('')

  // add tree layout button
  if (elemenstsTree.length < this.$currentElement.parents('[data-vc-element]').length) {
    $controlElement = $('<a href="#" class="vcv-ui-outline-control" data-vc-control-event="tree-layout:show"/>')
    $('<span  class="vcv-ui-outline-control-content">' +
      '<i class="vcv-ui-outline-control-icon vcv-ui-icon vcv-ui-icon-more-dots" ></i>' +
      '</span>').appendTo($controlElement)
    $controlElement.appendTo(this.$controlsList)
  }
  // add elements controld in dropdown
  for (var i in elemenstsTree) {
    /* vcv-ui-outline-control-dropdown-o-drop-up to open dropdown up
     * vcv-ui-outline-control-dropdown-o-drop-right to open dropdown rightr
     */
    var elementId = elemenstsTree[ i ][ 0 ].getAttribute('data-vc-element')
    var elementObject = this.getElement(elementId)
    var controlColorIndex = this.getElementColorIndex(elementObject)
    var iconPath = elementObject.getPublicPath(elementObject.get('meta_icon'))
    var isElementContainer = controlColorIndex < 2
    $controlElement = $('<dl data-vc-element-controls="' + elementId + '" class="vcv-ui-outline-control-dropdown vcv-ui-outline-control-type-index-' +
      controlColorIndex + '"/>')
    $controlElement.appendTo(this.$controlsList)

    $controlElement.hover((e) => {
      var id = $(e.currentTarget).data('vcElementControls')
      $('[data-vc-outline-element-id=' + id + ']').addClass('vcv-js-highlight')
    }, (e) => {
      var id = $(e.currentTarget).data('vcElementControls')
      $('[data-vc-outline-element-id=' + id + ']').removeClass('vcv-js-highlight')
    })
    // add dropdown trigger
    $('<dt class="vcv-ui-outline-control-dropdown-trigger vcv-ui-outline-control">' +
      '<span  class="vcv-ui-outline-control-content" title="' + elementObject.get('name') + '" >' +
      '<img src="' + iconPath + '" class="vcv-ui-outline-control-icon" alt="" />' +
      '</span>' +
      '</dt>').appendTo($controlElement)

    // add dropdown content
    $dropdownContent = $('<dd class="vcv-ui-outline-control-dropdown-content"/>')
    $dropdownContent.appendTo($controlElement)

    $controlAction = $('<a href="#" class="vcv-ui-outline-control" data-vc-drag-helper="' + elementId + '"/>')
    $('<span  class="vcv-ui-outline-control-content">' +
      '<i class="vcv-ui-outline-control-icon vcv-ui-icon vcv-ui-icon-move" ></i>' +
      '<span class="vcv-ui-outline-control-label" >' + elementObject.get('name') + '</span>' +
      '</span>').appendTo($controlAction)
    $controlAction.on('dragstart', function (e) { e.preventDefault() })
    $controlAction.appendTo($dropdownContent)

    // add button
    if (isElementContainer) {
      $controlAction = $('<a href="#" class="vcv-ui-outline-control" data-vc-control-event="app:add" data-vc-element-id="' + elementId + '"/>')
      $('<span  class="vcv-ui-outline-control-content">' +
        '<i class="vcv-ui-outline-control-icon vcv-ui-icon vcv-ui-icon-add-thin" ></i>' +
        '<span class="vcv-ui-outline-control-label" >Add</span>' +
        '</span>').appendTo($controlAction)
      $controlAction.appendTo($dropdownContent)
    }

    // edit button
    $controlAction = $('<a href="#" class="vcv-ui-outline-control"' +
      ' data-vc-control-event="app:edit"' +
      ' data-vc-element-id="' + elementId + '"/>')
    $('<span  class="vcv-ui-outline-control-content">' +
      '<i class="vcv-ui-outline-control-icon vcv-ui-icon vcv-ui-icon-edit" ></i>' +
      '<span class="vcv-ui-outline-control-label" >Edit</span>' +
      '</span>').appendTo($controlAction)
    $controlAction.appendTo($dropdownContent)

    // clone button
    $controlAction = $('<a href="#" class="vcv-ui-outline-control"' +
      ' data-vc-control-event="data:clone"' +
      ' data-vc-element-id="' + elementId + '"/>')
    $('<span  class="vcv-ui-outline-control-content">' +
      '<i class="vcv-ui-outline-control-icon vcv-ui-icon vcv-ui-icon-copy" ></i>' +
      '<span class="vcv-ui-outline-control-label" >Clone</span>' +
      '</span>').appendTo($controlAction)
    $controlAction.appendTo($dropdownContent)

    // remove button
    $controlAction = $('<a href="#" class="vcv-ui-outline-control"' +
      ' data-vc-control-event="data:remove"' +
      ' data-vc-element-id="' + elementId + '"/>')
    $('<span  class="vcv-ui-outline-control-content">' +
      '<i class="vcv-ui-outline-control-icon vcv-ui-icon vcv-ui-icon-close-thin" ></i>' +
      '<span class="vcv-ui-outline-control-label" >Remove</span>' +
      '</span>').appendTo($controlAction)
    $controlAction.appendTo($dropdownContent)
  }

  this.setControlsPosition()
}

ControlsHandler.prototype.removeControls = function () {
  if (this.$controlsContainer) {
    this.$controlsContainer.remove()
    this.$controlsContainer = null
    this.$controlsList = null
  }

  return this
}

ControlsHandler.prototype.setControlsPosition = function () {
  var posTop, posLeft, outerWidth

  var getDrop = function (el) {
    var top = el.offsetTop
    var left = el.offsetLeft
    var width = el.offsetWidth
    var height = el.offsetHeight
    let innerEl = el.offsetParent
    while (innerEl) {
      top += innerEl.offsetTop
      left += innerEl.offsetLeft
      innerEl = innerEl.offsetParent
    }
    return {
      dropUp: top >= window.pageYOffset && (top + height) <= (window.pageYOffset + window.innerHeight),
      dropRight: left >= window.pageXOffset && (left + width) <= (window.pageXOffset + window.innerWidth)
    }
  }

  if (this.$currentElement !== undefined && this.$controlsContainer !== null) {
    posTop = this.$currentElement.offset().top + iframeOffsetTop - this.$currentElement[ 0 ].ownerDocument.defaultView.pageYOffset
    var inset = false
    // TODO: Variable for posTop
    if (posTop < 41) {
      inset = true
      posTop = 0
    }
    posLeft = this.$currentElement.offset().left + iframeOffsetLeft + this.$currentElement.outerWidth() - this.$currentElement[ 0 ].ownerDocument.defaultView.pageXOffset
    outerWidth = $(this.$currentElement[ 0 ].ownerDocument.defaultView).outerWidth()
    if (posLeft > outerWidth) {
      posLeft = outerWidth
    }
    this.$controlsContainer.css({
      'top': posTop,
      'left': posLeft
    }).toggleClass('vcv-ui-controls-o-inset', inset)
    this.$controlsList.find('.vcv-ui-outline-control-dropdown').each((index, item) => {
      let $controlDropdown = $(item).removeClass('vcv-ui-outline-control-dropdown-o-drop-right vcv-ui-outline-control-dropdown-o-drop-up')
      let $content = $controlDropdown.find('.vcv-ui-outline-control-dropdown-content')
      let { dropRight, dropUp } = getDrop($content.get(0))
      $controlDropdown
        .toggleClass('vcv-ui-outline-control-dropdown-o-drop-right', !dropRight)
        .toggleClass('vcv-ui-outline-control-dropdown-o-drop-up', !dropUp)
    })
  } else {
    this.removeControls()
  }
  return this
}
module.exports = new ControlsHandler()
