// @flow
import vcCake from 'vc-cake'
// import React from 'react'
import './sources/less/bootstrap/init.less'
import './sources/css/wordpress.less'
import './config/variables'
import './config/wp-services'
import './config/wp-attributes'

const $ = require('expose?$!jquery')
$(() => {
  let $iframe = $('#vcv-editor-iframe')

  let iframeLoadEvent = () => {
    let iframe = $iframe.get(0).contentWindow
    let iframeDocument = iframe.document
    // Disable iframe clicks
    $(iframeDocument.body).on('click', 'a[href]', (e) => {
      e && e.preventDefault()
    })
    $('[data-vcv="edit-fe-editor"]', iframeDocument).remove()
    vcCake.env('platform', 'wordpress').start(() => {
      require('./editor/stores/elements/elementsStorage')
      require('./editor/stores/assets/assetsStorage')
      require('./editor/stores/workspaceStorage')
      require('./editor/stores/historyStorage')
      require('./editor/stores/wordpressDataStorage')
      require('./config/wp-modules')
    })
    vcCake.env('iframe', iframe)
  }

  $iframe.on('load', iframeLoadEvent)
})

window.app = vcCake
// window.vcvAddElement = vcCake.getService('cook').add
// window.React = React
// window.vcvAPI = vcCake.getService('api')
// if (!vcCake.env('FEATURE_WEBPACK')) {
//   require('./config/elements')
// }

// import './sources/newElements/row'
// import './sources/newElements/column'
// import './sources/newElements/textBlock'
