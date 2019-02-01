import { getService, getStorage, env } from 'vc-cake'

const cook = getService('cook')
const assetsStorage = getStorage('assets')

export default class CssBuilder {
  constructor (globalAssetsStorageService, elementAssetsLibrary, stylesManager, windowObject, slugify) {
    Object.defineProperties(this, {
      /**
       * @memberOf! CssBuilder
       */
      loadedJsFiles: {
        configurable: false,
        enumerable: false,
        value: [],
        writable: true
      },
      /**
       * @memberOf! CssBuilder
       */
      loadedCssFiles: {
        configurable: false,
        enumerable: false,
        value: [],
        writable: true
      },
      /**
       * @memberOf! CssBuilder
       */
      globalAssetsStorageService: {
        configurable: false,
        enumerable: false,
        value: globalAssetsStorageService,
        writable: false
      },
      /**
       * @memberOf! CssBuilder
       */
      elementAssetsLibrary: {
        configurable: false,
        enumerable: false,
        value: elementAssetsLibrary
      },
      /**
       * @memberOf! CssBuilder
       */
      stylesManager: {
        configurable: false,
        enumerable: false,
        value: stylesManager
      },
      /**
       * @memberOf! CssBuilder
       */
      window: {
        configurable: false,
        enumerable: false,
        value: windowObject,
        writable: true
      },
      /**
       * @memberOf! CssBuilder
       */
      jobs: {
        configurable: false,
        enumerable: false,
        value: [],
        writable: true
      },
      /**
       * @memberOf! CssBuilder
       */
      slugify: {
        configurable: false,
        enumerable: false,
        value: slugify,
        writable: true
      }
    })
    this.resetJobs = this.resetJobs.bind(this)
  }

  add (data, force = false) {
    if (!data) {
      return
    }
    const dataStorageState = getStorage('wordpressData').state('status').get().status

    this.updateStyleDomNodes(data)
    let cssBuildTypes = ['template', 'header', 'footer', 'sidebar']
    let editorType = window.VCV_EDITOR_TYPE ? window.VCV_EDITOR_TYPE() : false
    let allowCssBuild = (editorType && cssBuildTypes.indexOf(editorType) > -1)
    if (dataStorageState === 'loadSuccess' && env('VCV_FT_INITIAL_CSS_LOAD') && !allowCssBuild) {
      this.addElementEditorFiles(data)
    } else {
      this.addCssElementBaseByElement(data)
      this.addElementEditorFiles(data)
      this.globalAssetsStorageService.addElement(data.id)
      this.addElementGlobalAttributesCssMixins(data) // designOptions!
      this.addElementLocalAttributesCssMixins(data) // local element cssMixins folder
      this.addElementFiles(data, force)
    }

    this.doJobs(data).then(() => {
      this.addElementJobsToStorage(data, false)
      this.window.vcv.trigger('ready', 'add', data.id, {}, data.tag)
    })
  }

  update (data, options) {
    // const changedAttributeOptions = options && cook.getSettings(data.tag).settings[ options.changedAttribute ] && cook.getSettings(data.tag).settings[ options.changedAttribute ].options
    // let shouldStop = options && (options.changedAttributeType !== 'rowLayout' && options.changedAttributeType !== 'paramsGroup' && options.changedAttributeType !== 'designOptions' && options.changedAttributeType !== 'designOptionsAdvanced' && options.changedAttributeType !== 'element' && options.changedAttribute !== 'rowWidth')
    //
    // if (shouldStop && (!changedAttributeOptions || !changedAttributeOptions.cssMixin)) {
    //   return
    // }

    if (!data) {
      return
    }
    const dataStorageState = getStorage('wordpressData').state('status').get().status

    this.updateStyleDomNodes(data)
    if (dataStorageState === 'loadSuccess' && env('VCV_FT_INITIAL_CSS_LOAD')) {
      this.addElementEditorFiles(data)
    } else {
      this.addCssElementBaseByElement(data)
      this.addElementEditorFiles(data)
      this.globalAssetsStorageService.updateElement(data.id)
      this.addElementGlobalAttributesCssMixins(data) // designOptions!
      this.addElementLocalAttributesCssMixins(data) // local element cssMixins folder
      this.addElementFiles(data)
    }
    this.doJobs(data).then(() => {
      this.addElementJobsToStorage(data, false)
      this.window.vcv.trigger('ready', 'update', data.id, options, data.tag)
    })
  }

  destroy (id, tag) {
    this.globalAssetsStorageService.removeElement(id)
    this.removeCssElementBaseByElement(tag)
    this.removeCssElementMixinByElement(id)
    this.removeAttributesCssByElement(id)
    this.window.vcv.trigger('ready', 'destroy', id, {}, tag)
    this.removeElementJobsFromStorage(id)
  }

  addElementJobsToStorage (data, status) {
    let { id } = data
    let storageElements = (assetsStorage.state('jobs').get() && assetsStorage.state('jobs').get().elements) || []
    let element
    if (storageElements.length) {
      element = storageElements.find(element => element.id === id)
    }
    if (element) {
      element.jobs = status
    } else {
      let cookElement = cook.get(data)
      let element = {
        jobs: status,
        id: id,
        hidden: cookElement.get('hidden')
      }
      storageElements.push(element)
    }
    assetsStorage.state('jobs').set({ elements: storageElements })
  }

