var Mediator = require( '../../helpers/Mediator' ); // need to remove too
var controlsHandler = require('./lib/ControlsHandler.js');
var ControlsTrigger = {};
require('./less/controls/editor-controls-init.less');

ControlsTrigger.triggerShowFrame = function ( e ) {
    e.stopPropagation();
    controlsHandler.showOutline(jQuery(e.currentTarget));
};

ControlsTrigger.triggerHideFrame = function ( e ) {
    controlsHandler.hideOutline();
};

ControlsTrigger.triggerRedrawFrame = function ( e ) {
    controlsHandler.drawOutlines();
};
Mediator.installTo(controlsHandler);

var EditorControls = function() {
    controlsHandler.subscribe('app:init', function(){
        let $ = jQuery;
        $( document ).on( 'mousemove hover', '[data-vc-element]', ControlsTrigger.triggerShowFrame );
        $( document ).on( 'mousemove hover', 'body', ControlsTrigger.triggerHideFrame );
        $( document ).on( 'mousemove hover', '.visual-composer', function ( e ) {
			e.stopPropagation();
		});
        $(document).on('click', '[data-vc-control-event]', function(e){
            var event = $(e.currentTarget).data('vcControlEvent');
            var elementId = $(e.currentTarget).data('vcElementId');
            e.preventDefault();
            controlsHandler.publish(event, elementId);
            controlsHandler.hideOutline();
        });
        $( document ).on( 'scroll', ControlsTrigger.triggerRedrawFrame );
    });
    return controlsHandler;
};

module.exports = new EditorControls();

