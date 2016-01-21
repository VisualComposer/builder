var React = require( 'react' );
require( './ImageGallery.less' );
require( 'jquery' );
require( 'fancybox' )( jQuery );
require( '../../../../node_modules/fancybox/dist/css/jquery.fancybox.css' );

var ImageGallery = React.createClass( {
	componentWillMount: function () {
		this.galleryID = 'vc-image-gallery-' + Math.random().toString().substr( 2 );
	},
	componentDidMount: function () {
		$( '#' + this.galleryID + ' a' ).fancybox( {
			href: this.href,
			type: 'image'
		} );
	},
	render: function () {
		var images,
			galleryID = this.galleryID,
			{ key, urls, editor, ...other } = this.props;

		images = urls.split( ',' ).map( function ( url ) {
			// TODO: key must be something else, because url is not necessarily unique
			return (
				<a href={url} key={url} rel={galleryID}>
					<img src={url} width="190" height="145" alt=""/>
				</a>
			);
		} );

		return (
			<div className="vc-image-gallery" id={galleryID} key={key} {...editor}>
				{images}
			</div>
		);
	}
} );
module.exports = ImageGallery;