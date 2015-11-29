var App = require('./modules/editor/App');
var ReactDOM = require('react-dom');
var React = require('react');

var AppStoreController = require('./app/EditorStoreController.js');

ReactDOM.render(
	<App />,
	document.getElementById('vc_v-editor')
);