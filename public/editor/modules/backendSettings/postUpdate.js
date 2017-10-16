export default class {
  constructor (globalUrls, vendorUrl, updaterUrl) {
    this.globalUrls = globalUrls
    this.vendorUrl = vendorUrl
    this.updaterUrl = updaterUrl
  }

  async setup () {
    const $ = window.jQuery
    await $.getJSON(this.globalUrls, { 'vcv-nonce': window.vcvAdminNonce }).done((data) => {
      /**
       * @param {{vcvGlobals}} data
       */
      data && data.vcvGlobals && this.buildGlobalVariables(data.vcvGlobals)
    }).fail(console.log)

    await $.getScript(this.vendorUrl).fail(console.log)
    await $.getScript(this.updaterUrl).fail(console.log)
    await this.downloadElements()
    this.ready = true
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
        elementBundles.push($.getScript(element.bundlePath).fail(console.log))
      })
    }
    return Promise.all(elementBundles)
  }
  setGlobalVariable (key, data) {
    Object.defineProperty(window, key, {
      value: function () {
        return data
      },
      writable: false
    })
  }

  buildGlobalVariables (globals) {
    Object.keys(globals).forEach((key) => {
      this.setGlobalVariable(key, globals[ key ])
    })
  }

  async update (data) {
    if (!this.isReady()) {
      await this.setup()
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
