import vcCake from 'vc-cake'
import './sources/less/bootstrapBackend/init.less'
import './sources/css/wordpress.less'
import './config/variables'
import './config/wpbackend-services'
import './config/wpbackend-attributes'

const $ = require('expose?$!jquery')
$(() => {
  const iframe = document.getElementById('vcv-editor-iframe').contentWindow
  const iframeDocument = iframe.document
  $('[data-vcv="edit-fe-editor"]', iframeDocument).remove()
  vcCake.env('iframe', iframe)
  vcCake.env('platform', 'wordpress').start(() => {
    require('./editor/stores/elements/elementsStorage')
    require('./editor/stores/assetsBackend/assetsStorage')
    require('./editor/stores/workspaceStorage')
    require('./editor/stores/history/historyStorage')
    require('./editor/stores/settingsStorage')
    require('./editor/stores/wordpressBackendData/wordpressBackendDataStorage')
    require('./config/wpbackend-modules')
  })
})
window.app = vcCake
