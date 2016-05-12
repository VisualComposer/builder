var vcCake = require('vc-cake');
var assetManager = vcCake.getService('asset-manager');
var $ = require('jquery');

var defaultContent = {
  "responseText": "" /* JSON.stringify(
    {
      "611bc1c9": {
        "tag": "exampleButton",
        "name": "Example Button 1.0",
        "color": "red",
        "select": "4",
        "id": "611bc1c9",
        "parent": false,
        "order": 0
      },
      "611bc1c8": {
        "tag": "exampleButton",
        "name": "Example Button 1.0",
        "color": "red",
        "select": "4",
        "id": "611bc1c8",
        "parent": false,
        "order": 1
      }
    }
  )*/
}
var wordpressStorage = {
  dataKey: 'vcData',
  getItem: function(callback) {
    callback(defaultContent);
    return;
    // FEATURE TOOGLE.
    if (false) {
      this.ajaxPost({
        "vcv-action": 'getData:adminNonce',
        "vcv-nonce": window.vcvNonce,
        "vcv-source-id": window.vcvSourceID
      }, callback.bind(this));
    }
  },
  ajaxPost: function ( data, successCallback, failureCallback ) {
    var request = new XMLHttpRequest();
    request.open( 'POST', window.vcvAjaxUrl, true );
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
    request.send( $.param( data ) );
  },
  update: function(data) {
    return false; // FEATURE TOGGLE.
    var content = document.getElementsByClassName( 'vc-v-layouts-clean-html' )[ 0 ].innerHTML.replace(
      /\s+data\-reactid="[^"]+"/,
      '' ),
      scripts = assetManager.getAssets( 'scripts' ),
      styles = assetManager.getAssets( 'styles' ),
      stylesStringified = JSON.stringify( styles ),
      recompileStyles = window.vcvPostStyles !== stylesStringified;

    window.vcvPostStyles = stylesStringified;

    this.ajaxPost( {
      "vcv-action": 'setData:adminNonce',
      "vcv-nonce": window.vcvNonce,
      "vcv-source-id": window.vcvSourceID,
      "vcv-content": content,
      "vcv-data": data,
      "vcv-scripts": scripts,
      "vcv-styles": styles
    }, function ( request ) {
      console && console.log( 'Data saved.' );

      if ( ! recompileStyles ) {
        return;
      }

      console && console.log( 'Recompiling less...' );

      var response = JSON.parse( request.response||'{}' );
      var contents = '';
      if (response) {
        for (let i = response.data.styleBundles.length - 1; i >= 0; i--) {
          var bundle = response.data.styleBundles[i];

          less.render(bundle.contents, {
              filename: bundle.filename,
              compress: true
            },
            function(e, output) {
              contents += output.css + "\n";
            });
        }
      }
      this.ajaxPost( {
        "vcv-action": 'saveCssBundle:adminNonce',
        "vcv-nonce": window.vcvNonce,
        "vcv-contents": contents
      }, function ( request ) {
        var response = JSON.parse( request.response||'{}' );
        if (response) {
          console && console.log('CSS bundle saved to', response.data.filename);
        } else {
          console && console.error('css bundle not saved');
        }
      } );

    } );
  }
};

var service = {
  save: function(data) {
    wordpressStorage.update(data);
  },
  get: function(callback) {
    wordpressStorage.getItem(callback);
  }
};

vcCake.addService('wordpress-storage', service);