  removeElementJobsFromStorage (id) {
    let storageElements = (assetsStorage.state('jobs').get() && assetsStorage.state('jobs').get().elements) || []
    storageElements = storageElements.filter((element) => {
      return element.id !== id
    })
    assetsStorage.state('jobs').set({ elements: storageElements })
  }

  updateStyleDomNodes (data) {
    const id = data.id
    const elementTags = this.globalAssetsStorageService.getElementTagsByData(data)
    const settingStyles = this.window.document.getElementById('vcv-settings-css-styles')
    elementTags.forEach((tag) => {
      if (!this.window.document.getElementById(`vcv-base-css-styles-${tag}`)) {
        let baseStyleElement = this.window.document.createElement('style')
        baseStyleElement.id = `vcv-base-css-styles-${tag}`
        this.window.document.body.insertBefore(baseStyleElement, settingStyles)
      }
      if (!this.window.document.getElementById(`vcv-css-editor-styles-${tag}`)) {
        let editorStyleElement = this.window.document.createElement('style')
        editorStyleElement.id = `vcv-css-editor-styles-${tag}`
        this.window.document.body.insertBefore(editorStyleElement, settingStyles)
      }
    })

    if (!this.window.document.getElementById(`vcv-css-styles-${id}`)) {
      let styleElement = this.window.document.createElement('style')
      styleElement.id = `vcv-css-styles-${id}`
      this.window.document.body.insertBefore(styleElement, settingStyles)
    }
    if (!this.window.document.getElementById(`vcv-do-styles-${id}`)) {
      let doStyleElement = this.window.document.createElement('style')
      doStyleElement.id = `vcv-do-styles-${id}`
      this.window.document.body.insertBefore(doStyleElement, settingStyles)
    }

    // Inner element css-styles and do
    let elementObject = cook.get(data)
    let settings = elementObject.get('settings')
    for (let key in settings) {
      // If found element than get actual tags form element
      if (settings[ key ].type === 'element') {
        // we can get globalAttributesCssMixins for inner element
        let innerData = elementObject.get(key)
        let checksum = this.checksum(JSON.stringify(innerData))
        if (!this.window.document.getElementById(`vcv-css-styles-${id}-${checksum}`)) {
          let innerCssStyleElement = this.window.document.createElement('style')
          innerCssStyleElement.id = `vcv-css-styles-${id}-${checksum}`
          this.window.document.body.insertBefore(innerCssStyleElement, settingStyles)
        }
        if (!this.window.document.getElementById(`vcv-do-styles-${id}-${checksum}`)) {
          let innerDoStyleElement = this.window.document.createElement('style')
          innerDoStyleElement.id = `vcv-do-styles-${id}-${checksum}`
          this.window.document.body.insertBefore(innerDoStyleElement, settingStyles)
        }
      }
    }
  }

  addElementFiles (data, force) {
    if (force) {
      this.loadedCssFiles = []
      this.loadedJsFiles = []
    }
    let cookElement = cook.get(data)
    let elementAssetsFiles = this.elementAssetsLibrary.getAssetsFilesByElement(cookElement)
    const doc = this.window.document
    elementAssetsFiles.cssBundles.forEach((file) => {
      let slug = this.slugify(file)
      if (this.loadedCssFiles.indexOf(slug) === -1) {
        this.loadedCssFiles.push(slug)
        let cssLink = doc.createElement('link')
        cssLink.setAttribute('rel', 'stylesheet')
        cssLink.setAttribute('href', file)
        doc.head.appendChild(cssLink)
      }
    })

    elementAssetsFiles.jsBundles.forEach(
      (file) => {
        let slug = this.slugify(file)
        if (this.loadedJsFiles.indexOf(slug) === -1) {
          this.loadedJsFiles.push(slug)
          let scriptPromise = new Promise(
            (resolve, reject) => {
              this.window.jQuery.getScript(file).done(
                () => {
                  resolve(true)
                }
              ).fail(
                () => {
                  reject(new Error())
                }
              )
            }
          )
          this.addJob(scriptPromise)
        }
      }
    )
  }

  addElementEditorFiles (data) {
    const usedTags = this.globalAssetsStorageService.getElementsTagsList()
    const elementTags = this.globalAssetsStorageService.getElementTagsByData(data) || []
    elementTags.forEach((tag) => {
      if (usedTags.indexOf(tag) === -1) {
        let elementEditorCss = this.globalAssetsStorageService.elementCssEditor(tag)
        if (elementEditorCss.length) {
          let styles = this.stylesManager.create()
          styles.add(elementEditorCss)
          this.addJob(styles.compile().then((result) => {
            const file = this.window.document.getElementById(`vcv-css-editor-styles-${tag}`)
            if (file) {
              file.innerHTML = result
            }
          }))
        }
      }
    })
  }

