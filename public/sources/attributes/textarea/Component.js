var React = require('react');
var ParamMixin = require('../param-mixin.js');
var Setter = require('./Setter');
module.exports = React.createClass({
	mixins: [ParamMixin],
	setter: Setter,
	render: function() {
		console.log('render textarea');

		return (<div><label>{this.props.settings.getTitle()}</label><textarea
			onChange={this.handleChange}
			ref={this.props.name + 'Component'}
			value={this.state.value}/></div>);
	}
});
