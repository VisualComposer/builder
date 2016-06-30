var vcCake = require('vc-cake')
require('./sources/less/bootstrap/init.less')
require('./config/wp-services')
require('./config/wp-attributes')
var $ = require('expose?$!jquery')
$(document).ready(function () {
  require('./sources/css/wordpress.less')
  $('#vcv-editor-iframe').load(function () {
    var iframeDocument = $('#vcv-editor-iframe').get(0).contentWindow.document
    // Disable iframe clicks
    $('a', iframeDocument).each(function () {
      $(this).attr('target', '_blank')
    })
    $('[data-vcv="edit-fe-editor"]', iframeDocument).remove()
    vcCake.env('platform', 'wordpress').start(function () {
      require('./config/wp-modules')
    })
  })
  $(window).on('load resize', function () {
    $('#vcv-editor-iframe').height($(window).height() - 61)
  })
})
window.app = vcCake
window.vcvAddElement = vcCake.getService('cook').add
window.React = require('react')

require('./config/elements')
