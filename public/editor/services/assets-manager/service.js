import path from 'path'
import vcCake from 'vc-cake'
import postcss from 'postcss'

vcCake.addService('assets-manager', {
  /**
   * Up-to-date list of all assets
   *
   * @param {Object}
   */
  assets: {
    designOptions: {},
    scripts: {},
    styles: {}
  },

  /**
   * Items are only added, never removed
   *
   * @param {Object}
   */
  cache: {
    scripts: {},
    styles: {}
  },

  /**
   * @return {Object}
   */
  getDesignOptions: function () {
    return this.getAssets('designOptions')
  },

  /**
   * @return {Object}
   */
  getScripts: function () {
    return this.getAssets('scripts')
  },

  /**
   * @return {Object}
   */
  getStyles: function () {
    return this.getAssets('styles')
  },

  /**
   * @param {string} assetType
   * @return {Object}
   */
  getAssets: function (assetType) {
    return this.assets[ assetType ]
  },

  /**
   * @param assetType
   * @param element
   * @param settings
   */
  add: function (assetType, element, settings) {
    if (!this.get(assetType, element)) {
      this.assets[ assetType ][ element ] = {
        settings: settings,
        count: 0
      }
    }
    this.assets[ assetType ][ element ].count++
  },

  get: function (assetType, element) {
    let el = this.assets[ assetType ][ element ]
    if (typeof el === 'undefined') {
      return null
    }
    return el
  },

  update: function (assetType, element, settings) {
    if (!this.get(assetType, element)) {
      this.add(assetType, element, settings)
    } else {
      this.assets[ assetType ][ element ].settings = settings
    }
  },

  /**
   * @param assetType
   * @param element
   */
  remove: function (assetType, element) {
    if (!this.get(assetType, element)) {
      return
    }
    this.assets[ assetType ][ element ].count--
    console.log(this.assets[ assetType ][ element ].count)
    if (this.assets[ assetType ][ element ].count === 0) {
      delete this.assets[ assetType ][ element ]
    }
  },

  /**
   * @param {string} assetType scripts|styles
   * @param {string} element Element's name
   * @param {string} file
   */
  addAsset: function (assetType, element, file) {
    let filepath = path.join(element, file)

    if (typeof this.cache[ assetType ][ element ] === 'undefined') {
      this.cache[ assetType ][ element ] = [ path.normalize(file) ]
    } else if (this.cache[ assetType ][ element ].indexOf(filepath) === -1) {
      this.cache[ assetType ][ element ].push(path.normalize(file))
    }

    if (typeof this.assets[ assetType ][ element ] === 'undefined') {
      this.assets[ assetType ][ element ] = []
    } else if (this.assets[ assetType ][ element ].indexOf(filepath) !== -1) {
      return
    }

    this.assets[ assetType ][ element ].push(filepath)
  },

  /**
   * @param {string} elementId Element's ID
   * @param {object} value
   */
  addDesignOption: function (elementId, value) {
    this.assets[ 'designOptions' ][ elementId ] = value
  },

  /**
   * @param {string} element Element's name
   * @param {string} file
   */
  addScript: function (element, file) {
    if (!path.extname(file)) {
      file = file + '.js'
    }

    this.addAsset('scripts', element, file)
  },

  /**
   * @param {string} element Element's name
   * @param {string[]} files
   */
  addScripts: function (element, files) {
    for (let i = 0, len = files.length; i < len; i++) {
      this.addScript(element, files[ i ])
    }
  },

  /**
   * @param {string} element Element's name
   * @param {string} file
   */
  addStyle: function (element, file) {
    if (!path.extname(file)) {
      file = file + '.css'
    }
    this.addAsset('styles', element, file)
  },
  /**
   * @param {string} element Element's name
   * @param {string[]} files
   */
  addStyles: function (element, files) {
    for (let i = 0, len = files.length; i < len; i++) {
      this.addStyle(element, files[ i ])
    }
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
    var iterations = []
    for (let element in styles) {
      let stylePromise = new Promise((resolve, reject) => {
        if (styles[ element ].settings.css) {
          postcss().process(styles[ element ].settings.css).then((result) => {
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
