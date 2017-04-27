import vcCake from 'vc-cake'
import './sources/less/bootstrapBackend/init.less'
import './sources/css/wordpress.less'
import './config/variables'
import './config/wpbackend-services'
import './config/wpbackend-attributes'

const $ = require('expose?$!jquery')
$(() => {
  let $iframe = $('#vcv-editor-iframe')
  // Get a handle to the iframe element
  let iframe = $iframe.get(0)
  let iframeDoc = iframe.contentDocument || iframe.contentWindow.document
  const iframeDocument = iframe.document
  $('[data-vcv="edit-fe-editor"]', iframeDocument).remove()
  vcCake.env('iframe', iframe)

  let iframeLoadEvent = () => {
    vcCake.env('platform', 'wordpress').start(() => {
      require('./editor/stores/elements/elementsStorage')
      require('./editor/stores/assetsBackend/assetsStorage')
      require('./editor/stores/workspaceStorage')
      require('./editor/stores/history/historyStorage')
      require('./editor/stores/settingsStorage')
      require('./editor/stores/wordpressBackendData/wordpressBackendDataStorage')
      require('./config/wpbackend-modules')
    })
  }

  $iframe.on('load', iframeLoadEvent)
  // Check if loading is complete
  if (iframeDoc && iframeDoc.readyState === 'complete') {
    iframeLoadEvent()
  }
})
window.app = vcCake
