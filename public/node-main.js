import vcCake from 'vc-cake'
import React from 'react'
import './sources/less/bootstrap/init.less'
import './sources/css/wordpress.less'
import './config/node-services'
import './config/node-attributes'

const $ = require('expose?$!jquery')

$(() => {
  let $iframe = $('#vcv-editor-iframe')

  let iframeLoadEvent = () => {
    let iframeDocument = $('#vcv-editor-iframe').get(0).contentWindow.document
    // Disable iframe clicks
    $('a', iframeDocument).each(() => {
      $(this).attr('target', '_blank')
    })
    $('[data-vcv="edit-fe-editor"]', iframeDocument).remove()
    vcCake.env('platform', 'node').start(function () {
      require('./config/node-modules')
    })
  }

  $iframe.on('load', iframeLoadEvent)
  $iframe.attr('src', '/page.html')
})

window.app = vcCake
window.vcvAddElement = vcCake.getService('cook').add
window.vcvPluginUrl = '/'
window.React = React

require('./config/elements')
