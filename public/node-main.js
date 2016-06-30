import vcCake from 'vc-cake'
require('./sources/less/bootstrap/init.less')
require('./config/node-services')
require('./config/node-attributes')
const $ = require('expose?$!jquery')

$(document).ready(function () {
  require('./sources/css/wordpress.less')
  var $iframe = $('#vcv-editor-iframe')
  $iframe.load(function () {
    let iframeDocument = $('#vcv-editor-iframe').get(0).contentWindow.document
    // Disable iframe clicks
    $('a', iframeDocument).each(function () {
      $(this).attr('target', '_blank')
    })
    $('[data-vcv="edit-fe-editor"]', iframeDocument).remove()
    vcCake.env('platform', 'node').start(function () {
      require('./config/node-modules')
    })
  })
  $iframe.attr('src', '/page.html')
})

window.app = vcCake
window.vcvAddElement = vcCake.getService('cook').add
window.React = require('react')

require('./config/elements')
