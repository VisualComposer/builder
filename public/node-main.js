import vcCake from 'vc-cake'
import React from 'react'
import './sources/less/bootstrap/init.less'
import './sources/css/wordpress.less'
import './config/variables'
import './config/node-services'
import './config/node-attributes'

const $ = require('expose?$!jquery')
vcCake.setData('app:dataLoaded', false)

$(() => {
  let $iframe = $('#vcv-editor-iframe')

  let iframeLoadEvent = () => {
    let iframe = $iframe.get(0).contentWindow
    let iframeDocument = iframe.document
    // Disable iframe clicks
    $('a', iframeDocument).each((i, el) => {
      $(el).attr('target', '_blank')
    })
    $('[data-vcv="edit-fe-editor"]', iframeDocument).remove()
    vcCake.env('platform', 'node').start(() => {
      require('./config/node-modules')
    })
    vcCake.env('iframe', iframe)
  }

  $iframe.on('load', iframeLoadEvent)
  $iframe.attr('src', '/page.html')
})

window.app = vcCake
window.vcvAddElement = vcCake.getService('cook').add
window.vcvPluginUrl = '/'
window.React = React
window.vcvAPI = vcCake.getService('api')

require('./config/elements')
