var Data = require( './Storage' );
var Storage = require( './PostMetaData' );
var AssetManager = require( '../../helpers/AssetManager' );

// Add to app
var getData = function ( document ) {
  let data = Array.prototype.slice.call( document.childNodes );
  let elementsList = data.map( function ( element ) {
    return element.innerHTML;
  } );
  return elementsList.join();
};
// @todo rewrite with promises
var ajaxPost = function ( data, successCallback, failureCallback ) {
  var request = new XMLHttpRequest();
  request.open( 'POST', window.vcAjaxUrl, true );
  request.setRequestHeader( "Content-type", "application/x-www-form-urlencoded" );
  request.onload = function () {
    if ( request.status >= 200 && request.status < 400 ) {
      successCallback( request );
    } else {
      if ( 'function' === typeof failureCallback ) {
        failureCallback( request );
      }
    }
  };
  request.send( jQuery.param( data ) );
};
Data.subscribe( 'app:init', function () {
  ajaxPost( {
    action: 'vc:v:getData:adminNonce',
    nonce: window.vcNonce,
    source_id: window.vcSourceID
  }, function ( request ) {
    var newDocument = Data.parse( '<Root id="vc-v-root-element">' + request.responseText + '</Root>' );
    if ( newDocument.childNodes ) {
      Data.setDocument( newDocument );
      Data.publish( 'data:changed', Data.getDocument() );
    }
  } );
} );
Data.subscribe( 'app:save', function () {
  var content = document.getElementsByClassName( 'vc-v-layouts-cleanhtml' )[ 0 ].innerHTML.replace(
    /\s+data\-reactid="[^"]+"/g,
    '' ),
    scripts = AssetManager.getAssets( 'scripts' ),
    styles = AssetManager.getAssets( 'styles' ),
    stylesStringified = JSON.stringify( styles ),
    recompileStyles = window.vcvPostStyles !== stylesStringified;

  window.vcvPostStyles = stylesStringified;

  ajaxPost( {
    action: 'vc:v:setData:adminNonce',
    nonce: window.vcNonce,
	source_id: window.vcPostID,
    content: content,
    data: getData( Data.getDocument() ),
    scripts: scripts,
    styles: styles
  }, function ( request ) {
    console && console.log( 'Data saved.' );

    if ( ! recompileStyles ) {
      return;
    }

    console && console.log( 'Recompiling less...' );

    var response = JSON.parse( request.response );
    var contents = '';

    for ( let i = response.data.styleBundles.length - 1; i >= 0; i -- ) {
      var bundle = response.data.styleBundles[ i ];

      less.render( bundle.contents, {
          filename: bundle.filename,
          compress: true
        },
        function ( e, output ) {
          contents += output.css + "\n";
        } );
    }

    ajaxPost( {
      action: 'vc:v:saveCssBundle:adminNonce',
      nonce: window.vcNonce,
      contents: contents
    }, function ( request ) {
      var response = JSON.parse( request.response );

      console && console.log( 'CSS bundle saved to', response.data.filename );
    } );

  } );
} );
window.vcData = Data; // @todo should be removed.

module.exports = Data;