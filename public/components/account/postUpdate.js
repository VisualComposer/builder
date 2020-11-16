import { log as logError } from './logger'

export default class {
  constructor (globalUrls, vendorUrl, updaterUrl) {
    this.globalUrls = globalUrls
    this.vendorUrl = vendorUrl
    this.updaterUrl = updaterUrl
  }

  async setup () {
    window.vcvPostUpdateAction = 'updatePosts'
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
        jqXHR: jqXHR,
        status: status,
        error: error,
        vendorUrl: this.vendorUrl
      })
    })
    await $.getScript(this.updaterUrl).fail((jqXHR, status, error) => {
      console.warn(jqXHR, status, error)
      logError('Error in rebuild process get json updaterUrl', {
        code: 'postsUpdate-update-5',
        codeNum: '000014',
        jqXHR: jqXHR,
        status: status,
        error: error,
        updaterUrl: this.updaterUrl
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
        const element = elements[key]
        elementBundles.push($.getScript(element.bundlePath).fail((jqxhr, settings, exception) => {
          console.warn(jqxhr, settings, exception)
        }))
      })
    }
    return Promise.all(elementBundles).catch((e) => {
      console.warn(e)
      logError('Error in rebuild process downloadElements', {
        code: 'postsUpdate-downloadElements-1',
        codeNum: '000015',
        error: e
      })
    })
  }

  setGlobalVariable (key, data) {
    if (typeof window[key] === 'undefined') {
      if (key === 'vcvSourceID') {
        return
      }
      Object.defineProperty(window, key, {
        value: function () {
          return data
        },
        writable: false
      })
    }
  }

  buildGlobalVariables (globals) {
    Object.keys(globals).forEach((index) => {
      this.setGlobalVariable(globals[index].key, globals[index].value)
    })
  }

  async update (data) {
    if (!this.isReady()) {
      try {
        await this.setup()
        this.ready = true
      } catch (e) {
        console.warn(e)
        /**
         * @param {{postUpdateAjaxRequestError}} localization
         */
        const localization = window.VCV_I18N && window.VCV_I18N()
        const text = (localization.postUpdateAjaxRequestError || 'Failed to load: {file} #10077')
          .replace(/{file}/, e.url)
        logError(text, {
          code: 'postsUpdate-update-1',
          codeNum: '000010',
          error: e,
          data: data
        })

        throw text
      }
    }
    try {
      await window.vcvRebuildPostSave(data)
    } catch (e) {
      console.warn(e)
      logError('Error in rebuild process', {
        code: 'postsUpdate-update-2',
        codeNum: '000011',
        error: e,
        data: data
      })
      return new Error('Error in rebuild process')
    }
    return data
  }
}
