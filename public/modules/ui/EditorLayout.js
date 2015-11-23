var React = require('react');
require('./EditorLayout.less');
var Utils = require('../helpers/Utils');
var EditorLayout = React.createClass({
	render: function() {
		let elementsList = this.props.data.map(function(element){
			var Component = require('../elements/' + element.element);
			return React.createElement(Component, {key: Utils.createKey()});
		});
		return (<div className="vc_v-content">
			{elementsList}
		</div>);
	}
});

module.exports = EditorLayout;