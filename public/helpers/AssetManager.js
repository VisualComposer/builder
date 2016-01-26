var Mediator = require( './Mediator' );
var path = require( 'path' );

var AssetManager = Mediator.installTo( {

	/**
	 * Up-to-date list of all assets
	 *
	 * @param {Object}
	 */
	assets: {
		scripts: {},
		styles: {}
	},

	/**
	 * Items are only added, never removed
	 *
	 * @param {Object}
	 */
	cache: {
		scripts: {},
		styles: {}
	},

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
		return this.assets[ assetType ];
	},

	/**
	 * @param {string} assetType scripts|styles
	 * @param {string} element Element's name
	 * @param {string} file
	 */
	addAsset: function ( assetType, element, file ) {
		let filepath = path.join( element, file );

		if ( typeof(this.cache[ assetType ][ element ]) === 'undefined' ) {
			this.cache[ assetType ][ element ] = [ filepath ];
		} else if ( this.cache[ assetType ][ element ].indexOf( filepath ) === - 1 ) {
			this.cache[ assetType ][ element ].push( filepath );
		}

		if ( typeof(this.assets[ assetType ][ element ]) === 'undefined' ) {
			this.assets[ assetType ][ element ] = [];
		} else if ( this.assets[ assetType ][ element ].indexOf( filepath ) !== - 1 ) {
			return;
		}

		this.assets[ assetType ][ element ].push( filepath );
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
		for ( let i = 0, len = files.length; i < len; i ++ ) {
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
		for ( let i = 0, len = files.length; i < len; i ++ ) {
			this.addStyle( element, files[ i ] );
		}
	}
} );

AssetManager.subscribe( 'data:add', function ( element ) {
	let elementTag = element.tag.toString();

	if ( typeof(this.cache.scripts[ elementTag ]) !== 'undefined' ) {
		this.addScripts( elementTag, this.cache.scripts[ elementTag ] );
	}

	if ( typeof(this.cache.styles[ elementTag ]) !== 'undefined' ) {
		this.addStyles( elementTag, this.cache.styles[ elementTag ] );
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

		this.assets[ assetTypes[ i ] ] = assets;
	}
} );

module.exports = AssetManager;