import vcCake from 'vc-cake'

export default {
  /**
   * Get js files list by tags
   * @returns {*}
   */
  getJsFilesByTags (tags) {
    let jsFilesList = []
    let cook = vcCake.getService('cook')
    tags.forEach((tag) => {
      // get js files from elements
      let elementObject = cook.get({ tag: tag })
      let jsFiles = elementObject.get('metaPublicJs')
      if (jsFiles && jsFiles.length) {
        let elementPath = window.VCV_HUB_GET_ELEMENTS()[ tag ].elementPath
        jsFiles = jsFiles.map((url) => {
          return elementPath + url
        })
        jsFilesList = jsFilesList.concat(jsFiles)
      }
      let assetsLibrary = elementObject.get('assetsLibrary')
      // get js file from shared assets
      // TODO: Check for tags and libraries.
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
    let cook = vcCake.getService('cook')
    tags.forEach((tag) => {
      let elementObject = cook.get({ tag: tag })
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
    let assetsLibrary = vcCake.getService('assetsLibrary')
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
    let assetsLibrary = vcCake.getService('assetsLibrary')
    let libData = assetsLibrary.get(lib)
    if (libData && libData.publicCss && libData.publicCss.length) {
      return libData.publicCss
    }
    return []
  }
}
