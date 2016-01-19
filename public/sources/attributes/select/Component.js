var React = require('react');
var ParamMixin = require('../param-mixin');
var Setter = require('./Setter');
module.exports = React.createClass({
	mixins: [ParamMixin],
	setter: Setter,
	render: function () {
		console.log('render select');
		// TODO: change key to something unique
		var optionElements = [<option key="-1"></option>],
			options = this.props.settings.getSettings().options;

		Object.keys(options).forEach(function (key) {
			optionElements.push(<option key={key} value={key}>{options[key]}</option>);
		});

		return (
			<div>
				<label>{this.props.settings.getTitle()}</label>
				<select
					onChange={this.handleChange}
					ref={this.props.name + 'Component'}
					value={this.state.value}
				>
				{optionElements}
				</select>
			</div>
		);
	}
});
