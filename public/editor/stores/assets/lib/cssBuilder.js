export default class CssBuilder {
  constructor (assetsStorage, globalAssetsStorageService, elementAssetsLibrary, stylesManager, windowObject, slugify) {
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
      assetsStorage: {
        configurable: false,
        enumerable: false,
        value: assetsStorage,
        writable: false
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

  add (data) {
    const id = data.id
    this.globalAssetsStorageService.addElement(id)

    const baseStyleElement = this.window.document.createElement('style')
    baseStyleElement.id = `vcv-base-css-styles-${id}`
    this.window.document.body.appendChild(baseStyleElement)

    const styleElement = this.window.document.createElement('style')
    styleElement.id = `vcv-css-styles-${id}`
    this.window.document.body.appendChild(styleElement)

    const doStyleElement = this.window.document.createElement('style')
    doStyleElement.id = `vcv-do-styles-${id}`
    this.window.document.body.appendChild(doStyleElement)

    this.addCssElementBaseByElement(data)
    this.addCssElementMixinByElement(data)
    this.addAttributesCssByElement(data)
    this.addElementFiles(data.tag)
    this.doJobs().then(() => {
      this.window.vcv.trigger('ready', 'add', data.id)
    })
  }

  update (data) {
    const id = data.id
    this.globalAssetsStorageService.updateElement(id)
    this.addCssElementMixinByElement(data)
    this.addAttributesCssByElement(data)
    this.doJobs().then(() => {
      this.window.vcv.trigger('ready', 'update', id)
    })
  }

  destroy (id, tag) {
    this.globalAssetsStorageService.removeElement(id)
    this.removeCssElementBaseByElement(id)
    this.removeCssElementMixinByElement(id)
    this.removeAttributesCssByElement(id)
    this.removeElementFiles(tag)
    this.window.vcv.trigger('ready', 'destroy', id)
  }

  addElementFiles (tag) {
    let elementAssetsFiles = this.elementAssetsLibrary.getAssetsFilesByTags([ tag ])
    // Also add to storage by request
    this.assetsStorage.trigger('addAssetsFiles', elementAssetsFiles.cssBundles)
    this.assetsStorage.trigger('addAssetsFiles', elementAssetsFiles.jsBundles)
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

    elementAssetsFiles.jsBundles.forEach((file) => {
      let slug = this.slugify(file)
      if (this.loadedJsFiles.indexOf(slug) === -1) {
        this.loadedJsFiles.push(slug)
        this.addJob(this.window.jQuery.getScript(file))
      }
    })
  }

  removeElementFiles (tag) {
    if (tag) {
      // Only trigger ask to remove from Storage
      let elementAssetsFiles = this.elementAssetsLibrary.getAssetsFilesByTags([ tag ])
      this.assetsStorage.trigger('removeAssetsFiles', elementAssetsFiles.cssBundles)
      this.assetsStorage.trigger('removeAssetsFiles', elementAssetsFiles.jsBundles)
    }
  }

  addAttributesCssByElement (data) {
    let styles = this.stylesManager.create()
    styles.add(this.globalAssetsStorageService.getCssDataByElement(data, { tags: false, attributeMixins: false }))
    styles.compile().then((result) => {
      this.window.document.getElementById(`vcv-css-styles-${data.id}`).innerHTML = result
    })
  }

  removeAttributesCssByElement (id) {
    const node = this.window.document.getElementById(`vcv-css-styles-${id}`)
    node && node.remove()
  }

  addCssElementBaseByElement (data) {
    let styles = this.stylesManager.create()
    styles.add(this.globalAssetsStorageService.getCssDataByElement(data, { attributeMixins: false, cssMixins: false }))
    // styles.add(this.globalAssetsStorageService.getColumnsCssData())
    this.addJob(styles.compile().then((result) => {
      this.window.document.getElementById(`vcv-base-css-styles-${data.id}`).innerHTML = result
    }))
  }

  removeCssElementBaseByElement (id) {
    const node = this.window.document.getElementById(`vcv-base-css-styles-${id}`)
    node && node.remove()
  }

  addCssElementMixinByElement (data) {
    let styles = this.stylesManager.create()
    styles.add(this.globalAssetsStorageService.getCssDataByElement(data, { tags: false, cssMixins: false }))
    this.addJob(styles.compile().then((result) => {
      this.window.document.getElementById(`vcv-do-styles-${data.id}`).innerHTML = result
    }))
  }

  removeCssElementMixinByElement (id) {
    const node = this.window.document.getElementById(`vcv-do-styles-${id}`)
    node && node.remove()
  }

  addJob (job) {
    this.jobs.push(job)
  }

  doJobs () {
    return Promise.all(this.jobs).catch(this.resetJobs).then(this.resetJobs)
  }

  resetJobs () {
    this.jobs.length = 0
  }
}
