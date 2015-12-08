var App = require('./modules/editor/App');
var ReactDOM = require('react-dom');
var React = require('react');
var Data = require('./modules/storage/DataDomStore');

ReactDOM.render(
	<App />,
	document.getElementById('vc_v-editor')
);