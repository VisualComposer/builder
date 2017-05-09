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
  let isIframeLoaded = false

  let iframeLoadEvent = () => {
    if (!isIframeLoaded) {
      isIframeLoaded = true
    } else {
      return
    }
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
  const isContentLoaded = $iframe.get(0).contentWindow.document.body &&
    $iframe.get(0).contentWindow.document.body.getAttribute('class') &&
    $iframe.get(0).contentWindow.document.body.childNodes.length

  if (iframeDoc && iframeDoc.readyState === 'complete' && isContentLoaded) {
    iframeLoadEvent()
  }
})
window.app = vcCake
