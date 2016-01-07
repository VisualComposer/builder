var Mediator = require( '../../helpers/Mediator' );

var Validator = {
	_valid: false,
	value: null,
	isValid: function () {
		return this._valid;
	},
	setValid: function setValid( value ) {
		this._valid = value;
	},
	checkValue: function checkValue( rules, value ) {
		this.setValid( false );
		if ( rules && Array.isArray( rules ) ) {
			this.setValid( this.checkRules( rules, value ) );
		} else if ( typeof rules === 'string' || rules instanceof String ) {
			this.setValid( this.checkRule( rules, value ) );
		}
		return this.isValid();
	},
	checkRules: function checkRules( rules, value ) {
		window.console && window.console.assert && window.console.assert( rules && Array.isArray( rules ),
			'rules: must be an array' );
		var _this = this;
		return rules.every( function ( rule ) {
			return _this.checkRule( rule, value );
		} )
	},
	checkRule: function checkRule( rule, value ) {
		window.console && window.console.assert && window.console.assert( typeof rule === 'string' || rule instanceof String,
			'rule: must be a string' );
		var info = rule.split( ':' );
		var name = info[ 0 ];
		var options = info.slice( 1 );
		if ( typeof this.rules[ name.toLowerCase() ] === "function" ) {
			return this.rules[ name ].call( this, value, options );
		}
		return false;
	},
	rules: {
		length: function ( value, options ) {
			var min = options[ 0 ];
			var max = options[ 1 ];
			return this.rules.minlength.call( this, value, [ min ] ) && this.rules.maxlength.call( this,
					value,
					[ max ] );
		},
		minlength: function ( value, options ) {
			if ( ! value || ! options || ! options[ 0 ] ) {
				return false;
			}
			return value.length >= options[ 0 ];
		},
		maxlength: function ( value, options ) {
			if ( ! value || ! options || ! options[ 0 ] ) {
				return false;
			}
			return value.length <= options[ 0 ];
		},
		value: function ( value, options ) {
			var min = options[ 0 ];
			var max = options[ 1 ];
			return this.rules.minvalue.call( this, value, [ min ] ) && this.rules.maxvalue.call( this, value, [ max ] );
		},
		minvalue: function ( value, options ) {
			if ( ! value || ! options || ! options[ 0 ] ) {
				return false;
			}
			var fl = parseFloat( value );

			return ! isNaN( fl ) && value >= parseFloat( options[ 0 ] );
		},
		maxvalue: function ( value, options ) {
			if ( ! value || ! options || ! options[ 0 ] ) {
				return false;
			}
			var fl = parseFloat( value );

			return ! isNaN( fl ) && value <= parseFloat( options[ 0 ] );
		},
		required: function ( value ) {
			return this.rules.minlength.call( this, value, [ 1 ] );
		}
	}
};

module.exports = Validator;
Mediator.addService( 'validation', Validator );