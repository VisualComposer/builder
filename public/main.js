var Mediator = require( './_helpers/Mediator' ); // need to remove
var App = Mediator.installTo({
	loadServices: function() {
		require('./_helpers/Utils');
		require('./_helpers/attributes/Attribute');
	},
	loadModules: function() {
		// TimeMachine module
		require('./_modules/time-machine/TimeMachine');
		// Editor module
		require('./_modules/editor/Editor');
		// Data Storage module
		require('./_modules/storage/DataDomStore');
		// Editor Controls
		require('./_modules/editor-controls/EditorControls');
	},
	init: function() {
		this.loadServices();
		this.loadModules();
		this.publish('app:init', true);
		window.App = Mediator;
	}
});
App.init();







