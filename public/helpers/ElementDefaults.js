let ElementComponents = require( './ElementComponents' ); // need to remove too

module.exports = {
	data: {},
	get: function ( tag ) {
		if ( this.data[ tag ] ) {
			return this.data[ tag ];
		}
		let list = ElementComponents.getElementsList();
		let data = list[ tag ] || {};
		let returnData = {};
		Object.keys( data ).forEach( function ( k ) {
			returnData[ k ] = data[ k ].getDefault();
		}, this );
		this.data[ tag ] = returnData;
		return returnData;
	}
};