var vcCake = require('vc-cake');
require('./wp-services');
var $ = require('expose?$!jquery');
$(document).ready(function(){
  require('./sources/css/wordpress.less');

  $( '#vc-v-editor-iframe' ).load(function(){
    $('#vc-v-editor-iframe').height($(window).height()-64);
    vcCake.env('platform', 'wordpress').start(function() {
      require('./wp-modules');
    });
  });
});
window.app = vcCake;
