import vcCake from 'vc-cake'
import postcss from 'postcss'

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
        let cook = vcCake.getService('cook')
        let documentService = vcCake.getService('document')
        let element = documentService.get(id)
        let designOptions = cook.get(element).get('designOptions')
        let useDO = false
        if (typeof designOptions !== 'undefined' && designOptions.hasOwnProperty('used') && designOptions.used) {
          useDO = true
        }
        this.elements[ id ] = {
          tag: element.tag,
          useDesignOptions: useDO
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

  update: function (id) {
    if (this.get(id)) {
      let cook = vcCake.getService('cook')
      let documentService = vcCake.getService('document')
      let element = documentService.get(id)
      let designOptions = cook.get(element).get('designOptions')
      console.log(designOptions)
      let useDO = (typeof designOptions !== 'undefined' && designOptions.hasOwnProperty('used') && designOptions.used)
      this.elements[ id ] = {
        tag: element.tag,
        useDesignOptions: useDO
      }
    }
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

  getStyles: function () {
    let styles = {}
    let elements = this.get()
    for (let id in elements) {
      if (styles.hasOwnProperty(elements[ id ].tag)) {
        styles[ elements[ id ].tag ].count++
      } else {
        let cook = vcCake.getService('cook')
        let documentService = vcCake.getService('document')
        let element = documentService.get(id)
        let cssSettings = cook.get(element).get('cssSettings')
        styles[ elements[ id ].tag ] = {
          count: 1,
          css: cssSettings.css
        }
      }
    }

    return styles
  },

  /**
   * @returns {string}
   */
  getCompiledCss: function () {
    let styles = this.getStyles()
    var iterations = []
    for (let tagName in styles) {
      let stylePromise = new Promise((resolve, reject) => {
        if (styles[ tagName ].css) {
          postcss().process(styles[ tagName ].css).then((result) => {
            if (result.css) {
              resolve(result.css)
            } else {
              resolve(false)
            }
          })
        }
      })
      iterations.push(stylePromise)
    }

    return Promise.all(iterations).then((output) => {
      return output.join(' ')
    })
  }
})
