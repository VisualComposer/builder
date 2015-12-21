var Mediator = require( '../../../helpers/Mediator' );
var Utils = require( '../../../helpers/Utils' );
var React = require('react');

var ElementControl = React.createClass({
	propTypes: {
		tag: React.PropTypes.string.isRequired,
		name: React.PropTypes.string.isRequired
	},
	addElement: function(e) {
		e.preventDefault();
		var element = {tag: this.props.tag};
		// Add element node
		ElementControl.publish('data:add', element);
	},
	render: function() {
		return (<li key={this.props.key}>
			<a onClick={this.addElement}>
				{ this.props.icon ? <span className={this.props.icon}></span> : null}
				<br/>{this.props.name}
			</a>
		</li>);
	}
});
Mediator.installTo(ElementControl);
module.exports = ElementControl;