export default class {
  constructor (globalUrls, vendorUrl, updaterUrl) {
    this.globalUrls = globalUrls
    this.vendorUrl = vendorUrl
    this.updaterUrl = updaterUrl
  }

  async setup () {
    const $ = window.jQuery
    $.ajaxSetup({
      beforeSend: function (jqXHR, settings) {
        jqXHR.url = settings.url
      }
    })
    await $.getJSON(this.globalUrls, { 'vcv-nonce': window.vcvAdminNonce }).done((data) => {
      /**
       * @param {{vcvGlobals}} data
       */
      data && data.vcvGlobals && this.buildGlobalVariables(data.vcvGlobals)
    })

    await $.getScript(this.vendorUrl)
    await $.getScript(this.updaterUrl)
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
    return Promise.all(elementBundles)
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

  async update (data) {
    if (!this.isReady()) {
      try {
        await this.setup()
        this.ready = true
      } catch (e) {
        /**
         * @param {{postUpdateAjaxRequestError}} localization
         */
        const localization = window.VCV_I18N && window.VCV_I18N()
        throw (localization.postUpdateAjaxRequestError || `Downloading file for posts updates is failed. File: {file}`)
          .replace(/{file}/, e.url)
      }
    }
    try {
      await window.vcvRebuildPostSave(data)
    } catch (e) {
      console.warn(e)
      return new Error('Error in rebuild process')
    }
    return data
  }
}
