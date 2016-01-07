var Mediator = require( './helpers/Mediator' ); // need to remove
require("bootstrap-webpack");
var App = Mediator.installTo({
	loadServices: function() {
		require('./helpers/Utils');
		require('./helpers/attributes/Attribute');
	},
	loadModules: function() {
		// TimeMachine module
		require('./modules/time-machine/TimeMachine');
		// Editor module
		require('./modules/editor/Editor');
		// Data Storage module
		require('./modules/storage/WpDataDOMStore');
		// Editor Controls
		var EditorControls = require('imports?$=jquery!./modules/editor-controls/EditorControls');
	},
	prepareWPPage: function() {
		require('./modules/wordpress/style.less');
		window.document.getElementsByClassName('entry-content')[0].innerHTML = '<div id="vc_v-editor"></div>';
	},
	init: function() {
		this.prepareWPPage();
		this.loadServices();
		this.loadModules();
		this.publish('app:init', true);
	}
});

App.init();







