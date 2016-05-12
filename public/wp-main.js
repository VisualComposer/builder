var vcCake = require('vc-cake');
require('./config/wp-services');
require('./config/wp-attributes');
var $ = require('expose?$!jquery');
$(document).ready(function(){
  require('./sources/css/wordpress.less');

  $( '#vcv-editor-iframe' ).load(function(){
    var iframeDocument = $( '#vcv-editor-iframe' ).get( 0 ).contentWindow.document;
    $('[data-vcv="edit-fe-editor"]', iframeDocument ).remove();
    $('#vcv-editor-iframe').height($(window).height()-64);
    vcCake.env('platform', 'wordpress').start(function() {
      require('./config/wp-modules');
    });
  });
});

require('./sources/elements-2/exampleButton/exampleButton');
require('./sources/elements-2/iconButton/iconButton');
require('./sources/elements-2/section/section');

window.app = vcCake;