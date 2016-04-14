var vcCake = require('vc-cake');
require('./config/wp-services');
require('./config/wp-attributes');
var $ = require('expose?$!jquery');
$(document).ready(function(){
  require('./sources/css/wordpress.less');

  $( '#vc-v-editor-iframe' ).load(function(){
    var iframeDocument = $( '#vc-v-editor-iframe' ).get( 0 ).contentWindow.document;
    $('[data-vc-v="edit-fe-editor"]', iframeDocument ).remove();
    $('#vc-v-editor-iframe').height($(window).height()-64);
    vcCake.env('platform', 'wordpress').start(function() {
      require('./config/wp-modules');
    });
  });
});
window.app = vcCake;
