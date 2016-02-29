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
		document.getElementById('vc_v-editor')
);
require('./ui/NavbarContainer.js');
module.exports = Editor;