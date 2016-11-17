import vcCake from 'vc-cake'
import postcss from 'postcss'
import postcssVars from 'postcss-custom-properties'
import postcssMedia from 'postcss-custom-media'
import designOptions from './lib/design-options'
import rowColumn from './lib/row-column'
import CustomCss from './lib/customCss'
import GlobalCss from './lib/globalCss'
import lodash from 'lodash'
import postcssAdvancedVars from 'postcss-advanced-variables'
import postcssColor from 'postcss-color-function'
import postcssNested from 'postcss-nested'

const customCss = new CustomCss()
const globalCss = new GlobalCss()

let jsFilesList = []
let cssFilesList = []

vcCake.addService('assets-manager', {
  /**
   * Up-to-date list of all elements
   *
   * @param {Object}
   */
  elements: {}, // @AS
  columns: {}, // @AS

  /**
   * Get cook service
   * @returns {*}
   */
  cook () {
    return vcCake.getService('cook')
  },

  /**
   * Set elements
   * @param elements
   */
  set (elements) { // @AS
    // todo: validate elements
    Object.assign({}, elements)
    this.elements = elements
  },

  /**
   * Set custom css
   * @param value
   */
  setCustomCss (value) { // @AS
    customCss.data = value
  },

  /**
   * Get custom css data
   * @returns {*}
   */
  getCustomCss () { // @AS
    return customCss.data
  },

  /**
   * Set global css
   * @param value
   */
  setGlobalCss (value) { // @AS
    globalCss.data = value
  },

  /**
   * Get global css data
   * @returns {*}
   */
  getGlobalCss () { // @AS
    return globalCss.data
  },

  /**
   * Get js files list
   * @returns {*}
   */
  getJsFiles () { // @AM
    let tags = Object.keys(this.getTags())
    tags.forEach((tag) => {
      // get js files from elements
      let elementObject = this.cook().get({ tag: tag })
      let jsFiles = elementObject.get('metaPublicJs')
      if (jsFiles && jsFiles.length) {
        jsFilesList = jsFilesList.concat(jsFiles)
      }
      let assetsLibrary = elementObject.get('assetsLibrary')
      // get js file from shared assets
      if (assetsLibrary && assetsLibrary.length) {
        assetsLibrary.forEach((lib) => {
          jsFiles = this.getAssetsLibraryJsFiles(lib)
          if (jsFiles && jsFiles.length) {
            jsFilesList = jsFilesList.concat(jsFiles)
          }
        })
      }
    })
    jsFilesList = [ ...new Set(jsFilesList) ]
    return jsFilesList
  },

  /**
   * Get css files list
   * @returns {*}
   */
  getCssFiles () { // @AM
    let tags = Object.keys(this.getTags())
    tags.forEach((tag) => {
      let elementObject = this.cook().get({ tag: tag })
      let assetsLibrary = elementObject.get('assetsLibrary')

      if (assetsLibrary && assetsLibrary.length) {
        assetsLibrary.forEach((lib) => {
          let cssFiless = this.getAssetsLibraryCssFiles(lib)
          if (cssFiless && cssFiless.length) {
            cssFilesList = cssFilesList.concat(cssFiless)
          }
        })
      }
    })
    cssFilesList = [ ...new Set(cssFilesList) ]
    return cssFilesList
  },

  getAssetsLibraryCssFiles (lib) { // @AM
    let assetsLibrary = vcCake.getService('assets-library')
    let libData = assetsLibrary.get(lib)
    if (libData && libData.publicCss && libData.publicCss.length) {
      return libData.publicCss
    }
  },

  getAssetsLibraryJsFiles (lib) { // @AM
    let assetsLibrary = vcCake.getService('assets-library')
    let libData = assetsLibrary.get(lib)
    if (libData && libData.publicJs && libData.publicJs.length) {
      return libData.publicJs
    }
  },

  /**
   * Add element by id
   * @param id
   */
  add (id) { // @AS
    let ids = []
    if (Array.isArray(id)) {
      ids = id
    } else {
      ids.push(id)
    }
    ids.forEach((id) => {
      if (!this.get(id)) {
        this.update(id, true)
      }
    })
  },

  /**
   * Get element by id
   * @param assetKey
   * @returns {*}
   */
  get (assetKey = false) { // @AS
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
  update (id, force = false) { // @AS
    let ids = []
    if (Array.isArray(id)) {
      ids = id
    } else {
      ids.push(id)
    }
    ids.forEach((id) => {
      if (this.get(id) || force) {
        let documentService = vcCake.getService('document')
        let element = documentService.get(id)
        let tags = this.getElementTagsByTagName(element.tag, {}, element)
        let designOptionsData = this.cook().get(element).get('designOptions')
        let useDO = (typeof designOptionsData !== 'undefined' && designOptionsData.hasOwnProperty('used') && designOptionsData.used)
        this.elements[ id ] = {
          tags: tags,
          useDesignOptions: useDO
        }
        let columnSizes = this.getColumnSizes(element)
        if (columnSizes) {
          this.elements[ id ][ 'columnSizes' ] = columnSizes
        }
        let cssMixins = this.getCssMixinsByElement(element, {})
        if (Object.keys(cssMixins).length) {
          this.elements[ id ][ 'cssMixins' ] = cssMixins
        }
      }
    })
  },

  /**
   * Remove element by id
   * @param id
   */
  remove (id) { // @AS
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
  getPublicPath (tag, file) { // @AM
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
  getSourcePath (file = null) { // @AM
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
   * Get all used elements tags
   * @returns {{}}
   */
  getTags () { // @SM
    let tags = {}
    for (let id in this.elements) {
      let elementTags = this.elements[ id ].tags
      lodash.merge(tags, elementTags)
    }
    return tags
  },

  /**
   * Get all used mixins data
   * @returns {{}}
   */
  getCssMixinsData () { // @ SM
    let mixins = {}
    for (let id in this.elements) {
      let elementMixins = this.elements[ id ].cssMixins
      if (elementMixins) {
        lodash.merge(mixins, elementMixins)
      }
    }
    return mixins
  },

  /**
   * Get element tags from element exact data or default settings
   * @param tag
   * @param tags
   * @param data
   * @returns {*}
   */
  getElementTagsByTagName (tag, tags, data = {}) { // @SM
    let element = this.cook().get({ tag: tag })
    let settings = element.get('settings')
    for (let key in settings) {
      // If found element than get actual tags form element
      if (settings[ key ].type === 'element') {
        if (lodash.isEmpty(data)) {
          // get tag from default value
          tags = this.getElementTagsByTagName(settings[ key ].value.tag, tags)
        } else {
          // get tad from data
          tags = this.getElementTagsByTagName(data[ key ].tag, tags, data[ key ])
        }
      }
    }
    if (!tags.hasOwnProperty(tag)) {
      tags[ tag ] = true
    }
    return tags
  },

  /**
   * Get css mixins data by element
   * @param elData
   * @param mixins
   * @returns {{}}
   */
  getCssMixinsByElement (elData, mixins = {}) { // @SM
    let element = this.cook().get(elData)
    let settings = element.get('settings')
    let foundMixins = {}
    for (let key in settings) {
      // If found element than get actual data form element
      if (settings[ key ].type === 'element') {
        mixins = this.getCssMixinsByElement(element.data[ key ], mixins)
      } else {
        if (settings[ key ].hasOwnProperty('options') && settings[ key ].options.hasOwnProperty('cssMixin')) {
          let mixin = settings[ key ].options.cssMixin
          if (!foundMixins[ mixin.mixin ]) {
            foundMixins[ mixin.mixin ] = {
              variables: {}
            }
          }
          foundMixins[ mixin.mixin ].variables[ mixin.property ] = { value: element.data[ key ] }
          if (mixin.namePattern) {
            foundMixins[ mixin.mixin ].variables[ mixin.property ][ 'namePattern' ] = mixin.namePattern
          }
        }
      }
    }

    for (let mixin in foundMixins) {
      if (!mixins[ element.data.tag ]) {
        mixins[ element.data.tag ] = {}
      }
      if (!mixins[ element.data.tag ][ mixin ]) {
        mixins[ element.data.tag ][ mixin ] = {}
      }
      let names = []
      let variables = {}
      let useMixin = false
      Object.keys(foundMixins[ mixin ].variables).sort().forEach((variable) => {
        let name = foundMixins[ mixin ].variables[ variable ].value || 'empty' // must be string 'empty' for css selector
        if (foundMixins[ mixin ].variables[ variable ].namePattern) {
          name = name.match(new RegExp(foundMixins[ mixin ].variables[ variable ].namePattern, 'gi'))
          name = name ? name.join('-') : 'empty'
        }
        names.push(name)
        variables[ variable ] = foundMixins[ mixin ].variables[ variable ].value || false
        // if any variable is set we can use mixin
        if (variables[ variable ]) {
          useMixin = true
        }
      })
      names = names.join('--')
      if (names && useMixin) {
        variables[ 'selector' ] = names
        mixins[ element.data.tag ][ mixin ][ names ] = variables
      }
    }
    return mixins
  },

  /**
   * Get styles object combined by tagName
   * @returns {{}}
   */
  getStyles () { // @SM
    let styles = {}
    let tags = Object.keys(this.getTags())

    tags.forEach((tag) => {
      let elementObject = this.cook().get({ tag: tag })
      let cssSettings = elementObject.get('cssSettings')
      styles[ tag ] = {
        css: cssSettings.css,
        editorCss: cssSettings.editorCss
      }
    })
    return styles
  },

  /**
   * Get css mixins styles
   * @returns {{}}
   */
  getCssMixinsStyles () { // @SM
    let styles = []
    let mixinsData = this.getCssMixinsData()
    let tagsList = Object.keys(mixinsData)

    tagsList.forEach((tag) => {
      let elementObject = this.cook().get({ tag: tag })
      let cssSettings = elementObject.get('cssSettings')
      let mixins = Object.keys(mixinsData[ tag ])

      mixins.forEach((mixin) => {
        for (let selector in mixinsData[ tag ][ mixin ]) {
          if (cssSettings.mixins && cssSettings.mixins[ mixin ]) {
            styles.push({
              variables: mixinsData[ tag ][ mixin ][ selector ],
              mixin: cssSettings.mixins[ mixin ].mixin
            })
          }
        }
      })
    })
    return styles
  },

  /**
   * Get compiled css
   * @returns {string}
   */
  getCompiledCss (editor = false) { // @SM
    var iterations = []
    // add styles
    let styles = this.getStyles()
    this.updateColumns()
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
      if (editor && !!styles[ tagName ].editorCss) {
        let stylePromise = new Promise((resolve, reject) => {
          postcss()
            .use(postcssVars())
            .process(styles[ tagName ].editorCss)
            .then((result) => {
              resolve(result.css)
            })
        })
        iterations.push(stylePromise)
      }
    }
    // add columns css
    iterations = iterations.concat(this.getCompileColumnsIterations())
    // add css mixins
    let cssMixinsStyles = this.getCssMixinsStyles()
    cssMixinsStyles.forEach((mixin) => {
      let compiledStyles = new Promise((resolve, reject) => {
        postcss()
          .use(postcssAdvancedVars({
            variables: mixin.variables,
            silent: true
          }))
          .use(postcssNested)
          .use(postcssColor)
          .process(mixin.mixin)
          .then((result) => {
            resolve(result.css)
          })
      })
      iterations.push(compiledStyles)
    })

    return Promise.all(iterations).then((output) => {
      return output.join(' ')
    })
  },

  /**
   * get design options
   * @returns {{}}
   */
  getDesignOptions () { // @AS
    let documentService = vcCake.getService('document')
    let returnOptions = {}
    let elements = this.get()
    for (let id in elements) {
      if (elements[ id ].useDesignOptions) {
        let element = documentService.get(id)
        if (element) {
          let designOptionsData = this.cook().get(element).get('designOptions')
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
  getCompiledDesignOptions () { // @AS
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
  setColumns (columns) { // @AS
    // todo: validate elements
    this.columns = columns
  },

  /**
   * add column
   * @param column
   */
  addColumn (column) { // @AS
    let columns = []
    if (Array.isArray(column)) {
      columns = column
    } else {
      columns.push(column)
    }
    let validFormat = /^\d+\/\d+$/
    columns.forEach((column) => {
      if (validFormat.test(column)) {
        if (!this.getColumn(column)) {
          let data = column.split('/')
          if (data[ 0 ] <= data[ 1 ]) {
            this.columns[ column ] = {
              numerator: data[ 0 ],
              denominator: data[ 1 ],
              count: 1
            }
          }
        } else {
          this.columns[ column ].count++
        }
      }
    })
  },

  /**
   * Get column
   * @param assetKey
   * @returns {*}
   */
  getColumn (assetKey = false) { // @AS
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
  removeColumn (column) { // @AS
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
   * @returns {Array}
   */
  getCompileColumnsIterations () { // @AM
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

    return iterations
  },

  /**
   * Get column sizes
   * @param element
   */
  getColumnSizes (element) { // @AS
    let settings = this.cook().get(element).get('settings')
    let value = settings.relatedTo ? settings.relatedTo.value : []
    let isColumn = value.filter((item) => {
      return item.toLowerCase() === 'column'
    })

    let sizes = null
    if (isColumn.length && element.size) {
      sizes = [ element.size ]
    }
    return sizes
  },

  updateColumns () { // @AS
    // for this.get()
    for (let id in this.elements) {
      if (this.elements[ id ].columnSizes && this.elements[ id ].columnSizes.length) {
        this.addColumn(this.elements[ id ].columnSizes)
      }
    }
  }
})
