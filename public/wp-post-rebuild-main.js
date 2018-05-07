import vcCake from 'vc-cake'
import './polyfills'
import './config/variables'
import './config/wpupdate-services'
import './config/wpupdate-attributes'
import publicAPI from './resources/api/publicAPI'

class PostBuilder {
  /**
   * Setup iframe where content of rerender post will be placed
   */
  setupIframe () {
    document.getElementById('vcv-posts-update-wrapper').innerHTML += '<div id="vcv-editor"><div class="vcv-layout-iframe-container">\n' +
      '<iframe\n' +
      ' class="vcv-layout-iframe"\n' +
      ' id="vcv-editor-iframe"\n' +
      ' src=""\n' +
      ' frameborder="0" scrolling="auto"></iframe>\n' +
      '<div class="vcv-layout-iframe-overlay" id="vcv-editor-iframe-overlay"></div>\n' +
      '</div></div>'
    this.iframe = document.getElementById('vcv-editor-iframe')
    this.iframe.addEventListener('load', this.renderData.bind(this), {
      once: true
    })
    this.iframeReady = true
  }

  /**
   * Set up cake environment to load backend based content render
   */
  setupCake () {
    vcCake.env('platform', 'wordpress').start(() => {
      if (vcCake.env('HUB_TEASER_ELEMENT_DOWNLOAD')) {
        require('./editor/stores/hub/hubElementsStorage')
        require('./editor/stores/hub/hubTemplatesStorage')
        const hubElementsStorage = vcCake.getStorage('hubElements')
        hubElementsStorage.trigger('start')
        const hubTemplatesStorage = vcCake.getStorage('hubTemplates')
        hubTemplatesStorage.trigger('start')
      }
      require('./editor/stores/settingsStorage')
      require('./editor/stores/elements/elementsStorage')
      require('./editor/stores/assetsUpdate/assetsStorage')
      require('./editor/stores/wordpressRebuildPostData/wordpressRebuildPostDataStorage.js')
      require('./editor/modules/content/updateContent/module.js')
      vcCake.getStorage('wordpressRebuildPostData').state('status').onChange((state) => {
        if (state && state.status === 'success') {
          this.resolve && this.resolve(this.settings)
        }
      })
      vcCake.getStorage('wordpressRebuildPostData').on('skipPost', (id) => {
        if (id === this.settings.id) {
          this.resolve && this.resolve()
        }
      })
    })
    this.cakeReady = true
  }

  /**
   * Event listener to watch when editor is loaded
   */
  renderData () {
    vcCake.env('iframe', this.iframe.contentWindow)
    !this.cakeReady && this.setupCake()
    window.vcvSourceID = this.settings.id
    vcCake.getStorage('wordpressRebuildPostData').trigger('rebuild', this.settings.id)
  }

  /**
   * Update post
   * @param {{editableLink,id}} settings
   * @returns {Promise}
   */
  update (settings) {
    this.settings = settings
    !this.iframeReady && this.setupIframe()
    return new Promise((resolve, reject) => {
      this.resolve = resolve
      this.reject = reject
      if (this.iframe.getAttribute('src')) {
        this.renderData()
      } else {
        this.iframe.setAttribute('src', this.settings.editableLink)
      }
    })
  }
}

const builder = new PostBuilder()

window.vcvRebuildPostSave = async (data) => {
  return builder.update(data)
}

window.vcvRebuildPostSkipPost = (id) => {
  vcCake.getStorage('wordpressRebuildPostData').trigger('skipPost', id)
}

if (vcCake.env('debug') === true) {
  window.app = vcCake
}

window.vcv = publicAPI
