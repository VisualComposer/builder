var vcCake = require('vc-cake');
require('./wp-services');
var $ = require('expose?$!jquery');
$(document).ready(function(){
  require('./sources/css/wordpress.less');

  $( '#vcv-editor-iframe' ).load(function(){
    var iframeDocument = $( '#vcv-editor-iframe' ).get( 0 ).contentWindow.document;
    $('[data-vcv="edit-fe-editor"]', iframeDocument ).remove();
    $('#vcv-editor-iframe').height($(window).height()-64);
    vcCake.env('platform', 'wordpress').start(function() {
      require('./wp-modules');
    });
  });
});
window.app = vcCake;
