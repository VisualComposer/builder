var React = require( 'react' );
var ParamMixin = require( '../param-mixin' );
var Setter = require( './Setter' );
module.exports = React.createClass( {
	mixins: [ ParamMixin ],
	setter: Setter,
	options: [],
	componentWillMount: function () {
		let settings = this.props.settings.getSettings(),
			options = settings.options ? settings.options : [];

		this.options = this.normalizeOptions( options );
	},

	/**
	 * Convert options into standardized form
	 *
	 * Options can be passed as:
	 * - Array of objects: [ { value: 'LV', label: 'Latvia' }, { value: 'LT', label: 'Lithuania' }, { value: 'EE', label: 'Estonia' } ]
	 * - Object: { 'LV': 'Latvia', 'LT': 'Lithuania', 'EE': 'Estonia' }
	 * - Array: [ 'Latvia', 'Lithuania', 'Estonia' ]
	 *
	 * and are returned as first variant (array of objects)
	 *
	 * @param options Object
	 * @returns Object
	 */
	normalizeOptions: function ( options ) {
		var isArray = Object.prototype.toString.call( options ) === '[object Array]',
			normalizedOptions = [];

		if ( ! options ) {
			return normalizedOptions;
		}

		for ( let key in
			options ) {
			let item;

			if ( ! options.hasOwnProperty( key ) ) {
				continue;
			}

			if ( typeof(options[ key ]) === 'string' ) {
				if ( isArray ) {
					item = { value: options[ key ], label: options[ key ] };
				} else {
					item = { value: key, label: options[ key ] }
				}
			} else {
				item = { value: options[ key ].value, label: options[ key ].label };
			}

			normalizedOptions.push( item );
		}

		return normalizedOptions;
	},

	customHandleChange: function ( e ) {
		var value = {
			value: Array.from( this.refs[ this.props.name + 'Component' ].querySelectorAll( '[name*=' + this.props.name + ']:checked' ) ).map(
				function ( item ) {
					return item.value;
				} ).join()
		};
		this.props.rulesManager.onChange(value);
		this.setState( value );
		this.updateElement( value.value );
	},
	render: function () {
		// TODO: change key to something unique
		console.log( 'render checkbox' );
		var optionElements = [<option key="-1"></option>];
		var settings = this.props.settings.getSettings();
		var options = this.options;
		var type = settings.type || 'checkbox';
		var multiple = type == 'checkbox';
		var name = multiple ? this.props.name + '[]' : this.props.name;
		var values = (this.state.value || "").split( ',' );
		for ( let key in
			options ) {
			let value = options[ key ].value;
			let checked = values.indexOf( value ) !== - 1 ? "checked" : "";
			optionElements.push(
				<label key={value}>
					<input type={type} name={name} onChange={this.customHandleChange} checked={checked} value={value}/>
					{options[ key ].label}
				</label>
			);
		}
		return (
			<div ref={this.props.name + 'Component'} value={this.state.value}>
				<label>{this.props.settings.getTitle()}</label>
				{optionElements}
			</div>
		);
	}
} );
