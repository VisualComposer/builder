import vcCake from 'vc-cake'

const innerApi = {
  getElementAssetsLibraryFiles (cookElement) {
    const assetsLibrary = cookElement.get('assetsLibrary')
    /** @see public/editor/services/sharedAssetsLibrary/service.js */
    const sharedAssetsLibraryService = vcCake.getService('sharedAssetsLibrary')
    let files = {
      cssBundles: [],
      jsBundles: []
    }
    if (assetsLibrary && assetsLibrary.length) {
      assetsLibrary.forEach((lib) => {
        let libraryFiles = sharedAssetsLibraryService.getAssetsLibraryFiles(lib)
        if (libraryFiles && libraryFiles.cssBundles && libraryFiles.cssBundles.length) {
          files.cssBundles = files.cssBundles.concat(libraryFiles.cssBundles)
        }
        if (libraryFiles && libraryFiles.cssBundles && libraryFiles.cssBundles.length) {
          files.jsBundles = files.jsBundles.concat(libraryFiles.jsBundles)
        }
      })
    }

    return files
  },
  getElementPublicAssetsFiles (cookElement) {
    let files = {
      cssBundles: [],
      jsBundles: []
    }
    let jsFiles = cookElement.get('metaPublicJs')
    if (jsFiles && jsFiles.length) {
      const elementPath = cookElement.get('metaElementPath')
      jsFiles = jsFiles.map((url) => {
        return elementPath + url
      })
      files.jsBundles = files.jsBundles.concat(jsFiles)
    }

    return files
  }
}

const publicApi = {
  getAssetsFilesByTags (tags) {
    let files = {
      cssBundles: [],
      jsBundles: []
    }
    const cook = vcCake.getService('cook')
    tags.forEach((tag) => {
      // get js files from elements
      const cookElement = cook.get({ tag: tag })
      if (!cookElement) {
        return
      }
      let elementAssetsLibraryFiles = innerApi.getElementAssetsLibraryFiles(cookElement)
      let elementPublicAssetsFiles = innerApi.getElementPublicAssetsFiles(cookElement)

      // SharedAssets
      files.cssBundles = files.cssBundles.concat(elementAssetsLibraryFiles.cssBundles)
      files.jsBundles = files.jsBundles.concat(elementAssetsLibraryFiles.jsBundles)

      // Element Public JS
      files.cssBundles = files.cssBundles.concat(elementPublicAssetsFiles.cssBundles)
      files.jsBundles = files.jsBundles.concat(elementPublicAssetsFiles.jsBundles)
    })

    return files
  }
}

vcCake.addService('elementAssetsLibrary', publicApi)
