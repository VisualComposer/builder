var vcCake = require('vc-cake');
require('./wp-services');
vcCake.env('platform', 'worpdress').start(function() {
	var $ = require('jquery');
	require('./modules/wordpress/style.less');
	$('#vc-v-editor-iframe').load( function () {
		$('#vc-v-frontend-editable-placeholder', this.contentWindow.document).replaceWith('<div id="vc_v-editor">Editor</div>');
	} );
	require('./wp-modules');
});
window.app = vcCake;
