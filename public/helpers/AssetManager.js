var Mediator = require( './Mediator' );
var path = require( 'path' );

var AssetManager = Mediator.installTo( {
	scripts: {},
	styles: {},

	/**
	 * @return {Object}
	 */
	getScripts: function () {
		return this.getAssets( 'scripts' );
	},

	/**
	 * @return {Object}
	 */
	getStyles: function () {
		return this.getAssets( 'styles' );
	},

	/**
	 * @param {string} assetType
	 * @return {Object}
	 */
	getAssets: function ( assetType ) {
		return this[ assetType ];
	},

	/**
	 * @param {string} assetType scripts|styles
	 * @param {string} element Element's name
	 * @param {string} file
	 */
	addAsset: function ( assetType, element, file ) {
		let filepath = path.join( element, file );

		if ( typeof(this[ assetType ][ element ]) === 'undefined' ) {
			this[ assetType ][ element ] = [];
		} else if ( this[ assetType ][ element ].indexOf( filepath ) !== - 1 ) {
			return;
		}

		this[ assetType ][ element ].push( filepath );
	},

	/**
	 * @param {string} element Element's name
	 * @param {string} file
	 */
	addScript: function ( element, file ) {
		if ( ! path.extname( file ) ) {
			file = file + '.js';
		}

		this.addAsset( 'scripts', element, file );
	},

	/**
	 * @param {string} element Element's name
	 * @param {string[]} files
	 */
	addScripts: function ( element, files ) {
		for ( let i = files.length - 1; i >= 0; i -- ) {
			this.addScript( element, files[ i ] );
		}
	},

	/**
	 * @param {string} element Element's name
	 * @param {string} file
	 */
	addStyle: function ( element, file ) {
		if ( ! path.extname( file ) ) {
			file = file + '.css';
		}

		this.addAsset( 'styles', element, file );
	},

	/**
	 * @param {string} element Element's name
	 * @param {string[]} files
	 */
	addStyles: function ( element, files ) {
		for ( let i = files.length - 1; i >= 0; i -- ) {
			this.addStyle( element, files[ i ] );
		}
	}
} );

/**
 * Get all unique elements on page (their tag names) and remove all orphaned assets
 */
AssetManager.subscribe( 'data:remove', function ( id ) {
	let document = Mediator.getService( 'data' ).getDocument();
	let assetTypes = [ 'scripts', 'styles' ];
	let elements = document.getElementsByTagName( '*' );
	let tagNames = [];

	for ( let i = elements.length - 1; i >= 0; i -- ) {
		if ( tagNames.indexOf( elements[ i ].nodeName ) === - 1 ) {
			tagNames.push( elements[ i ].nodeName );
		}
	}

	for ( let i = assetTypes.length - 1; i >= 0; i -- ) {
		let assets = this.getAssets( assetTypes[ i ] );

		for ( let element in assets ) {
			if ( tagNames.indexOf( element ) === - 1 ) {
				delete assets[ element ];
			}
		}

		this[ assetTypes[ i ] ] = assets;
	}
} );

module.exports = AssetManager;