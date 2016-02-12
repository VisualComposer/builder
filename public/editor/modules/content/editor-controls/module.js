var vcCake = require('vc-cake');

vcCake.add('ui-editor-controls', function() {
  var controlsHandler = require('imports?$=jquery!./lib/controls-handler.js');
  var ControlsTrigger = {};
  require('./css/controls/editor-controls-init.less');

  ControlsTrigger.triggerShowFrame = function(e) {
    e.stopPropagation();
    controlsHandler.showOutline($(e.currentTarget));
  };

  ControlsTrigger.triggerHideFrame = function(e) {
    controlsHandler.hideOutline();
  };

  ControlsTrigger.triggerRedrawFrame = function(e) {
    controlsHandler.drawOutlines();
  };
  Mediator.installTo(controlsHandler);

  var EditorControls = function() {
    controlsHandler.subscribe('app:init', function() {
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
        controlsHandler.publish(event, elementId);
        controlsHandler.hideOutline();
      });
      $(document).on('scroll', ControlsTrigger.triggerRedrawFrame);
    });
    return controlsHandler;
  };
  new EditorControls();
});


