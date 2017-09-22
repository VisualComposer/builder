import vcCake from 'vc-cake'
import './polyfills'
import './config/variables'
import './config/wpbackend-services'
import './config/wpbackend-attributes'
import publicAPI from './resources/api/publicAPI'

publicAPI.on('vcv:rebuildPost', (posts) => {
  let postSettings = {}
  document.body.innerHTML += '<div class="vcv-layout-iframe-container">\n' +
    '                        <iframe\n' +
    '                            class="vcv-layout-iframe"\n' +
    '                            id="vcv-editor-iframe"\n' +
    '                            src=""\n' +
    '                            frameborder="0" scrolling="auto"></iframe>\n' +
    '                        <div class="vcv-layout-iframe-overlay" id="vcv-editor-iframe-overlay"></div>\n' +
    '                    </div>'
  const iframeLoadEvent = () => {
    if (postSettings && postSettings.id) {
      vcCake.getStorage('wordpressRebuildPostData').trigger('rebuild', postSettings.id)
    }
  }
  const iframe = document.getElementById('vcv-editor-iframe')
  iframe.addEventListener('load', iframeLoadEvent)

  vcCake.env('platform', 'wordpress').start(() => {
    require('./editor/stores/elements/elementsStorage')
    require('./editor/stores/wordpressRebuildPostData/wordpressRebuildPostDataStorage.js')
    require('./editor/modules/content/modernLayoutBackend/module.js')
    require('./editor/modules/wordpressBackendWorkspace/module.js')
    const idState = vcCake.getStorage('wordpressRebuildPostData').state('id')
    idState.onChange((id) => {
      if (id === false && posts.length > 0) {
        postSettings = posts.pop()
        iframe.setAttribute('src', postSettings.url)
      }
    })
    idState.set(false)
  })
})
if (vcCake.env('debug') === true) {
  window.app = vcCake
}

