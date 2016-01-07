var Mediator = require( '../../../../helpers/Mediator' );
var ElementComponents = require( '../../../../helpers/ElementComponents' );
var React = require( 'react' );
var classNames = require( 'classnames' );

module.exports = React.createClass( Mediator.installTo( {
	propTypes: {
		tag: React.PropTypes.string.isRequired,
		name: React.PropTypes.string.isRequired
	},
	addElement: function ( e ) {
		e.preventDefault();
		var data = ElementComponents.get( this.props.tag );
		// Add element node
		this.publish( 'data:add', data );
	},
	render: function () {
		var className;

		if ( this.props.icon ) {
			className = classNames( 'glyphicon', this.props.icon );
		}

		return <li key={this.props.key}>
			<a onClick={this.addElement}>
				{ this.props.icon ? <span className={className}></span> : null}
				{this.props.name}
			</a>
		</li>;
	}
} ) );
