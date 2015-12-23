var Mediator = require( './helpers/Mediator' ); // need to remove
var App = Mediator.installTo({
	loadModules: function() {
		// Create autoloader or mapper via mediator;

		// Editor module
		require('./modules/editor/Editor');
		// Data Storage module
		require('./modules/storage/DataDomStore');
		// Editor Controls
		var EditorControls = require('./modules/editor-controls/EditorControls');
	},
	init: function() {
		this.loadModules();
		this.publish('app:init', true);
	},
});
App.init();







