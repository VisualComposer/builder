var vcCake = require('vc-cake');

vcCake.add('ui-editor-controls', function(api) {
  var controlsHandler = require('imports?$=jquery!./lib/controls-handler.js');
  var ControlsTrigger = {};
  require('./css/controls/editor-controls-init.less');

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
    api.reply('start', function() {
      $(document).on('mousemove hover', '[data-vc-element]', ControlsTrigger.triggerShowFrame);
      $(document).on('mousemove hover', 'body', ControlsTrigger.triggerHideFrame);
      $(document).on('mousemove hover', '.visual-composer', function(e) {
        e.stopPropagation();
      });
      $(document).on('click', '[data-vc-control-event]', function(e) {
        var $el = $(e.currentTarget);
        var event = $el.data('vcControlEvent');
        var elementId = $el.data('vcElementId');
        e.preventDefault();
        console.log(event);
        api.request(event, elementId);
        controlsHandler.hideOutline();
      });
      $(document).on('scroll', ControlsTrigger.triggerRedrawFrame);
    });
    return controlsHandler;
  };
  new EditorControls();
});


