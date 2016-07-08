var vcCake = require('vc-cake')
var ControlsTrigger = {}

require('./css/controls/init.less')
vcCake.add('content-editor-controls-iframe', function (api) {
  var $ = require('jquery')
  var controlsHandler = require('imports?$=jquery!./lib/controls-handler.js')
  var hideControls = false
  api.addAction('disableControls', function (state) {
    hideControls = !!state
    if (hideControls) {
      controlsHandler.removeControls()
    }
  })
  api.addAction('hideFrame', function (state) {
    controlsHandler.hideOutline()
  })
  ControlsTrigger.triggerShowFrame = function (e) {
    e.stopPropagation()
    controlsHandler.showOutline($(e.currentTarget), hideControls)
  }

  ControlsTrigger.triggerHideFrame = function () {
    controlsHandler.hideOutline()
  }

  ControlsTrigger.triggerRedrawFrame = function () {
    controlsHandler.drawOutlines()
  }

  var EditorControls = function () {
    var editorWrapper = document.getElementById('vcv-editor-iframe-overlay')
    var controlsWrapper = document.createElement('div')
    controlsWrapper.setAttribute('id', 'vcv-ui-controls-container')
    editorWrapper.appendChild(controlsWrapper)

    api.reply('start', function () {
      var iframeDocument = $('#vcv-editor-iframe').get(0).contentWindow.document
      $(iframeDocument).on('mousemove hover', '[data-vc-element]', ControlsTrigger.triggerShowFrame)
      $(iframeDocument).on('mousemove hover', 'body', ControlsTrigger.triggerHideFrame)
      $(document).on('mousemove hover', '.vcv-ui-outline-controls-container', function (e) {
        e.stopPropagation()
      })
      $(document).on('mousedown', '[data-vc-drag-helper]', function (e) {
        var id = $(this).data('vcDragHelper')
        var DOMNode = id ? $(iframeDocument).find('[data-vc-element="' + id + '"]') : null
        if (DOMNode.length) {
          controlsHandler.removeControls()
          api.module('content-frame-based-dnd').do('startDragging', DOMNode.get(0), {x: e.clientX, y: e.clientY})
        }
      })
      $(document).on('click', '[data-vc-control-event]', function (e) {
        var $el = $(e.currentTarget)
        var event = $el.data('vcControlEvent')
        var elementId = $el.data('vcElementId')
        e.preventDefault()
        api.request(event, elementId)
        controlsHandler.hideOutline()
      })
      $(document).on('scroll resize', ControlsTrigger.triggerRedrawFrame)
      $(window).on('resize', ControlsTrigger.triggerRedrawFrame)
      $(iframeDocument).on('scroll resize', ControlsTrigger.triggerRedrawFrame)
    })
    return controlsHandler
  }
  EditorControls()
})
