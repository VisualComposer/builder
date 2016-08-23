import vcCake from 'vc-cake'

vcCake.addService('assets-manager', {
  /**
   * Up-to-date list of all elements
   *
   * @param {Object}
   */
  elements: {},

  /**
   * @param elements
   */
  set: function (elements) {
    // todo: validate elements
    this.elements = elements
  },

  /**
   * @param id
   */
  add: function (id) {
    let ids = []
    if (Array.isArray(id)) {
      ids = id
    } else {
      ids.push(id)
    }
    ids.forEach((id) => {
      if (!this.get(id)) {
        let documentService = vcCake.getService('document')
        let element = documentService.get(id)
        this.elements[ id ] = {
          tag: element.tag
        }
      }
    })
  },

  get: function (assetKey = false) {
    if (!assetKey) {
      return this.elements
    }
    if (typeof this.elements[ assetKey ] === 'undefined') {
      return null
    }
    return this.elements[ assetKey ]
  },

  /**
   * @param id
   */
  remove: function (id) {
    let ids = []
    if (Array.isArray(id)) {
      ids = id
    } else {
      ids.push(id)
    }
    ids.forEach((id) => {
      if (!this.get(id)) {
        return
      }
      delete this.elements[ id ]
    })
  },

  /**
   * @param {string} assetKey Element's tag
   */
  addStyle: function (assetKey) {
    // let cook = vcCake.getService('cook')
    // let documentService = vcCake.getService('document')
    // let element = documentService.get(assetKey)
    // let cssSettings = cook.get(element).get('cssSettings')
    // if (cssSettings.css) {
    //   // this.add(element.tag)
    // }
  },
  /**
   * @param {string[]} assetKeys Element's tags
   */
  addStyles: function (assetKeys = []) {
    assetKeys.forEach((assetKey) => {
      this.addStyle(assetKey)
    })
  },

  /**
   * @param {string} assetKey Element's tag
   */
  removeStyle: function (assetKey) {
    let documentService = vcCake.getService('document')
    let element = documentService.get(assetKey)
    this.remove('styles', element.tag)
  },

  /**
   * @param {string[]} assetKeys Element's tags
   */
  removeStyles: function (assetKeys = []) {
    assetKeys.forEach((assetKey) => {
      this.removeStyle(assetKey)
    })
  },

  /**
   * @param styles
   */
  setStyles: function (styles) {
    this.set('styles', styles)
  },

  /**
   * @return {Object}
   */
  getStyle: function (assetKey) {
    return this.get('styles', assetKey)
  },

  /**
   * @return {Object}
   */
  getStyles: function () {
    return this.get('styles')
  },

  getPublicPath: (tag, file) => {
    let path
    if (vcCake.env('platform') === 'node') {
      path = window.vcvPluginUrl + 'sources/elements/' + tag + '/public'
    } else {
      path = window.vcvPluginUrl + 'public/sources/elements/' + tag + '/public'
    }
    let $element = document.querySelector('[data-vc-element-script="' + tag + '"]')
    if ($element) {
      path = $element.dataset.vcElementUrl + '/public'
    }
    if (file) {
      path += '/' + file
    }

    return path
  },

  /**
   * @returns {string}
   */
  getCompiledCss: function () {
    let styles = this.getStyles()
    console.log(styles)

    // let cook = vcCake.getService('cook')
    // let documentService = vcCake.getService('document')

    // var iterations = []
    // for (let assetKey in styles) {
    //   let stylePromise = new Promise((resolve, reject) => {
    //     // let element = documentService.get(assetKey)
    //     // let cssSettings = cook.get(element).get('cssSettings')
    //     if (styles[ element ].settings.css) {
    //       postcss().process(styles[ element ].settings.css).then((result) => {
    //         if (result.css) {
    //           resolve(result.css)
    //         } else {
    //           resolve(false)
    //         }
    //       })
    //     }
    //   })
    //   iterations.push(stylePromise)
    // }
    //
    // return Promise.all(iterations).then((output) => {
    //   return output.join(' ')
    // })
  }
})
