import vcCake from 'vc-cake'

const { env, getStorage } = vcCake
const $ = window.jQuery

export default class PostBuilder {
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
      require('../../editor/stores/hub/hubElementsStorage')
      require('../../editor/stores/hub/hubTemplatesStorage')
      const hubElementsStorage = getStorage('hubElements')
      hubElementsStorage.trigger('start')
      require('../../editor/stores/settingsStorage')
      require('../../editor/stores/elements/elementsStorage')
      require('../../editor/stores/assets/assetsStorage')
      require('../../editor/stores/wordpressData/wordpressDataStorage.js')
      require('../../editor/modules/content/modernLayout/module.js')
      // require('./editor/modules/content/updateContent/module.js')
      const wordpressDataStorage = getStorage('wordpressData')

      require('../../editor/stores/sharedAssets/storage')
      const sharedAssetsStorage = vcCake.getStorage('sharedAssets')
      sharedAssetsStorage.trigger('start')

      wordpressDataStorage.state('status').onChange((state) => {
        if (state && state.status === 'success') {
          this.resolve && this.resolve(this.settings)
        }
      })
      wordpressDataStorage.on('skipPost', (id) => {
        if (id === this.settings.id) {
          $.ajax(window.VCV_UPDATE_SKIP_POST_URL(),
            {
              dataType: 'json',
              data: {
                'vcv-source-id': id,
                'vcv-nonce': window.vcvNonce
              }
            }
          ).always(() => {
            this.resolve && this.resolve()
          })
        }
      })

      const elementsStorage = getStorage('elements')
      elementsStorage.on('elementsRenderDone', () => {
        const id = wordpressDataStorage.state('id').get()
        wordpressDataStorage.trigger('save', id)
        wordpressDataStorage.state('id').set(false)
      })
    })
    this.cakeReady = true
  }

  /**
   * Event listener to watch when editor is loaded
   */
  renderData () {
    env('iframe', this.iframe.contentWindow)
    !this.cakeReady && this.setupCake()
    window.vcvSourceID = this.settings.id
    getStorage('wordpressData').trigger('rebuild', this.settings.id)
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
