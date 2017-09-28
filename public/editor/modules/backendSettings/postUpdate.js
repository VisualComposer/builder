export default class {
  constructor (posts, vendorUrl, updaterUrl) {
    this.posts = posts
    this.updaterUrl = updaterUrl
    this.vendorUrl = vendorUrl
  }

  update () {
    const $ = window.jQuery
    return $.getJSON(window.vcvElementsGlobalsUrl, {'vcv-nonce': window.vcvAdminNonce})
      .done((data) => {
        /**
         * @param {{vcvGlobals}} data
         */
        data && data.vcvGlobals && this.buildGlobalVariables(data.vcvGlobals)
        $.getScript(this.vendorUrl)
          .done(() => {
            $.getScript(this.updaterUrl)
              .done(this.triggerRebuild.bind(this))
              .fail(this.ajaxError)
          })
          .fail(this.ajaxError)
      })
      .fail(this.ajaxError)
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
  triggerRebuild () {
    console.log(this.posts)
    // window.vcv.trigger('vcv:rebuildPost', this.posts)
  }
  ajaxError (jqxhr, settings, exception) {
    console.log(jqxhr, settings, exception)
  }
}
