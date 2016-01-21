var React = require('react');
var ParamMixin = require('../param-mixin');
var Setter = require('./Setter');

module.exports = React.createClass({
    mixins: [ParamMixin],
    setter: Setter,
    render: function() {
		console.log('render innerhtml');
        return (
			<div>
				<label>{this.props.settings.getTitle()}</label>
				<textarea
					ref={this.props.name + 'Component'}
					value={this.state.value} onChange={this.handleChange}/>
			</div>
		);
    }
});
