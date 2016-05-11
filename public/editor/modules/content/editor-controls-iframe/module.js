var vcCake = require('vc-cake');
var ControlsTrigger = {};

require('./css/controls/init.less');
vcCake.add('ui-editor-controls', function(api) {
  var $ = require('jquery');
  var controlsHandler = require('imports?$=jquery!./lib/controls-handler.js');
  var showControls = true;
  api.addAction('enableControls', function(state) {
    showControls = !!state;
    if (!showControls) {
      controlsHandler.hideOutline();
    }
  });
  ControlsTrigger.triggerShowFrame = function(e) {
    e.stopPropagation();
    showControls && controlsHandler.showOutline($(e.currentTarget));
  };

  ControlsTrigger.triggerHideFrame = function(e) {
    controlsHandler.hideOutline();
  };

  ControlsTrigger.triggerRedrawFrame = function(e) {
    showControls && controlsHandler.drawOutlines();
  };

  var EditorControls = function() {
    var editorWrapper = document.getElementById('vc-editor-container');
    if (!editorWrapper) {
      editorWrapper = document.createElement('div');
      editorWrapper.setAttribute('id', 'vc-editor-container');
      document.body.appendChild(editorWrapper);
    }

    var controlsWrapper = document.createElement('div');
    controlsWrapper.setAttribute('id', 'vc-ui-controls-container');
    editorWrapper.appendChild(controlsWrapper);

    api.reply('start', function() {
      var iframeDocument = $('#vc-v-editor-iframe').get(0).contentWindow.document;
      $(iframeDocument).on('mousemove hover', '[data-vc-element]', ControlsTrigger.triggerShowFrame);
      $(iframeDocument).on('mousemove hover', 'body', ControlsTrigger.triggerHideFrame);
      $(document).on('mousemove hover', '.vc-ui-outline-controls-container', function(e) {
        e.stopPropagation();
      });
      $(document).on('click', '[data-vc-control-event]', function(e) {
        var $el = $(e.currentTarget);
        var event = $el.data('vcControlEvent');
        var elementId = $el.data('vcElementId');
        e.preventDefault();
        api.request(event, elementId);
        controlsHandler.hideOutline();
      });
      $(document).on('scroll resize', ControlsTrigger.triggerRedrawFrame);
      $(iframeDocument).on('scroll resize', ControlsTrigger.triggerRedrawFrame);
    });
    return controlsHandler;
  };
  new EditorControls();
});
