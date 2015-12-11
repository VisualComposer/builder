var Mediator = require( '../../helpers/Mediator' ); // need to remove too
var controlsHandler = require('./lib/ControlsHandler.js');
var ControlsTrigger = {};
require('./Controls.less');

ControlsTrigger.triggerShowFrame = function ( e ) {
    e.stopPropagation();
    controlsHandler.showOutline($(e.currentTarget));
};

ControlsTrigger.triggerHideFrame = function ( e ) {
    controlsHandler.hideOutline();
};

ControlsTrigger.triggerRedrawFrame = function ( e ) {
    controlsHandler.drawOutlines();
};
Mediator.installTo(controlsHandler);

var EditorControls = function() {
    controlsHandler.subscribe('data:changed', function(){
        $( document ).on( 'mousemove hover', 'section', ControlsTrigger.triggerShowFrame );
        $( document ).on( 'mousemove hover', 'body', ControlsTrigger.triggerHideFrame );
        $( document ).on( 'scroll', ControlsTrigger.triggerRedrawFrame );
    });
    return controlsHandler;
}

module.exports = new EditorControls();

