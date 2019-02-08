import vcCake from 'vc-cake'

const innerApi = {
  getElementAssetsLibraryFiles (cookElement) {
    /** @see public/editor/services/sharedAssetsLibrary/service.js */
    const sharedAssetsLibraryService = vcCake.getService('sharedAssetsLibrary')
    const assetsStorage = vcCake.getStorage('assets')
    const assetsStorageState = assetsStorage.state('jsLibs').get()
    let files = {
      cssBundles: [],
      jsBundles: []
    }

    if (!assetsStorageState) {
      return files
    }
    let elementFromStorage = assetsStorageState.elements.find((element) => {
      return element.id === cookElement.get('id')
    })
    let elementAssetLibraries = elementFromStorage && elementFromStorage.assetLibraries
    if (elementAssetLibraries && elementAssetLibraries.length) {
      elementAssetLibraries.forEach((lib) => {
        let libraryFiles = sharedAssetsLibraryService.getAssetsLibraryFiles(lib)
        if (libraryFiles && libraryFiles.cssBundles && libraryFiles.cssBundles.length) {
          files.cssBundles = files.cssBundles.concat(libraryFiles.cssBundles)
        }
        if (libraryFiles && libraryFiles.jsBundles && libraryFiles.jsBundles.length) {
          files.jsBundles = files.jsBundles.concat(libraryFiles.jsBundles)
        }
      })
    }

    return files
  },
  getElementBackendAssetsLibraryFiles (cookElement) {
    /** @see public/editor/services/sharedAssetsLibrary/service.js */
    const sharedAssetsLibraryService = vcCake.getService('sharedAssetsLibrary')
    const assetsStorage = vcCake.getStorage('assetsUpdate')
    const assetsStorageState = assetsStorage.state('jsLibs').get()
    let files = {
      cssBundles: [],
      jsBundles: []
    }

    if (assetsStorageState && assetsStorageState.elements) {
      let elementFromStorage = assetsStorageState.elements.find((element) => {
        return element.id === cookElement.get('id')
      })
      let elementAssetLibraries = elementFromStorage && elementFromStorage.assetLibraries
      if (elementAssetLibraries && elementAssetLibraries.length) {
        elementAssetLibraries.forEach((lib) => {
          let libraryFiles = sharedAssetsLibraryService.getAssetsLibraryFiles(lib)
          if (libraryFiles && libraryFiles.cssBundles && libraryFiles.cssBundles.length) {
            files.cssBundles = files.cssBundles.concat(libraryFiles.cssBundles)
          }
          if (libraryFiles && libraryFiles.jsBundles && libraryFiles.jsBundles.length) {
            files.jsBundles = files.jsBundles.concat(libraryFiles.jsBundles)
          }
        })
      }
    }

    return files
  },
  getElementPublicAssetsFiles (cookElement) {
    let files = {
      cssBundles: [],
      jsBundles: []
    }

    const RulesManager = vcCake.getService('rulesManager')
    const elementPath = cookElement.get('metaElementPath')

    let libraries = cookElement.get('metaPublicJs') && cookElement.get('metaPublicJs').libraries
    libraries && libraries.forEach((lib) => {
      let jsFiles = []
      if (lib.libPaths && lib.libPaths.length) {
        if (lib.rules) {
          RulesManager.checkSync(cookElement.toJS(), lib.rules, (status) => {
            if (status) {
              jsFiles = jsFiles.concat(lib.libPaths)
            }
          })
        } else {
          jsFiles = jsFiles.concat(lib.libPaths)
        }
      }
      jsFiles = jsFiles.map((url) => {
        return elementPath + url
      })
      files.jsBundles = files.jsBundles.concat(jsFiles)
    })

    return files
  },
  getElementBackendEditorAssetsFiles (cookElement, options) {
    let files = {
      cssBundles: [],
      jsBundles: []
    }

    if (options && options.metaPublicJs) {
      const RulesManager = vcCake.getService('rulesManager')
      const elementPath = cookElement.get('metaElementPath')

      let libraries = cookElement.get('metaPublicJs') && cookElement.get('metaPublicJs').libraries
      libraries && libraries.forEach((lib) => {
        let jsFiles = []
        if (lib.libPaths && lib.libPaths.length) {
          if (lib.rules) {
            RulesManager.checkSync(cookElement.toJS(), lib.rules, (status) => {
              if (status) {
                jsFiles = jsFiles.concat(lib.libPaths)
              }
            })
          } else {
            jsFiles = jsFiles.concat(lib.libPaths)
          }
        }
        jsFiles = jsFiles.map((url) => {
          return elementPath + url
        })
        files.jsBundles = files.jsBundles.concat(jsFiles)
      })
    } else {
      let jsFiles = cookElement.get('metaBackendEditorJs')
      const elementPath = cookElement.get('metaElementPath')
      if (jsFiles && jsFiles.length) {
        jsFiles = jsFiles.map((url) => {
          return elementPath + url
        })
        files.jsBundles = files.jsBundles.concat(jsFiles)
      }
    }

    return files
  },
  getInnerAssetsFilesByElement (cookElement, getAssetsFilesByElement, options) {
    let files = {
      cssBundles: [],
      jsBundles: []
    }

    const cook = vcCake.getService('cook')
    cookElement.filter((key, value, settings) => {
      if (settings.type === 'element') {
        // Element Public JS
        let cookElement = cook.get(value)
        if (!cookElement) {
          return
        }
        let elementPublicAssetsFiles = getAssetsFilesByElement(cookElement, getAssetsFilesByElement, options)
        files.cssBundles = files.cssBundles.concat(elementPublicAssetsFiles.cssBundles)
        files.jsBundles = files.jsBundles.concat(elementPublicAssetsFiles.jsBundles)
      }
    })
    files.cssBundles = [ ...new Set(files.cssBundles) ]
    files.jsBundles = [ ...new Set(files.jsBundles) ]

    return files
  },
  getElementSharedAssetsLibraryFiles (cookElement) {
    const RulesManager = vcCake.getService('rulesManager')
    const sharedAssetsLibraryService = vcCake.getService('sharedAssetsLibrary')
    let elementLibs = cookElement.get('sharedAssetsLibrary') && cookElement.get('sharedAssetsLibrary').libraries
    let files = {
      cssBundles: [],
      jsBundles: []
    }
    let sharedLibs = []
    // get element shared libs list from attribute
    elementLibs && elementLibs.forEach((lib) => {
      if (lib.libsNames && lib.libsNames.length) {
        if (lib.rules) {
          RulesManager.checkSync(cookElement.toJS(), lib.rules, (status) => {
            if (status) {
              sharedLibs = sharedLibs.concat(lib.libsNames)
            }
          })
        } else {
          sharedLibs = sharedLibs.concat(lib.libsNames)
        }
      }
    })
    // get element shared libs files from sharedAssetsLibrary service
    sharedLibs.forEach((lib) => {
      let libraryFiles = sharedAssetsLibraryService.getAssetsLibraryFiles(lib)
      if (libraryFiles && libraryFiles.cssBundles && libraryFiles.cssBundles.length) {
        files.cssBundles = files.cssBundles.concat(libraryFiles.cssBundles)
      }
      if (libraryFiles && libraryFiles.jsBundles && libraryFiles.jsBundles.length) {
        files.jsBundles = files.jsBundles.concat(libraryFiles.jsBundles)
      }
    })

    const elementAssets = cookElement.get('metaElementAssets')
    const googleFonts = elementAssets && elementAssets.googleFonts
    if (googleFonts) {
      Object.keys(googleFonts).forEach((field) => {
        const fieldFonts = googleFonts[ field ]
        Object.keys(fieldFonts).forEach((font) => {
          const fontData = fieldFonts[ font ]
          let fontHref = `${font}`
          if (fontData.variants) {
            fontHref += `:${fontData.variants.join(',')}`
          }
          if (fontData.subsets) {
            fontHref += `&subset=${fontData.subsets}`
          }
          files.cssBundles.push(`https://fonts.googleapis.com/css?family=${fontHref}`)
        })
      })
    }

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
          let fontStyle = font.fontStyle ? (font.fontStyle.style === 'regular' ? '' : font.fontStyle.style) : null
          let fontHref = ''

          if (font.fontStyle) {
            fontHref = `https://fonts.googleapis.com/css?family=${font.fontFamily}:${font.fontStyle.weight + fontStyle}`
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
    let elementSharedAssetsLibraryFiles = innerApi.getElementSharedAssetsLibraryFiles(cookElement)

    // Element Shared Assets Libs
    files.cssBundles = files.cssBundles.concat(elementSharedAssetsLibraryFiles.cssBundles)
    files.jsBundles = files.jsBundles.concat(elementSharedAssetsLibraryFiles.jsBundles)

    // Element Assets Libs
    files.cssBundles = files.cssBundles.concat(elementAssetsLibraryFiles.cssBundles)
    files.jsBundles = files.jsBundles.concat(elementAssetsLibraryFiles.jsBundles)

    // Element Public JS
    files.cssBundles = files.cssBundles.concat(elementPublicAssetsFiles.cssBundles)
    files.jsBundles = files.jsBundles.concat(elementPublicAssetsFiles.jsBundles)

    // Element Attributes Css/Js
    // Google Fonts
    files.cssBundles = files.cssBundles.concat(getGoogleFontsByElement(cookElement))

    // Inner elements / Sub elements
    let { getAssetsFilesByElement } = publicApi
    let innerElementAssets = innerApi.getInnerAssetsFilesByElement(cookElement, getAssetsFilesByElement)
    files.cssBundles = files.cssBundles.concat(innerElementAssets.cssBundles)
    files.jsBundles = files.jsBundles.concat(innerElementAssets.jsBundles)

    // Remove duplicates
    files.cssBundles = [ ...new Set(files.cssBundles) ]
    files.jsBundles = [ ...new Set(files.jsBundles) ]

    return files
  },
  getBackendEditorAssetsFilesByElement (cookElement, options) {
    let files = {
      cssBundles: [],
      jsBundles: []
    }
    if (!cookElement) {
      return files
    }
    let elementAssetsLibraryFiles = innerApi.getElementBackendAssetsLibraryFiles(cookElement)
    let elementPublicAssetsFiles = innerApi.getElementBackendEditorAssetsFiles(cookElement, options)

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
    let { getBackendEditorAssetsFilesByElement } = publicApi
    let innerElementAssets = innerApi.getInnerAssetsFilesByElement(cookElement, getBackendEditorAssetsFilesByElement, options)
    files.cssBundles = files.cssBundles.concat(innerElementAssets.cssBundles)
    files.jsBundles = files.jsBundles.concat(innerElementAssets.jsBundles)

    // Remove duplicates
    files.cssBundles = [ ...new Set(files.cssBundles) ]
    files.jsBundles = [ ...new Set(files.jsBundles) ]

    return files
  }
}

vcCake.addService('elementAssetsLibrary', publicApi)
