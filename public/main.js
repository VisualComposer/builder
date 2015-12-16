var Mediator = require( './helpers/Mediator' ); // need to remove
var App = {
	loadModules: function() {
		// Create autoloader or mapper via mediator;

		// Editor module
		var Editor = require('./modules/editor/Editor');
		// Data Storage module
		var Data = require('./modules/storage/DataDomStore');
		// Editor Controls
		// @todo move inside editor. For example still here
		// var EditorControls = require('./modules/editor-controls/EditorControls');
	},
	init: function() {
		this.loadModules();
		this.publish('app:init', true);
	},
};
Mediator.installTo(App);

App.init();







