import vcCake from 'vc-cake'
import postcss from 'postcss'
import postcssVars from 'postcss-custom-properties'
import postcssMedia from 'postcss-custom-media'
import designOptions from './lib/design-options'
import rowColumn from './lib/row-column'
import CustomCss from './lib/customCss'
import GlobalCss from './lib/globalCss'

const customCss = new CustomCss()
const globalCss = new GlobalCss()

let jsFilesList = null

vcCake.addService('assets-manager', {
  /**
   * Up-to-date list of all elements
   *
   * @param {Object}
   */
  elements: {},
  styles: {},
  columns: {},

  /**
   * Set elements
   * @param elements
   */
  set (elements) {
    // todo: validate elements
    this.elements = elements
  },

  /**
   * Set styles
   * @param styles
   */
  setStyles (styles) {
    // todo: validate elements
    this.styles = styles
  },

  /**
   * Set custom css
   * @param value
   */
  setCustomCss (value) {
    customCss.data = value
  },

  /**
   * Get custom css data
   * @returns {*}
   */
  getCustomCss () {
    return customCss.data
  },

  /**
   * Set global css
   * @param value
   */
  setGlobalCss (value) {
    globalCss.data = value
  },

  /**
   * Get global css data
   * @returns {*}
   */
  getGlobalCss () {
    return globalCss.data
  },

  /**
   * Get js files list
   * @returns {*}
   */
  getJsFiles () {
    this.getStyles()
    return jsFilesList
  },

  /**
   * Add element by id
   * @param id
   */
  add (id) {
    let ids = []
    if (Array.isArray(id)) {
      ids = id
    } else {
      ids.push(id)
    }
    ids.forEach((id) => {
      if (!this.get(id)) {
        let cook = vcCake.getService('cook')
        let documentService = vcCake.getService('document')
        let element = documentService.get(id)
        let designOptionsData = cook.get(element).get('designOptions')
        let useDO = (typeof designOptionsData !== 'undefined' && designOptionsData.hasOwnProperty('used') && designOptionsData.used)
        this.elements[ id ] = {
          tag: element.tag,
          useDesignOptions: useDO
        }
      }
    })
  },

  /**
   * Get element by id
   * @param assetKey
   * @returns {*}
   */
  get (assetKey = false) {
    if (!assetKey) {
      return this.elements
    }
    if (typeof this.elements[ assetKey ] === 'undefined') {
      return null
    }
    return this.elements[ assetKey ]
  },

  /**
   * Update element by id
   * @param id
   */
  update (id) {
    if (this.get(id)) {
      let cook = vcCake.getService('cook')
      let documentService = vcCake.getService('document')
      let element = documentService.get(id)
      let designOptionsData = cook.get(element).get('designOptions')
      let useDO = (typeof designOptionsData !== 'undefined' && designOptionsData.hasOwnProperty('used') && designOptionsData.used)
      this.elements[ id ] = {
        tag: element.tag,
        useDesignOptions: useDO
      }
    }
  },

  /**
   * Remove element by id
   * @param id
   */
  remove (id) {
    let ids = []
    if (Array.isArray(id)) {
      ids = id
    } else {
      ids.push(id)
    }
    ids.forEach((id) => {
      if (!this.get(id)) {
        return
      }
      delete this.elements[ id ]
    })
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
      path = $element.dataset.vcElementUrl + '/public'
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
   * Get styles object combined by tagName
   * @returns {{}}
   */
  getStyles () {
    let styles = {}
    jsFilesList = []
    let elements = this.get()
    for (let id in elements) {
      if (styles.hasOwnProperty(elements[ id ].tag)) {
        styles[ elements[ id ].tag ].count++
      } else {
        let cook = vcCake.getService('cook')
        let documentService = vcCake.getService('document')
        let element = documentService.get(id)
        if (element) {
          let elementObject = cook.get(element)
          let cssSettings = elementObject.get('cssSettings')
          let jsFiles = elementObject.get('metaPublicJs')
          let settings = elementObject.get('settings')
          styles[ elements[ id ].tag ] = {
            count: 1,
            css: cssSettings.css
          }
          if (jsFiles && jsFiles.length) {
            jsFilesList = jsFilesList.concat(jsFiles)
          }
          Object.keys(settings).forEach((key) => {
            let option = settings[ key ]
            if (option.type && option.type === 'element') {
              let innerTag = elementObject.get(key).tag
              if (innerTag && styles.hasOwnProperty(innerTag)) {
                styles[ innerTag ].count++
              } else if (innerTag) {
                let innerElementObject = cook.get({ tag: innerTag })
                let innerCssSettings = innerElementObject.get('cssSettings')
                let jsFiles = elementObject.get('metaPublicJs')
                styles[ innerTag ] = {
                  count: 1,
                  css: innerCssSettings.css
                }
                if (jsFiles && jsFiles.length) {
                  jsFilesList = jsFilesList.concat(jsFiles)
                }
              }
            }
          })
        }
      }
    }
    jsFilesList = [ ...new Set(jsFilesList) ]
    return styles
  },

  /**
   * Get compiled css
   * @returns {string}
   */
  getCompiledCss () {
    let styles = this.getStyles()
    var iterations = []
    for (let tagName in styles) {
      if (styles[ tagName ].css) {
        let stylePromise = new Promise((resolve, reject) => {
          postcss()
            .use(postcssVars())
            .process(styles[ tagName ].css)
            .then((result) => {
              resolve(result.css)
            })
        })
        iterations.push(stylePromise)
      }
    }

    return Promise.all(iterations).then((output) => {
      return output.join(' ')
    })
  },

  /**
   * get design options
   * @returns {{}}
   */
  getDesignOptions () {
    let cook = vcCake.getService('cook')
    let documentService = vcCake.getService('document')
    let returnOptions = {}
    let elements = this.get()
    for (let id in elements) {
      if (elements[ id ].useDesignOptions) {
        let element = documentService.get(id)
        if (element) {
          let designOptionsData = cook.get(element).get('designOptions')
          if (typeof designOptionsData !== 'undefined' && designOptionsData.hasOwnProperty('used') && designOptionsData.used) {
            returnOptions[ id ] = designOptionsData
          }
        }
      }
    }

    return returnOptions
  },

  /**
   * Get compiled design options css
   * @returns {Promise.<TResult>}
   */
  getCompiledDesignOptions () {
    let devices = designOptions.getDevices()
    let viewPortBreakpoints = {}
    for (let device in devices) {
      let sizes = []
      if (devices[ device ].min) {
        sizes.push('(min-width: ' + devices[ device ].min + ')')
      }
      if (devices[ device ].max) {
        sizes.push('(max-width: ' + devices[ device ].max + ')')
      }
      viewPortBreakpoints[ '--' + device ] = sizes.join(' and ')
    }

    let outputCss = []
    let designOptionsData = this.getDesignOptions()
    for (let id in designOptionsData) {
      outputCss.push(designOptions.getCss(id, designOptionsData[ id ]))
    }
    var iterations = []
    for (let style of outputCss) {
      if (style) {
        let stylePromise = new Promise((resolve, reject) => {
          postcss()
            .use(postcssMedia({ extensions: viewPortBreakpoints }))
            .process(style)
            .then((result) => {
              resolve(result.css)
            })
        })
        iterations.push(stylePromise)
      }
    }

    return Promise.all(iterations).then((output) => {
      return output.join(' ')
    })
  },

  /**
   * Set columns
   * @param columns
   */
  setColumns (columns) {
    // todo: validate elements
    this.columns = columns
  },

  /**
   * add column
   * @param column
   */
  addColumn (column) {
    // todo: add regexp to check format (1/12 or 3/4)
    let columns = []
    if (Array.isArray(column)) {
      columns = column
    } else {
      columns.push(column)
    }
    columns.forEach((column) => {
      if (!this.getColumn(column)) {
        let data = column.split('/')
        this.columns[ column ] = {
          numerator: data[ 0 ],
          denominator: data[ 1 ],
          count: 1
        }
      } else {
        this.columns[ column ].count++
      }
    })
  },

  /**
   * Get column
   * @param assetKey
   * @returns {*}
   */
  getColumn (assetKey = false) {
    if (!assetKey) {
      return this.columns
    }
    if (typeof this.columns[ assetKey ] === 'undefined') {
      return null
    }
    return this.columns[ assetKey ]
  },

  /**
   * Remove column
   * @param column
   */
  removeColumn (column) {
    let columns = []
    if (Array.isArray(column)) {
      columns = column
    } else {
      columns.push(column)
    }
    columns.forEach((column) => {
      if (!this.getColumn(column)) {
        return
      }
      this.columns[ column ].count--
      if (this.columns[ column ].count < 1) {
        delete this.columns[ column ]
      }
    })
  },

  /**
   * get compiled columns
   * @returns {Promise.<TResult>}
   */
  getCompiledColumns () {
    let devices = rowColumn.getDevices()
    let viewPortBreakpoints = {}
    for (let device in devices) {
      viewPortBreakpoints[ '--' + device ] = '(min-width: ' + devices[ device ].min + ')'
    }

    var iterations = []
    let stylePromise = new Promise((resolve, reject) => {
      postcss()
        .use(postcssMedia({ extensions: viewPortBreakpoints }))
        .process(rowColumn.getCss(this.getColumn()))
        .then((result) => {
          resolve(result.css)
        })
    })
    iterations.push(stylePromise)

    return Promise.all(iterations).then((output) => {
      return output.join(' ')
    })
  }
})
