import vcCake from 'vc-cake'
import './polyfills'
import './config/variables'
import './config/wpbackend-services'
import './config/wpbackend-attributes'

class PostBuilder {
  setupIframe () {
    document.body.innerHTML += '<div id="vcv-editor"><div class="vcv-layout-iframe-container">\n' +
      '<iframe\n' +
      ' class="vcv-layout-iframe"\n' +
      ' id="vcv-editor-iframe"\n' +
      ' src=""\n' +
      ' frameborder="0" scrolling="auto"></iframe>\n' +
      '<div class="vcv-layout-iframe-overlay" id="vcv-editor-iframe-overlay"></div>\n' +
      '</div></div>'
    this.iframe = document.getElementById('vcv-editor-iframe')
    this.iframe.addEventListener('load', this.loadIframe.bind(this))
    this.iframeReady = true
  }

  setupCake () {
    vcCake.env('platform', 'wordpress').start(() => {
      require('./editor/stores/elements/elementsStorage')
      require('./editor/stores/wordpressRebuildPostData/wordpressRebuildPostDataStorage.js')
      require('./editor/modules/content/backendContent/module.js')
      this.idState = vcCake.getStorage('wordpressRebuildPostData').state('id')
      this.idState.onChange((id) => {
        if (id === false) {
          this.resolve && this.resolve(this.settings)
        }
      })
    })
    this.cakeReady = true
  }

  loadIframe () {
    window.vcvSourceID = this.settings.id
    vcCake.getStorage('wordpressRebuildPostData').trigger('rebuild', this.settings.id)
  }

  /**
   * Update post
   * @param {{editableLink,id}} settings
   * @returns {Promise}
   */
  update (settings) {
    !this.iframeReady && this.setupIframe()
    !this.cakeReady && this.setupCake()
    this.settings = settings
    return new Promise((resolve, reject) => {
      this.resolve = resolve
      this.reject = reject
      this.iframe.setAttribute('src', this.settings.editableLink)
    })
  }
}

const builder = new PostBuilder()

window.vcvRebuildPostSave = (data) => {
  return builder.update(data)
}

if (vcCake.env('debug') === true) {
  window.app = vcCake
}
