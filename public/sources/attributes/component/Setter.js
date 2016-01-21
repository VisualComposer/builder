module.exports = function ( element, key, value ) {
	element.setAttribute( key, JSON.stringify( value ) );
};