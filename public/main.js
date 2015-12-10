var Editor = require('./modules/editor/Editor');
var React = require('react');
var ReactDOM = require('react-dom');
var Data = require('./modules/storage/DataDomStore');
var EditorControls = require('./modules/editor-controls/EditorControls');
var controls = new EditorControls();

ReactDOM.render(
	<Editor />,
	document.getElementById('vc_v-editor')
);