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
		require('./modules/editor-controls-iframe/EditorControls');
	},
	prepareWPPage: function() {
		require('./modules/wordpress/style.less');
		var _this = this;
		jQuery('#vc-v-editor-iframe').load( function () {
			jQuery('#vc-v-frontend-editable-placeholder', this.contentWindow.document).replaceWith('<div id="vc_v-editor">Editor</div>');
			_this.loadServices();
			_this.loadModules();
			_this.publish('app:init', true);
		} );
	},
	init: function() {
		this.prepareWPPage();
	}
});

App.init();







