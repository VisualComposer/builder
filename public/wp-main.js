import vcCake from 'vc-cake'
import React from 'react'
import './sources/less/bootstrap/init.less'
import './sources/css/wordpress.less'
import './config/wp-services'
import './config/wp-attributes'

const $ = require('expose?$!jquery')

$(() => {
  let $iframe = $('#vcv-editor-iframe')

  let iframeLoadEvent = () => {
    let iframeDocument = $iframe.get(0).contentWindow.document
    // Disable iframe clicks
    $('a', iframeDocument).each((i, el) => {
      $(el).attr('target', '_blank')
    })
    $('[data-vcv="edit-fe-editor"]', iframeDocument).remove()
    vcCake.env('platform', 'wordpress').start(() => {
      require('./config/wp-modules')
    })
  }

  $iframe.on('load', iframeLoadEvent)
})

window.app = vcCake
window.vcvAddElement = vcCake.getService('cook').add
window.React = React

require('./config/elements')
