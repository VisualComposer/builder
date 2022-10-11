import vcCake from 'vc-cake'

import { setupCake } from './setupCake'

const { env, getStorage, getService } = vcCake

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
      '<div class="vcv-layout-iframe-overlay" id="vcv-editor-iframe-overlay"><div class="vcv-ui-outline-controls-wrapper"></div><div class="vcv-ui-append-control-wrapper"></div></div>\n' +
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
    setupCake()
    const elementsStorage = getStorage('elements')
    const wordpressDataStorage = getStorage('wordpressData')
    elementsStorage.on('elementsRenderDone', () => {
      const id = wordpressDataStorage.state('id').get()
      wordpressDataStorage.trigger('save', id)
      wordpressDataStorage.state('id').set(false)
      this.resolve && this.resolve(this.settings)
    })
    wordpressDataStorage.state('status').onChange((state) => {
      if (state && state.status === 'success') {
        this.resolve && this.resolve(this.settings)
      }
    })
    wordpressDataStorage.on('skipPost', (id) => {
      if (id === this.settings.id) {
        const dataProcessor = getService('dataProcessor')
        dataProcessor.appAdminServerRequest({
          'vcv-action': 'hub:action:postUpdate:skipPost:adminNonce',
          'vcv-source-id': id,
          'vcv-nonce': window.vcvNonce
        }).then(() => {
          this.resolve && this.resolve()
        }, () => {
          this.resolve && this.resolve()
        })
      }
    })
    this.cakeReady = true
  }

  /**
   * Event listener to watch when editor is loaded
   */
  renderData () {
    env('iframe', this.iframe.contentWindow)
    window.vcvSourceID = this.settings.id
    getService('dataManager').reset() // update global variables
    !this.cakeReady && this.setupCake()
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
