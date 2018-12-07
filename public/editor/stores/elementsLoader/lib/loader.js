import { log as logError } from './logger'

export default class {
  constructor (globalUrls, vendorUrl) {
    this.globalUrls = globalUrls
    this.vendorUrl = vendorUrl
  }

  async setup () {
    const $ = window.jQuery
    $.ajaxSetup({
      beforeSend: function (jqXHR, settings) {
        jqXHR.url = settings.url
      }
    })
    await $.getJSON(this.globalUrls, { 'vcv-nonce': window.vcvNonce }).done((data) => {
      /**
       * @param {{vcvGlobals}} data
       */
      data && data.vcvGlobals && this.buildGlobalVariables(data.vcvGlobals)
    }).fail((jqXHR, status, error) => {
      console.warn(jqXHR, status, error)
      logError('Error in rebuild process get json globalUrls', {
        code: 'postsUpdate-update-3',
        codeNum: '000012',
        type: window.vcvActivationType,
        activationFinishedUrl: window.vcvActivationFinishedUrl,
        jqXHR: jqXHR,
        status: status,
        error: error,
        globalUrls: this.globalUrls
      })
    })

    await $.getScript(this.vendorUrl).fail((jqXHR, status, error) => {
      console.warn(jqXHR, status, error)
      logError('Error in rebuild process get json vendorUrl ', {
        code: 'postsUpdate-update-4',
        codeNum: '000013',
        type: window.vcvActivationType,
        activationFinishedUrl: window.vcvActivationFinishedUrl,
        jqXHR: jqXHR,
        status: status,
        error: error,
        vendorUrl: this.vendorUrl
      })
    })

    await this.downloadElements()
  }

  isReady () {
    return !!this.ready
  }

  downloadElements () {
    const $ = window.jQuery
    const elementBundles = []
    if (typeof window.VCV_HUB_GET_ELEMENTS === 'function') {
      const elements = window.VCV_HUB_GET_ELEMENTS()
      Object.keys(elements).forEach((key) => {
        const element = elements[ key ]
        elementBundles.push($.getScript(element.bundlePath))
      })
    }
    return Promise.all(elementBundles).catch((e) => {
      logError('Error in rebuild process downloadElements', {
        code: 'postsUpdate-downloadElements-1',
        codeNum: '000015',
        type: window.vcvActivationType,
        activationFinishedUrl: window.vcvActivationFinishedUrl,
        error: e
      })
    })
  }

  setGlobalVariable (key, data) {
    if (typeof window[ key ] === 'undefined') {
      Object.defineProperty(window, key, {
        value: function () {
          return data
        },
        writable: false
      })
    }
  }

  buildGlobalVariables (globals) {
    Object.keys(globals).forEach((key) => {
      this.setGlobalVariable(key, globals[ key ])
    })
  }
}
