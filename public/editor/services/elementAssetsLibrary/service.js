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
  },
  getInnerAssetsFilesByElement (cookElement) {
    let files = {
      cssBundles: [],
      jsBundles: []
    }

    cookElement.filter((key, value, settings) => {
      if (settings.type === 'element') {
        // Element Public JS
        let elementPublicAssetsFiles = publicApi.getAssetsFilesByTags([ value.tag ])
        files.cssBundles = files.cssBundles.concat(elementPublicAssetsFiles.cssBundles)
        files.jsBundles = files.jsBundles.concat(elementPublicAssetsFiles.jsBundles)
      }
    })

    return files
  }
}

/**
 * Get googles fonts data by element
 */
let getGoogleFontsByElement = (cookElement) => {
  if (!cookElement) {
    return []
  }
  const cook = vcCake.getService('cook')
  let fonts = new Set()
  let settings = cookElement.get('settings')
  let values = cookElement.toJS()
  for (let key in settings) {
    // If found element then get actual data form element
    if (settings[ key ].type === 'element') {
      let newElement = cook.get(values[ key ])
      fonts = new Set([ ...fonts ].concat(getGoogleFontsByElement(newElement)))
    } else {
      if (settings[ key ].type === 'googleFonts') {
        let font = cookElement.get(key)
        if (font) {
          let fontHref = ''

          if (font.fontStyle) {
            fontHref = `https://fonts.googleapis.com/css?family=${font.fontFamily}:${font.fontStyle.weight + font.fontStyle.style}`
          } else {
            fontHref = `https://fonts.googleapis.com/css?family=${font.fontFamily}`
          }
          fonts.add(fontHref)
        }
      }
    }
  }

  return [ ...fonts ]
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
      let elementAssets = publicApi.getAssetsFilesByElement(cookElement)
      files.cssBundles = files.cssBundles.concat(elementAssets.cssBundles)
      files.jsBundles = files.jsBundles.concat(elementAssets.jsBundles)
    })

    // Remove duplicates
    files.cssBundles = [ ...new Set(files.cssBundles) ]
    files.jsBundles = [ ...new Set(files.jsBundles) ]

    return files
  },
  getAssetsFilesByElement (cookElement) {
    let files = {
      cssBundles: [],
      jsBundles: []
    }
    if (!cookElement) {
      return files
    }
    let elementAssetsLibraryFiles = innerApi.getElementAssetsLibraryFiles(cookElement)
    let elementPublicAssetsFiles = innerApi.getElementPublicAssetsFiles(cookElement)

    // SharedAssets
    files.cssBundles = files.cssBundles.concat(elementAssetsLibraryFiles.cssBundles)
    files.jsBundles = files.jsBundles.concat(elementAssetsLibraryFiles.jsBundles)

    // Element Public JS
    files.cssBundles = files.cssBundles.concat(elementPublicAssetsFiles.cssBundles)
    files.jsBundles = files.jsBundles.concat(elementPublicAssetsFiles.jsBundles)

    // Element Attributes Css/Js
    // Google Fonts
    files.cssBundles = files.cssBundles.concat(getGoogleFontsByElement(cookElement))

    // Inner elements / Sub elements
    let innerElementAssets = innerApi.getInnerAssetsFilesByElement(cookElement)
    files.cssBundles = files.cssBundles.concat(innerElementAssets.cssBundles)
    files.jsBundles = files.jsBundles.concat(innerElementAssets.jsBundles)

    // Remove duplicates
    files.cssBundles = [ ...new Set(files.cssBundles) ]
    files.jsBundles = [ ...new Set(files.jsBundles) ]

    return files
  }
}

vcCake.addService('elementAssetsLibrary', publicApi)
