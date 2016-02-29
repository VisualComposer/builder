var vcCake = require('vc-cake');
var assetManager = vcCake.getService('asset-manager');
var localStorage = {
  dataKey: 'vcData',
  getItem: function(callback) {
    ajaxPost( {
      action: 'vc:v:getData',
      post_id: window.vcPostID
    }, callback.bind(this) );
  },
  ajaxPost: function ( data, successCallback, failureCallback ) {
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
  },
  update: function(data) {
    var scripts = assetManager.getAssets( 'scripts' ),
      styles = assetManager.getAssets( 'styles' ),
      stylesStringified = JSON.stringify( styles ),
      recompileStyles = window.vcvPostStyles !== stylesStringified;

    window.vcvPostStyles = stylesStringified;

    this.ajaxPost( {
      action: 'vc:v:setData',
      post_id: window.vcPostID,
      content: content,
      data: data,
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

      this.ajaxPost( {
        action: 'vc:v:saveCssBundle',
        contents: contents
      }, function ( request ) {
        var response = JSON.parse( request.response );

        console && console.log( 'CSS bundle saved to', response.data.filename );
      } );

    } );
  }
};

var service = {
  save: function(data) {
    localStorage.update(data);
  },
  get: function(callback) {
    localStorage.getItem(callback);
  }
};

vcCake.addService('wp-storage', service);
