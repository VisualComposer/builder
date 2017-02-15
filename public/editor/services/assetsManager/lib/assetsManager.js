import vcCake from 'vc-cake'

export default {

  /**
   * Get cook service
   * @returns {*}
   */
  cook () {
    return vcCake.getService('cook')
  },

  /**
   * Get element's public path
   * @param tag
   * @param file
   * @returns {*}
   */
  getPublicPath (tag, file) {
    let path = this.getSourcePath() + '/elements/' + tag + '/public'
    let $element = document.querySelector('[data-vc-element-script="' + tag + '"]')
    if ($element) {
      path = $element.dataset.vcElementUrl + '/public' // TODO: Make vcv prefix data attribute
    }
    if (file) {
      path += '/' + file
    }

    return path
  },

  /**
   * Get source path
   * @param file
   * @returns {*}
   */
  getSourcePath (file = null) {
    let path
    if (vcCake.env('platform') === 'node') {
      path = window.vcvPluginUrl + 'sources'
    } else {
      path = window.vcvPluginUrl + 'public/sources'
    }
    if (file) {
      path += '/' + file
    }

    return path
  },

  /**
   * Get js files list by tags
   * @returns {*}
   */
  getJsFilesByTags (tags) {
    let jsFilesList = []
    tags.forEach((tag) => {
      // get js files from elements
      let elementObject = this.cook().get({ tag: tag })
      let jsFiles = elementObject.get('metaPublicJs')
      if (jsFiles && jsFiles.length) {
        jsFilesList = jsFilesList.concat(jsFiles)
      }
      let assetsLibrary = elementObject.get('assetsLibrary')
      // get js file from shared assets
      if (assetsLibrary && assetsLibrary.length) {
        assetsLibrary.forEach((lib) => {
          jsFiles = this.getAssetsLibraryJsFiles(lib)
          if (jsFiles && jsFiles.length) {
            jsFilesList = jsFilesList.concat(jsFiles)
          }
        })
      }
    })
    jsFilesList = [ ...new Set(jsFilesList) ]
    return jsFilesList
  },

  /**
   * Get css files list
   * @returns {*}
   */
  getCssFilesByTags (tags) {
    let cssFilesList = []
    tags.forEach((tag) => {
      let elementObject = this.cook().get({ tag: tag })
      let assetsLibrary = elementObject.get('assetsLibrary')

      if (assetsLibrary && assetsLibrary.length) {
        assetsLibrary.forEach((lib) => {
          let cssFiless = this.getAssetsLibraryCssFiles(lib)
          if (cssFiless && cssFiless.length) {
            cssFilesList = cssFilesList.concat(cssFiless)
          }
        })
      }
    })
    cssFilesList = [ ...new Set(cssFilesList) ]
    return cssFilesList
  },

  /**
   * get Assets library JS files list
   * @param lib
   * @returns {Array}
   */
  getAssetsLibraryJsFiles (lib) {
    let assetsLibrary = vcCake.getService('assets-library')
    let libData = assetsLibrary.get(lib)
    if (libData && libData.publicJs && libData.publicJs.length) {
      return libData.publicJs
    }
    return []
  },

  /**
   * Get assets library CSS files list
   * @param lib
   * @returns {Array}
   */
  getAssetsLibraryCssFiles (lib) {
    let assetsLibrary = vcCake.getService('assets-library')
    let libData = assetsLibrary.get(lib)
    if (libData && libData.publicCss && libData.publicCss.length) {
      return libData.publicCss
    }
    return []
  }
}
