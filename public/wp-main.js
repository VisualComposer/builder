var vcCake = require('vc-cake')
require('./config/wp-services')
require('./config/wp-attributes')
var $ = require('expose?$!jquery')
$(document).ready(function () {
  require('./sources/css/wordpress.less')
  $('#vcv-editor-iframe').load(function () {
    var iframeDocument = $('#vcv-editor-iframe').get(0).contentWindow.document
    $('[data-vcv="edit-fe-editor"]', iframeDocument).remove()
    $('#vcv-editor-iframe').height($(window).height() - 61)
    vcCake.env('platform', 'wordpress').start(function () {
      require('./config/wp-modules')
    })
  })
})
window.app = vcCake
window.vcvAddElement = vcCake.getService('cook').add
window.React = require('react')

require('./config/elements')
