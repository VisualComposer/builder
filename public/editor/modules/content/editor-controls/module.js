var vcCake = require('vc-cake');

vcCake.add('ui-editor-controls', function(api) {
  var controlsHandler = require('imports?$=jquery!./lib/controls-handler.js');
  var ControlsTrigger = {};
  require('./css/module.less');

  ControlsTrigger.triggerShowFrame = function(e) {
    e.stopPropagation();
    controlsHandler.showOutline($(e.currentTarget));
  };

  ControlsTrigger.triggerHideFrame = function() {
    controlsHandler.hideOutline();
  };

  ControlsTrigger.triggerRedrawFrame = function() {
    controlsHandler.drawOutlines();
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
      $(document).on('mousemove hover', '[data-vc-element]', ControlsTrigger.triggerShowFrame);
      $(document).on('mousemove hover', 'body', ControlsTrigger.triggerHideFrame);
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
    });
    return controlsHandler;
  };
  new EditorControls();
});


