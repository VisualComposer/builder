import vcCake from 'vc-cake'

interface Library {
  libPaths?: string[],
  libsNames?: string[],
  rules: {
    clickableOptions: {
      options: {
        value: string
      }
      rule: string
    }
  }
}

interface AssetLibrary {
  name: string,
  dependencies: string[],
  subset?: string
}

interface CookElement {
  get: <Type>(key:string) => Type,
  // disabling lint, because data can be any element object with different properties
  toJS: () => any, // eslint-disable-line
  filter: (fn:(key:string, value:string, settings:{type:string}) => void) => void
}

interface GoogleFonts {
  googleFonts: {
    output: {
      [item:string]: {
        subsets: string,
        variants: string[]
      }
    }
  }
}

interface Font {
  fontFamily: string,
  fontStyle: {
    style: string,
    weight: string
  },
  fontText: string,
  status: string
}

interface Settings {
  [item:string]: {
    type: string
  }
}

type Libraries = {
  libraries: Library[]
}

type Files = {
  cssBundles: string[],
  jsBundles: string[]
}

type GetAssetsFilesByElement = (cookElement:CookElement) => Files

const innerApi = {
  getElementAssetsLibraryFiles (cookElement:CookElement) {
    /** @see public/editor/services/sharedAssetsLibrary/service.js */
    const sharedAssetsLibraryService = vcCake.getService('sharedAssetsLibrary')
    const assetsStorage = vcCake.getStorage('assets')
    const assetsStorageState = assetsStorage.state('jsLibs').get()
    const files = {
      cssBundles: [],
      jsBundles: []
    }

    if (!assetsStorageState) {
      return files
    }
    const elementFromStorage = assetsStorageState.elements.find((element:{id:string}) => {
      return element.id === cookElement.get<string>('id')
    })
    const elementAssetLibraries = elementFromStorage && elementFromStorage.assetLibraries
    if (elementAssetLibraries && elementAssetLibraries.length) {
      elementAssetLibraries.forEach((lib:AssetLibrary) => {
        const libraryFiles = sharedAssetsLibraryService.getAssetsLibraryFiles(lib)
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
  getElementBackendAssetsLibraryFiles (cookElement:CookElement) {
    /** @see public/editor/services/sharedAssetsLibrary/service.js */
    const sharedAssetsLibraryService = vcCake.getService('sharedAssetsLibrary')
    const assetsStorage = vcCake.getStorage('assetsUpdate')
    const assetsStorageState = assetsStorage.state('jsLibs').get()
    const files = {
      cssBundles: [],
      jsBundles: []
    }

    if (assetsStorageState && assetsStorageState.elements) {
      const elementFromStorage = assetsStorageState.elements.find((element:{id:string}) => {
        return element.id === cookElement.get<string>('id')
      })
      const elementAssetLibraries = elementFromStorage && elementFromStorage.assetLibraries
      if (elementAssetLibraries && elementAssetLibraries.length) {
        elementAssetLibraries.forEach((lib:AssetLibrary) => {
          const libraryFiles = sharedAssetsLibraryService.getAssetsLibraryFiles(lib)
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
  getElementPublicAssetsFiles (cookElement:CookElement) {
    const files:Files = {
      cssBundles: [],
      jsBundles: []
    }

    const RulesManager = vcCake.getService('rulesManager')
    const elementPath = cookElement.get('metaElementPath')

    const libraries = cookElement.get<Libraries>('metaPublicJs') && cookElement.get<Libraries>('metaPublicJs').libraries
    libraries && libraries.forEach((lib:Library) => {
      let jsFiles:string[] = []
      if (lib.libPaths && lib.libPaths.length) {
        if (lib.rules) {
          RulesManager.checkSync(cookElement.toJS(), lib.rules, (status:boolean) => {
            if (status && lib.libPaths) {
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
  getElementBackendEditorAssetsFiles (cookElement:CookElement, options: {metaPublicJs:Libraries}) {
    const files:Files = {
      cssBundles: [],
      jsBundles: []
    }

    if (options && options.metaPublicJs) {
      const RulesManager = vcCake.getService('rulesManager')
      const elementPath = cookElement.get('metaElementPath')

      const libraries = cookElement.get<Libraries>('metaPublicJs') && cookElement.get<Libraries>('metaPublicJs').libraries
      libraries && libraries.forEach((lib:Library) => {
        let jsFiles:string[] = []
        if (lib.libPaths && lib.libPaths.length) {
          if (lib.rules) {
            RulesManager.checkSync(cookElement.toJS(), lib.rules, (status:boolean) => {
              if (status && lib.libPaths) {
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
    }

    return files
  },
  getInnerAssetsFilesByElement (cookElement:CookElement, getAssetsFilesByElement:GetAssetsFilesByElement) {
    const files:Files = {
      cssBundles: [],
      jsBundles: []
    }

    const cook = vcCake.getService('cook')
    cookElement.filter((key, value, settings) => {
      if (settings.type === 'element') {
        // Element Public JS
        const cookElement = cook.get(value)
        if (!cookElement) {
          return
        }
        const elementPublicAssetsFiles = getAssetsFilesByElement(cookElement)
        files.cssBundles = files.cssBundles.concat(elementPublicAssetsFiles.cssBundles)
        files.jsBundles = files.jsBundles.concat(elementPublicAssetsFiles.jsBundles)
      }
    })
    files.cssBundles = [...new Set(files.cssBundles)]
    files.jsBundles = [...new Set(files.jsBundles)]

    return files
  },
  getElementSharedAssetsLibraryFiles (cookElement:CookElement) {
    const RulesManager = vcCake.getService('rulesManager')
    const sharedAssetsLibraryService = vcCake.getService('sharedAssetsLibrary')
    const elementLibs = cookElement.get<Libraries>('sharedAssetsLibrary') && cookElement.get<Libraries>('sharedAssetsLibrary').libraries
    const files:Files = {
      cssBundles: [],
      jsBundles: []
    }
    let sharedLibs:string[] = []
    // get element shared libs list from attribute
    elementLibs && elementLibs.forEach((lib:Library) => {
      if (lib.libsNames && lib.libsNames.length) {
        if (lib.rules) {
          RulesManager.checkSync(cookElement.toJS(), lib.rules, (status:boolean) => {
            if (status && lib.libsNames) {
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
      const libraryFiles = sharedAssetsLibraryService.getAssetsLibraryFiles(lib)
      if (libraryFiles && libraryFiles.cssBundles && libraryFiles.cssBundles.length) {
        files.cssBundles = files.cssBundles.concat(libraryFiles.cssBundles)
      }
      if (libraryFiles && libraryFiles.jsBundles && libraryFiles.jsBundles.length) {
        files.jsBundles = files.jsBundles.concat(libraryFiles.jsBundles)
      }
    })

    const elementAssets = cookElement.get<GoogleFonts>('metaElementAssets')
    const googleFonts = elementAssets && elementAssets.googleFonts
    if (googleFonts) {
      Object.keys(googleFonts).forEach((field) => {
        // @ts-ignore accessing object property via bracket notation
        const fieldFonts = googleFonts[field]
        Object.keys(fieldFonts).forEach((font) => {
          const fontData = fieldFonts[font]
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
const getGoogleFontsByElement = (cookElement:CookElement) => {
  if (!cookElement) {
    return []
  }
  const cook = vcCake.getService('cook')
  let fonts:string[] = []
  const settings = cookElement.get<Settings>('settings')
  const values = cookElement.toJS()
  for (const key in settings) {
    // If found element then get actual data form element
    if (settings[key].type === 'element') {
      const newElement = cook.get(values[key])
      fonts = fonts.concat(getGoogleFontsByElement(newElement))
    } else {
      if (settings[key].type === 'googleFonts') {
        const font = cookElement.get<Font>(key)
        if (font) {
          const fontStyle = font.fontStyle ? (font.fontStyle.style === 'regular' ? '' : font.fontStyle.style) : null
          let fontHref = `https://fonts.googleapis.com/css?family=${font.fontFamily}`

          if (font.fontStyle) {
            fontHref = `https://fonts.googleapis.com/css?family=${font.fontFamily}:${font.fontStyle.weight + fontStyle}`
          }
          fonts.push(fontHref)
        }
      }
    }
  }

  return fonts
}

const publicApi = {
  getAssetsFilesByTags (tags:string[]) {
    const files:Files = {
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
      const elementAssets = publicApi.getAssetsFilesByElement(cookElement)
      files.cssBundles = files.cssBundles.concat(elementAssets.cssBundles)
      files.jsBundles = files.jsBundles.concat(elementAssets.jsBundles)
    })

    // Remove duplicates
    files.cssBundles = [...new Set(files.cssBundles)]
    files.jsBundles = [...new Set(files.jsBundles)]

    return files
  },
  getAssetsFilesByElement (cookElement:CookElement) {
    const files:Files = {
      cssBundles: [],
      jsBundles: []
    }
    if (!cookElement) {
      return files
    }
    const elementAssetsLibraryFiles = innerApi.getElementAssetsLibraryFiles(cookElement)
    const elementPublicAssetsFiles = innerApi.getElementPublicAssetsFiles(cookElement)
    const elementSharedAssetsLibraryFiles = innerApi.getElementSharedAssetsLibraryFiles(cookElement)

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
    const { getAssetsFilesByElement } = publicApi
    const innerElementAssets = innerApi.getInnerAssetsFilesByElement(cookElement, getAssetsFilesByElement)
    files.cssBundles = files.cssBundles.concat(innerElementAssets.cssBundles)
    files.jsBundles = files.jsBundles.concat(innerElementAssets.jsBundles)

    // Remove duplicates
    files.cssBundles = [...new Set(files.cssBundles)]
    files.jsBundles = [...new Set(files.jsBundles)]

    return files
  },
  getBackendEditorAssetsFilesByElement (cookElement:CookElement, options:{metaPublicJs:Libraries}) {
    const files:Files = {
      cssBundles: [],
      jsBundles: []
    }
    if (!cookElement) {
      return files
    }
    const elementAssetsLibraryFiles = innerApi.getElementBackendAssetsLibraryFiles(cookElement)
    const elementPublicAssetsFiles = innerApi.getElementBackendEditorAssetsFiles(cookElement, options)

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
    const { getBackendEditorAssetsFilesByElement } = publicApi
    const innerElementAssets = innerApi.getInnerAssetsFilesByElement(cookElement, <GetAssetsFilesByElement>getBackendEditorAssetsFilesByElement)
    files.cssBundles = files.cssBundles.concat(innerElementAssets.cssBundles)
    files.jsBundles = files.jsBundles.concat(innerElementAssets.jsBundles)

    // Remove duplicates
    files.cssBundles = [...new Set(files.cssBundles)]
    files.jsBundles = [...new Set(files.jsBundles)]

    return files
  }
}

vcCake.addService('elementAssetsLibrary', publicApi)
