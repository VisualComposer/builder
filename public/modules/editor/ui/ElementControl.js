var Mediator = require( '../../../helpers/Mediator' ); // need to remove too
var React = require('react');

var ElementControl = React.createClass({
	propTypes: {
		element: React.PropTypes.string.isRequired,
		name: React.PropTypes.string
	},
	addElement: function(e) {
		e.preventDefault();
		var element = {element: this.props.element};
		// Add element node
		ElementControl.publish('data:add', element);
	},
	render: function() {
		return (<li key={this.props.element}>
			<a onClick={this.addElement}>{this.props.name}</a>
		</li>);
	}
});
Mediator.installTo(ElementControl);
module.exports = ElementControl;