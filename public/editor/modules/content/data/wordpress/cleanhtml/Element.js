var React = require( 'react' );
var Utils = require( '../../.././Utils' );
var Mediator = require( '../../.././Mediator' );
var ElementComponents = require( '../../.././ElementComponents' );

var Element = React.createClass( Mediator.installTo( {
	getContent: function ( content ) {
		var ElementComponent = ElementComponents.get( this.props.element ); // optimize
		if ( 'container' == ElementComponent.type ) {
			return this.props.data.map( function ( element ) {
				let data = Array.prototype.slice.call( element.childNodes );
				return <Element element={element} data={data} key={element.getAttribute('id')}/>;
			} );
		}
		return content;
	},
	getElementAttributes: function () {
		let element = this.props.element;
		let ElementComponent = ElementComponents.get( element );
		var atts = {};
		Object.keys( ElementComponent ).map( function ( key ) {
			let option = ElementComponent[ key ];
			let value = Mediator.getService( 'attributes' ).getElementValue( key, option, element );
			if ( 'undefined' !== typeof(value) && null !== value ) {
				atts[ key ] = value;
			}
		}, this );
		return atts;
	},
	render: function () {
		var element = this.props.element;
		var ElementView = ElementComponents.getElement( element );
		var elementAttributes = this.getElementAttributes();
		return React.createElement( ElementView, {
			...elementAttributes,
			content: this.getContent( elementAttributes.content ),
		} );
	}
} ) );
module.exports = Element;