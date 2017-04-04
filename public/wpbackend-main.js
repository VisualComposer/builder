import vcCake from 'vc-cake'
import './sources/less/bootstrapBackend/init.less'
import './sources/css/wordpress.less'
import './sources/less/wpbackend/layout/init.less'
import './config/variables'
import './config/wpbackend-services'
import './config/wpbackend-attributes'

const $ = require('expose?$!jquery')
$(() => {
  let $iframe = $('#vcv-editor-iframe')
  let iframeLoadEvent = () => {
    let iframe = $iframe.get(0).contentWindow
    let iframeDocument = iframe.document
    $('[data-vcv="edit-fe-editor"]', iframeDocument).remove()
    vcCake.env('platform', 'wordpress').start(() => {
      require('./editor/stores/elements/elementsStorage')
      require('./editor/stores/assets/assetsStorage')
      require('./editor/stores/workspaceStorage')
      require('./editor/stores/historyStorage')
      require('./editor/stores/wordpressData/wordpressDataStorage')
      require('./config/wpbackend-modules')
    })
    vcCake.env('iframe', iframe)
  }

  $iframe.on('load', iframeLoadEvent)
})
window.app = vcCake
// window.vcvAddElement = vcCake.getService('cook').add
// window.React = React
// window.vcvAPI = vcCake.getService('api')

