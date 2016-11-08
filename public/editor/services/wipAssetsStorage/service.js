import vcCake from 'vc-cake'
import lodash from 'lodash'
import CustomCss from './lib/customCss'
import GlobalCss from './lib/globalCss'
import designOptions from './lib/design-options'
import rowColumn from './lib/row-column'

const customCss = new CustomCss()
const globalCss = new GlobalCss()

vcCake.addService('wipAssetsStorage', {
  /**
   * Up-to-date list of all elements
   *
   * @param {Object}
   */
  elements: {},

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
  set (elements) {
    // todo: validate elements
    this.elements = Object.assign({}, elements)
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
        this.update(id, true)
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
  update (id, force = false) {
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
        // get design options data
        let designOptionsData = this.cook().get(element).get('designOptions')
        let useDO = (typeof designOptionsData !== 'undefined' && designOptionsData.hasOwnProperty('used') && designOptionsData.used)
        // update element data
        this.elements[ id ] = {
          tags: tags,
          useDesignOptions: useDO
        }
        // get columns data
        let columnSizes = this.getColumnSizesByElement(element)
        if (columnSizes) {
          this.elements[ id ][ 'columnSizes' ] = columnSizes
        }
        // get mixins data
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
   * Get column sizes
   * @param element
   */
  getColumnSizesByElement (element) {
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

  /**
   * Get css mixins data by element
   * @param elData
   * @param mixins
   * @returns {{}}
   */
  getCssMixinsByElement (elData, mixins = {}) {
    let element = this.cook().get(elData)
    let settings = element.get('settings')
    let foundMixins = {}
    for (let key in settings) {
      // If found element then get actual data form element
      if (settings[ key ].type === 'element') {
        mixins = this.getCssMixinsByElement(element.data[ key ], mixins)
      } else {
        if (settings[ key ].hasOwnProperty('options') && settings[ key ].options.hasOwnProperty('cssMixin')) {
          let mixin = settings[ key ].options.cssMixin
          let cssSettings = element.get('cssSettings')
          if (!foundMixins[ mixin.mixin ]) {
            foundMixins[ mixin.mixin ] = {
              variables: {},
              src: cssSettings.mixins[ mixin.mixin ].mixin
            }
          }
          foundMixins[ mixin.mixin ].variables[ mixin.property ] = { value: element.data[ key ] }
          if (mixin.namePattern) {
            foundMixins[ mixin.mixin ].variables[ mixin.property ].namePattern = mixin.namePattern
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
   * Get all used elements tags
   * @returns {{}}
   */
  getTags () {
    let tags = {}
    for (let id in this.elements) {
      let elementTags = this.elements[ id ].tags
      lodash.merge(tags, elementTags)
    }
    return tags
  },

  /**
   * Get all used element tags as array
   * @returns {Array}
   */
  getTagsList () {
    return Object.keys(this.getTags())
  },

  /**
   * get design options
   * @returns {{}}
   */
  getDesignOptions () {
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
   * Get css data for mixins
   * @returns {Array}
   */
  getCssMixins () {
    let mixinsData = {}
    for (let id in this.elements) {
      let elementMixins = this.elements[ id ].cssMixins
      if (elementMixins) {
        lodash.merge(mixinsData, elementMixins)
      }
    }

    let styles = []
    Object.keys(mixinsData).forEach((tag) => {
      let elementObject = this.cook().get({ tag: tag })
      let cssSettings = elementObject.get('cssSettings')
      let mixins = Object.keys(mixinsData[ tag ])

      mixins.forEach((mixin) => {
        for (let selector in mixinsData[ tag ][ mixin ]) {
          if (cssSettings.mixins[ mixin ]) {
            styles.push({
              variables: mixinsData[ tag ][ mixin ][ selector ],
              src: cssSettings.mixins[ mixin ].mixin
            })
          }
        }
      })
    })
    return styles
  },

  /**
   * Get css data for elements
   * @returns {Array}
   */
  getCssElements () {
    let styles = []
    this.getTagsList().forEach((tag) => {
      let elementObject = this.cook().get({ tag: tag })
      let cssSettings = elementObject.get('cssSettings')
      if (cssSettings.css) {
        styles.push({
          src: cssSettings.css
        })
      }
    })
    return styles
  },

  /**
   * Get compiled design options css
   * @returns {Array}
   */
  getCssDesignOptions () {
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
      if (designOptions.getCss(id, designOptionsData[ id ])) {
        outputCss.push({
          src: designOptions.getCss(id, designOptionsData[ id ])
        })
      }
    }

    return outputCss
  },

  /**
   * get compiled columns
   * @returns {Array}
   */
  getCssColumns () {
    let devices = rowColumn.getDevices()
    let viewPortBreakpoints = {}
    for (let device in devices) {
      viewPortBreakpoints[ '--' + device ] = '(min-width: ' + devices[ device ].min + ')'
    }
    let outputCss = []
    let columnCssData = rowColumn.getCss(rowColumn.getColumnsByElements(this.get()))
    if (columnCssData) {
      outputCss.push({
        viewports: viewPortBreakpoints,
        src: columnCssData
      })
    }

    return outputCss
  }
})
