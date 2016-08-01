import path from 'path'
import vcCake from 'vc-cake'

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
  }
})
