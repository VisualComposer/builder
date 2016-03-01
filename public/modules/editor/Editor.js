var React = require('react');
var ReactDOM = require('react-dom');
var EditorUI = require('./ui/Editor.js');
var Mediator = require( '../../helpers/Mediator' ); // need to remove

// create module
var Editor = {

};

Mediator.installTo(Editor);
ReactDOM.render(
		<EditorUI />,
		jQuery( '#vc_v-editor', jQuery( '#vc-v-editor-iframe' ).get( 0 ).contentWindow.document ).get(0)
);
require('./ui/NavbarContainer.js');
module.exports = Editor;