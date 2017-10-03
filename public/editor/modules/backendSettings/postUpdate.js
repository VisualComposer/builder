export default class {
  constructor (globalUrls, vendorUrl, updaterUrl) {
    this.globalUrls = globalUrls
    this.vendorUrl = vendorUrl
    this.updaterUrl = updaterUrl
  }

  async setup () {
    const $ = window.jQuery
    await $.getJSON(this.globalUrls, {'vcv-nonce': window.vcvAdminNonce}).done((data) => {
      /**
       * @param {{vcvGlobals}} data
       */
      data && data.vcvGlobals && this.buildGlobalVariables(data.vcvGlobals)
    }).fail(console.log)
    await $.getScript(this.vendorUrl).fail(console.log)
    await $.getScript(this.updaterUrl).fail(console.log)
    this.ready = true
  }

  isReady () {
    return !!this.ready
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
      this.setGlobalVariable(key, globals[key])
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
    }
    return console.log('Updated', data)
  }
}
