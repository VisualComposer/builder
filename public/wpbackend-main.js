/* eslint import/no-webpack-loader-syntax: off */
import vcCake from 'vc-cake'
import './polyfills'
import './sources/less/bootstrapBackend/init.less'
import './sources/css/wordpress.less'
import './config/variables'
import './config/wpbackend-services'
import './config/wpbackend-attributes'
import publicAPI from './resources/api/publicAPI'

const $ = require('expose-loader?$!jquery')
$(() => {
  let $iframe = $('#vcv-editor-iframe')
  // Get a handle to the iframe element
  let isIframeLoaded = false

  let iframeLoadEvent = () => {
    if (!isIframeLoaded) {
      isIframeLoaded = true
    } else {
      return
    }
    vcCake.env('platform', 'wordpress').start(() => {
      vcCake.env('editor', 'backend')
      require('./editor/stores/elements/elementsStorage')
      require('./editor/stores/assetsBackend/assetsStorage')
      require('./editor/stores/templatesStorage')
      const templatesStorage = vcCake.getStorage('templates')
      templatesStorage.trigger('start')
      require('./editor/stores/workspaceStorage')
      if (vcCake.env('HUB_TEASER_ELEMENT_DOWNLOAD')) {
        require('./editor/stores/hub/hubElementsStorage')
        require('./editor/stores/hub/hubTemplatesStorage')
        const hubElementsStorage = vcCake.getStorage('hubElements')
        hubElementsStorage.trigger('start')
        const hubTemplatesStorage = vcCake.getStorage('hubTemplates')
        hubTemplatesStorage.trigger('start')
      }
      require('./editor/stores/history/historyStorage')
      require('./editor/stores/settingsStorage')
      require('./editor/stores/wordpressBackendData/wordpressBackendDataStorage')
      require('./resources/components/backendEditorContent/content.js')
      require('./config/wpbackend-modules')
    })
    let iframe = $iframe.get(0)
    vcCake.env('iframe', iframe.contentWindow)
  }

  $iframe.on('load', iframeLoadEvent)
  // Check if loading is complete

  let checkForLoad = () => {
    if (!isIframeLoaded) {
      let iframe = $iframe.get(0)
      let iframeDoc = iframe ? iframe.contentDocument || iframe.contentWindow.document : null
      if (iframe && iframeDoc) {
        let iframeDocument = iframe.document
        $('[data-vcv="edit-fe-editor"]', iframeDocument).remove()
        vcCake.env('iframe', iframe)
      }
      let isContentLoaded = $iframe.get(0).contentWindow.document.body &&
        $iframe.get(0).contentWindow.document.body.querySelector('#vcv-editor')

      if (iframeDoc && iframeDoc.readyState === 'complete' && isContentLoaded) {
        iframeLoadEvent()
      }
      window.setTimeout(() => {
        checkForLoad()
      }, 1000)
    }
  }
  window.setTimeout(() => {
    checkForLoad()
  }, 100)
})
if (vcCake.env('debug') === true) {
  window.app = vcCake
}

window.vcv = publicAPI
