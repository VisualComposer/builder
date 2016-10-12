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
  api.addAction('hideFrame', function () {
    controlsHandler.hideOutline()
  })
  ControlsTrigger.triggerShowFrame = function (e) {
    e.stopPropagation()
    vcCake.getData('vcv:layoutMode') === 'view' && controlsHandler.showOutline($(e.currentTarget), hideControls)
  }

  ControlsTrigger.triggerHideFrame = function () {
    controlsHandler.hideOutline()
  }

  ControlsTrigger.triggerRedrawFrame = function () {
    if (vcCake.getData('vcv:layoutMode') === 'view') {
      controlsHandler.drawOutlines()
      controlsHandler.setControlsPosition()
      controlsHandler.setTimer()
    }
  }

  var EditorControls = function () {
    var editorWrapper = document.getElementById('vcv-editor-iframe-overlay')
    var controlsWrapper = document.createElement('div')
    controlsWrapper.setAttribute('id', 'vcv-ui-controls-container')
    editorWrapper.appendChild(controlsWrapper)

    api.reply('start', function () {
      var iframeDocument = $('#vcv-editor-iframe').get(0).contentWindow.document
      var $iframeDocument = $(iframeDocument)
      $iframeDocument.on('mousemove hover', '[data-vcv-element]', ControlsTrigger.triggerShowFrame)
      $iframeDocument.on('mousemove hover', 'body', ControlsTrigger.triggerHideFrame)
      $(document).on('mousemove hover', '.vcv-ui-outline-controls-container', function (e) {
        e.stopPropagation()
      })
      $(document).on('mousedown', '[data-vc-drag-helper]', function (e) {
        let id = $(this).data('vcDragHelper')
        if (id) {
          controlsHandler.removeControls()
          api.module('content-dnd').do('startDragging', id, { x: e.clientX, y: e.clientY })
        }
      })
      $(document).on('click', '[data-vc-control-event]', function (e) {
        let $el = $(e.currentTarget)
        let event = $el.data('vcControlEvent')
        let options = $el.data('vcControlEventOptions')
        let elementId = $el.data('vcvElementId')
        e.preventDefault()
        api.request(event, elementId, options)
        event !== 'data:clone' && controlsHandler.hideOutline()
      })
      $(document).on('scroll resize', ControlsTrigger.triggerRedrawFrame)
      $(window).on('resize', ControlsTrigger.triggerRedrawFrame)
      $iframeDocument.on('scroll resize', ControlsTrigger.triggerRedrawFrame)
    })
    return controlsHandler
  }
  EditorControls()
})
