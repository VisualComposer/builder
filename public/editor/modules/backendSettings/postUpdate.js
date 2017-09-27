
export default class {
  constructor (posts, vcvUpdaterFileUrl) {
    this.posts = []
    this.vcvUpdaterFileUrl = vcvUpdaterFileUrl
  }
  update () {
    window.jQuery.getJSON(window.vcvElementsGlobalsUrl, {
      'vcv-nonce': window.vcvAdminNonce
    }).then(this.requestUpdate.bind(this))
  }
  requestUpdate (data) {
    const globals = data.vcvGlobals
    globals && Object.keys(globals).forEach((key) => {
      Object.defineProperty(window, key, {
        value: function () {
          return globals[key]
        },
        writable: false
      })
    })
    window.jQuery.getScript(this.vcvUpdaterFileUrl).done(() => {
      console.log(this.posts)
      // window.vcv.trigger('vcv:rebuildPost', this.posts)
    })
  }
}

