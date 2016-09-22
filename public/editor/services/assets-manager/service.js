import vcCake from 'vc-cake'
import postcss from 'postcss'
import postcssVars from 'postcss-custom-properties'
import postcssMedia from 'postcss-custom-media'
import designOptions from './lib/design-options'
import rowColumn from './lib/row-column'
import CustomCss from './lib/customCss'

const customCss = new CustomCss()
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
   * @param elements
   */
  set: function (elements) {
    // todo: validate elements
    this.elements = elements
  },
  setStyles: function (styles) {
    // todo: validate elements
    this.styles = styles
  },
  setCustomCss: function (value) {
    customCss.data = value
  },
  getCustomCss: function () {
    return customCss.data
  },
  /**
   * @param id
   */
  add: function (id) {
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
   * @param assetKey
   * @returns {*}
   */
  get: function (assetKey = false) {
    if (!assetKey) {
      return this.elements
    }
    if (typeof this.elements[ assetKey ] === 'undefined') {
      return null
    }
    return this.elements[ assetKey ]
  },

  /**
   * @param id
   */
  update: function (id) {
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
   * @param id
   */
  remove: function (id) {
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
   * @param tag
   * @param file
   * @returns {*}
   */
  getPublicPath: (tag, file) => {
    let path
    if (vcCake.env('platform') === 'node') {
      path = window.vcvPluginUrl + 'sources/elements/' + tag + '/public'
    } else {
      path = window.vcvPluginUrl + 'public/sources/elements/' + tag + '/public'
    }
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
   * Get styles object combined by tagName
   * @returns {{}}
   */
  getStyles: function () {
    let styles = {}
    let elements = this.get()
    for (let id in elements) {
      if (styles.hasOwnProperty(elements[ id ].tag)) {
        styles[ elements[ id ].tag ].count++
      } else {
        let cook = vcCake.getService('cook')
        let documentService = vcCake.getService('document')
        let element = documentService.get(id)
        if (element) {
          let cssSettings = cook.get(element).get('cssSettings')
          styles[ elements[ id ].tag ] = {
            count: 1,
            css: cssSettings.css
          }
        }
      }
    }

    return styles
  },

  /**
   * @returns {string}
   */
  getCompiledCss: function () {
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
   * @returns {Promise.<TResult>}
   */
  getCompiledDesignOptions: function () {
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
   * @param columns
   */
  setColumns: function (columns) {
    // todo: validate elements
    this.columns = columns
  },

  /**
   * @param column
   */
  addColumn: function (column) {
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
   * @param assetKey
   * @returns {*}
   */
  getColumn: function (assetKey = false) {
    if (!assetKey) {
      return this.columns
    }
    if (typeof this.columns[ assetKey ] === 'undefined') {
      return null
    }
    return this.columns[ assetKey ]
  },

  /**
   * @param column
   */
  removeColumn: function (column) {
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
   * @returns {Promise.<TResult>}
   */
  getCompiledColumns: function () {
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
