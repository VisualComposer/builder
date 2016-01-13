var React = require( 'react' );
var ParamMixin = require( '../param-mixin' );
var Setter = require( './Setter' );
var ElementComponents = require( '../../../helpers/ElementComponents' );
var Mediator = require( '../../../helpers/Mediator' );

module.exports = React.createClass( {
	mixins: [ ParamMixin ],
	setter: Setter,
	getParams: function ( component ) {
		return ElementComponents.get( component );
	},
	getComponent: function ( component ) {
		return require( '../' + component + '/Component' );
	},
	getElement: function ( name, settings, value, element ) {
		if ( 'public' === settings.getAccess() ) {
			var ComponentView = this.getComponent( settings.getType().toLowerCase() );
			return React.createElement( ComponentView, {
				value: value,
				key: Mediator.getService( 'utils' ).createKey(),
				element: element,
				settings: settings,
				name: name
			} );
		}
		return null;
	},
	customHandleChange: function ( e ) {
		var settings = this.props.settings.getSettings();
		var params = settings.params || this.getParams( settings.component.charAt( 0 ).toUpperCase() + settings.component.slice(
					1 ) );
		var values = {};
		if ( Object.getOwnPropertyNames( params ).length ) {
			Object.keys( params ).forEach( function ( key ) {
				var paramSettings = params[ key ];
				var name = this.props.name + key;
				var element = this.props.element; // todo check and fix
				if ( 'public' === paramSettings.getAccess() ) {
					var value = this.getInnerValue( name, paramSettings, element );
					values[ key ] = value;
				}
			}, this );
		}
		console.log( values );

		this.setState( { value: values } );
		this.updateElement( values );
	},
	getInnerValue: function ( name, settings, element ) {
		var Getter = require( '../' + settings.getType().toLowerCase() + '/Getter' );

		return Getter( element, name );
	},
	render: function () {
		var settings = this.props.settings.getSettings();
		if ( settings && settings.component ) {
			// render component params
			//ucfirst
			var returnList = "";
			var values = JSON.parse( this.props.value ) || {};
			var params = settings.params || this.getParams( settings.component.charAt( 0 ).toUpperCase() + settings.component.slice(
						1 ) );
			if ( Object.getOwnPropertyNames( params ).length ) {
				returnList = Object.keys( params ).map( function ( key ) {
					var ParamSettings = params[ key ];
					var ParamView = this.getElement( this.props.name + key,
						ParamSettings,
						values[ key ] || "",
						this.props.element );
					if ( ParamView ) {
						return (<div className="vc-v-form-row" key={['vc-v-edit-form-element-' , this.props.name +key]}>
							<label>{ParamSettings.getTitle()}</label>
							<div className="vc-v-form-row-control">
								{ParamView}
							</div>
						</div>);
					}
				}, this );
			}
			return (
				<div ref={this.props.name + 'Component'} value={this.state.value}>Component {this.props.name} {JSON.stringify(
					params )} {returnList} {JSON.stringify(this.state.value)}
					<button onClick={this.customHandleChange}>Save component</button>
				</div>
			);
		} else {
			// return error. component must exist.
			throw new Error( 'no component provided for settings' + this.props.name );
		}
	}
} );
