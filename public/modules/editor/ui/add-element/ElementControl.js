var Mediator = require( '../../../../helpers/Mediator' );
var Elements = require( '../../../../helpers/Elements' );
var React = require('react');

module.exports = React.createClass(Mediator.installTo({
	propTypes: {
		tag: React.PropTypes.object.isRequired,
		name: React.PropTypes.object.isRequired
	},
	addElement: function(e) {
		e.preventDefault();
		var data = Elements.getElementData(this.props.tag.toString());
		// Add element node
		this.publish('data:add', data);
	},
	render: function() {
		return (<li key={this.props.key}>
			<a onClick={this.addElement}>
				{ this.props.icon ? <span className={this.props.icon.toString()}></span> : null}
				<br/>{this.props.name.toString()}
			</a>
		</li>);
	}
}));