  /**
   * Used in inner elements without ID for css styles
   * @param s
   * @return {string}
   */
  checksum (s) {
    let chk = 0x12345678
    let len = s.length
    for (let i = 0; i < len; i++) {
      chk += (s.charCodeAt(i) * (i + 1))
    }

    return (chk & 0xffffffff).toString(16)
  }

  addElementLocalAttributesCssMixins (data) {
    let styles = this.stylesManager.create()
    let localElementStyles = this.globalAssetsStorageService.getElementLocalAttributesCssMixins(data)
    styles.add(localElementStyles)

    let attributesStylesPromise = styles.compile().then((result) => {
      const style = this.window.document.getElementById(`vcv-css-styles-${data.id}`)
      if (style) {
        style.innerHTML = result
      }
    })
    this.addJob(attributesStylesPromise)

    let elementObject = cook.get(data)
    let settings = elementObject.get('settings')
    for (let key in settings) {
      // If found element than get actual tags form element
      if (settings[ key ].type === 'element') {
        // we can get localCss for inner element
        let innerData = elementObject.get(key)
        let checksum = this.checksum(JSON.stringify(innerData))
        let innerElementLocalAttributesCssMixins = this.globalAssetsStorageService.getElementLocalAttributesCssMixins(innerData)
        let innerStyles = this.stylesManager.create()
        innerStyles.add(innerElementLocalAttributesCssMixins)
        let innerStylesPromise = innerStyles.compile().then((result) => {
          const style = this.window.document.getElementById(`vcv-css-styles-${data.id}-${checksum}`)
          if (style) {
            style.innerHTML = result
          }
        })
        this.addJob(innerStylesPromise)
      }
    }
  }

  removeAttributesCssByElement (id) {
    const node = this.window.document.getElementById(`vcv-css-styles-${id}`)
    node && node.remove()
  }

  addCssElementBaseByElement (data) {
    const usedTags = this.globalAssetsStorageService.getElementsTagsList()
    const elementTags = this.globalAssetsStorageService.getElementTagsByData(data) || []
    elementTags.forEach((tag) => {
      if (usedTags.indexOf(tag) === -1) {
        let elementCssBase = this.globalAssetsStorageService.elementCssBase(tag)
        if (elementCssBase.length) {
          let styles = this.stylesManager.create()
          styles.add(elementCssBase)
          let css = styles.compile().then((result) => {
            const style = this.window.document.getElementById(`vcv-base-css-styles-${tag}`)
            if (style) {
              style.innerHTML = result
            }
          })
          this.addJob(css)
        }
      }
    })
  }

  removeCssElementBaseByElement (tag) {
    const usedTags = this.globalAssetsStorageService.getElementsTagsList()
    if (usedTags.indexOf(tag) === -1) {
      const node = this.window.document.getElementById(`vcv-base-css-styles-${tag}`)
      node && node.remove()
    }
  }

  addElementGlobalAttributesCssMixins (data) {
    let styles = this.stylesManager.create()
    let elementGlobalAttributesCssMixins = this.globalAssetsStorageService.getElementGlobalAttributesCssMixins(data)

    styles.add(elementGlobalAttributesCssMixins)
    let stylesPromise = styles.compile().then((result) => {
      const style = this.window.document.getElementById(`vcv-do-styles-${data.id}`)
      if (style) {
        style.innerHTML = result
      }
    })
    this.addJob(stylesPromise)

    let elementObject = cook.get(data)
    let settings = elementObject.get('settings')
    for (let key in settings) {
      // If found element than get actual tags form element
      if (settings[ key ].type === 'element') {
        // we can get globalAttributesCssMixins for inner element
        let innerData = elementObject.get(key)
        let checksum = this.checksum(JSON.stringify(innerData))
        let innerElementGlobalAttributesCssMixins = this.globalAssetsStorageService.getElementGlobalAttributesCssMixins(innerData)
        let innerStyles = this.stylesManager.create()
        innerStyles.add(innerElementGlobalAttributesCssMixins)
        let innerStylesPromise = innerStyles.compile().then((result) => {
          const style = this.window.document.getElementById(`vcv-do-styles-${data.id}-${checksum}`)
          if (style) {
            style.innerHTML = result
          }
        })
        this.addJob(innerStylesPromise)
      }
    }
  }

  removeCssElementMixinByElement (id) {
    const node = this.window.document.getElementById(`vcv-do-styles-${id}`)
    node && node.remove()
  }

  getSettingsCssContainer () {
    const id = 'vcv-settings-css-styles'
    const container = this.window.document.getElementById(id)
    if (container) {
      return container
    }
    const styleElement = this.window.document.createElement('style')
    styleElement.id = id
    this.window.document.body.appendChild(styleElement)
    return styleElement
  }

  buildSettingsCss (data) {
    const container = this.getSettingsCssContainer()
    container.innerHTML = data
  }

  addJob (job) {
    this.jobs.push(job)
  }

  doJobs (data) {
    this.addElementJobsToStorage(data, true)
    return Promise.all(this.jobs).catch(this.resetJobs).then(this.resetJobs)
  }

  resetJobs () {
    this.jobs.length = 0
  }
}
