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
  }

  add (data) {
    const id = data.id

    const styleElement = this.window.document.createElement('style')
    styleElement.id = `css-styles-${id}`
    this.window.document.body.appendChild(styleElement)

    const doStyleElement = this.window.document.createElement('style')
    doStyleElement.id = `do-styles-${id}`
    this.window.document.body.appendChild(doStyleElement)

    this.addAttributesCssByElement(data)
    this.addCssElementMixinByElement(data)
    this.doJobs().then(() => {
      this.window.vcv.trigger('ready', 'add', data.id)
    })
  }

  update (data) {
    this.addAttributesCssByElement(data)
    this.addCssElementMixinByElement(data)
    this.doJobs().then(() => {
      this.window.vcv.trigger('ready', 'update', data.id)
    })
  }

  destroy (id) {
    // here come destroy methods
  }

  addAttributesCssByElement (data) {
    let styles = this.stylesManager.create()
    styles.add(this.assetsStorage.getCssDataByElement(data, { tags: false, attributeMixins: false }))
    styles.compile().then((result) => {
      this.window.document.getElementById(`css-styles-${data.id}`).innerHTML = result
    })
  }

  addCssElementMixinByElement (data) {
    let attributesStyles = this.stylesManager.create()
    attributesStyles.add(this.assetsStorage.getCssDataByElement(data, { tags: false, cssMixins: false }))
    this.addJob(attributesStyles.compile().then((result) => {
      this.window.document.getElementById(`do-styles-${data.id}`).innerHTML = result
    }))
  }

  addJob (job) {
    this.jobs.push(job)
  }

  doJobs () {
    return Promise.all(this.jobs).then(this.resetJobs.bind(this))
  }

  resetJobs () {
    this.jobs.length = 0
  }
}
