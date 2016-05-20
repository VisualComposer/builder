var vcCake = require('vc-cake')
require('./config/node-services')
require('./config/node-attributes')
var $ = require('expose?$!jquery')

$(document).ready(function () {
  require('./sources/css/wordpress.less')
  $('#vcv-editor-iframe').load(function () {
    var iframeDocument = $('#vcv-editor-iframe').get(0).contentWindow.document
    $('[data-vcv="edit-fe-editor"]', iframeDocument).remove()
    vcCake.env('platform', 'node').start(function () {
      require('./config/node-modules')
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
