export default class CssBuilder {
  constructor (assetsStorage, assetsManager, stylesManager, windowObject) {
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
      assetsManager: {
        configurable: false,
        enumerable: false,
        value: assetsManager
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
      }
    })
    this.resetJobs = this.resetJobs.bind(this)
  }

  add (data) {
    const id = data.id
    this.assetsStorage.updateElement(id)

    const baseStyleElement = this.window.document.createElement('style')
    baseStyleElement.id = `base-css-styles-${id}`
    this.window.document.body.appendChild(baseStyleElement)

    const styleElement = this.window.document.createElement('style')
    styleElement.id = `css-styles-${id}`
    this.window.document.body.appendChild(styleElement)

    const doStyleElement = this.window.document.createElement('style')
    doStyleElement.id = `do-styles-${id}`
    this.window.document.body.appendChild(doStyleElement)

    this.addElementCssFiles(data.tag)
    this.addElementJsFiles(data.tag)
    this.addCssElementBaseByElement(data)
    this.addCssElementMixinByElement(data)
    this.addAttributesCssByElement(data)
    this.doJobs().then(() => {
      this.window.vcv.trigger('ready', 'add', data.id)
    })
  }

  update (data) {
    const id = data.id
    this.assetsStorage.updateElement(id)
    this.addCssElementMixinByElement(data)
    this.addAttributesCssByElement(data)
    this.doJobs().then(() => {
      this.window.vcv.trigger('ready', 'update', id)
    })
  }

  destroy (id) {
    this.assetsStorage.removeElement(id)
    this.removeCssElementBaseByElement(id)
    this.removeCssElementMixinByElement(id)
    this.removeAttributesCssByElement(id)
    this.window.vcv.trigger('ready', 'destroy', id)
  }

  addElementJsFiles (tag) {
    let jsFiles = this.assetsManager.getJsFilesByTags([ tag ])
    jsFiles.forEach((file) => {
      if (this.loadedJsFiles.indexOf(file) === -1) {
        this.loadedJsFiles.push(file)
        this.addJob(this.window.$.getScript(this.assetsManager.getSourcePath(file)))
      }
    })
  }

  addElementCssFiles (tag) {
    const cssFiles = this.assetsManager.getCssFilesByTags([ tag ])
    const doc = this.window.document
    cssFiles.forEach((file) => {
      if (this.loadedCssFiles.indexOf(file) === -1) {
        this.loadedCssFiles.push(file)
        let cssLink = doc.createElement('link')
        cssLink.setAttribute('rel', 'stylesheet')
        cssLink.setAttribute('href', this.assetsManager.getSourcePath(file))
        doc.head.appendChild(cssLink)
      }
    })
  }
  addAttributesCssByElement (data) {
    let styles = this.stylesManager.create()
    styles.add(this.assetsStorage.getCssDataByElement(data, { tags: false, attributeMixins: false }))
    styles.compile().then((result) => {
      this.window.document.getElementById(`css-styles-${data.id}`).innerHTML = result
    })
  }

  removeAttributesCssByElement (id) {
    this.window.document.getElementById(`css-styles-${id}`).remove()
  }
  addCssElementBaseByElement (data) {
    let attributesStyles = this.stylesManager.create()
    attributesStyles.add(this.assetsStorage.getCssDataByElement(data, { attributeMixins: false, cssMixins: false }))
    this.addJob(attributesStyles.compile().then((result) => {
      this.window.document.getElementById(`base-css-styles-${data.id}`).innerHTML = result
    }))
  }
  removeCssElementBaseByElement (id) {
    this.window.document.getElementById(`base-css-styles-${id}`).remove()
  }
  addCssElementMixinByElement (data) {
    let attributesStyles = this.stylesManager.create()
    attributesStyles.add(this.assetsStorage.getCssDataByElement(data, { tags: false, cssMixins: false }))
    this.addJob(attributesStyles.compile().then((result) => {
      this.window.document.getElementById(`do-styles-${data.id}`).innerHTML = result
    }))
  }
  removeCssElementMixinByElement (id) {
    this.window.document.getElementById(`do-styles-${id}`).remove()
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
