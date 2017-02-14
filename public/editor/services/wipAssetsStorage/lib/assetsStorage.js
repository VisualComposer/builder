import vcCake from 'vc-cake'
import lodash from 'lodash'
import CustomCss from './customCss'
import GlobalCss from './globalCss'
import rowColumn from './rowColumn'

const customCss = new CustomCss()
const globalCss = new GlobalCss()
const documentService = vcCake.getService('document')

export default {
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
    this.elements = lodash.defaultsDeep({}, elements)
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
   * Reset ids for storages
   * @param ids
   */
  reset (ids) {
    ids.forEach(() => {
      this.add(ids)
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
        let element = documentService.get(id)
        let tags = this.getElementTagsByTagName(element.tag, {}, element)

        // update element data
        this.elements[ id ] = {
          tags: tags
        }
        // get columns data
        let columnSizes = this.getColumnSizesByElement(element)
        if (columnSizes) {
          this.elements[ id ][ 'columnSizes' ] = columnSizes
        }
        if (vcCake.env('FEATURE_CUSTOM_ROW_LAYOUT')) {
          let columnGap = this.getRowGapByElement(element)
          if (columnGap) {
            this.elements[ id ][ 'columnGap' ] = columnGap
          }
          let rowLayout = this.getRowLayoutByElement(element)
          if (rowLayout) {
            this.elements[ id ][ 'rowLayout' ] = rowLayout
          }
        }
        // get mixins data
        let cssMixins = this.getCssMixinsByElement(element, {})
        if (Object.keys(cssMixins).length) {
          this.elements[ id ][ 'cssMixins' ] = cssMixins
        }
        // get attributes mixins data
        let attributesMixins = this.getAttributesMixinsByElement(element, {})
        if (Object.keys(attributesMixins).length) {
          this.elements[ id ][ 'attributesMixins' ] = attributesMixins
        }
        // get google fonts data
        let googleFonts = this.getGoogleFontsByElement(element, {})
        if (Object.keys(googleFonts).length) {
          this.elements[ id ][ 'googleFonts' ] = googleFonts
        }
      }
    })

    if (vcCake.env('FEATURE_CUSTOM_ROW_LAYOUT')) {
      for (let elementId in this.elements) {
        if (this.get(elementId) || force) {
          let documentService = vcCake.getService('document')
          let element = documentService.get(elementId)
          if (element) {
            let backgroundData = this.getBackgroundByElement(element)
            if (backgroundData && backgroundData.id && backgroundData.background && this.elements[ backgroundData.id ]) {
              this.elements[ backgroundData.id ][ 'background' ] = backgroundData.background
            }
          }
        }
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

  getRowLayoutByElement (element) {
    let settings = this.cook().get(element).get('settings')
    let value = settings.relatedTo ? settings.relatedTo.value : []
    let isRow = value.filter((item) => {
      return item.toLowerCase() === 'general'
    })

    // console.log(settings)

    let layout = null
    if (isRow.length && element.rowLayout) {
      layout = element.rowLayout
    }
    return layout
  },

  getRowGapByElement (element) {
    let settings = this.cook().get(element).get('settings')
    let value = settings.relatedTo ? settings.relatedTo.value : []
    let isRow = value.filter((item) => {
      return item.toLowerCase() === 'general'
    })

    let gap = null
    if (isRow.length && element.columnGap) {
      gap = element.columnGap
    }
    return gap
  },

  getBackgroundByElement (element) {
    let cookElement = this.cook().get(element)
    let settings = cookElement.get('settings')
    let value = settings.relatedTo ? settings.relatedTo.value : []
    let data = {}
    let isColumn = value.filter((item) => {
      return item.toLowerCase() === 'column'
    })
    let isRow = value.filter((item) => {
      return item.toLowerCase() === 'rootelements'
    })
    if (isColumn.length) {
      data.id = element.parent
    }
    if (isRow.length) {
      data.id = element.id
    }
    if (data.id && documentService.get(data.id)) {
      data.background = documentService.get(data.id).background
    }
    return data
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
          let mixinValue = settings[ key ].value
          if (typeof element.data[ key ] === `string`) {
            mixinValue = element.data[ key ]
          }
          foundMixins[ mixin.mixin ].variables[ mixin.property ] = { value: mixinValue }
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
        if (name !== 'empty' && foundMixins[ mixin ].variables[ variable ].namePattern) {
          name = name.match(new RegExp(foundMixins[ mixin ].variables[ variable ].namePattern, 'gi'))
          name = name.length ? name.join('-') : 'empty'
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
   * Get attributes mixins data by element
   * @param elData
   * @returns {{}}
   */
  getAttributesMixinsByElement (elData) {
    let mixins = {}
    let element = this.cook().get(elData)
    let settings = element.get('settings')
    let foundMixins = {}
    for (let key in settings) {
      // get css mixin from attribute
      if (element.data[ key ] && element.data[ key ].attributeMixins) {
        Object.keys(element.data[ key ].attributeMixins).forEach((mixinName) => {
          foundMixins[ `${key}:${mixinName}` ] = lodash.defaultsDeep({}, element.data[ key ].attributeMixins[ mixinName ])
        })
      }
    }

    for (let mixin in foundMixins) {
      let variables = {}
      let useMixin = false
      // get variables
      Object.keys(foundMixins[ mixin ].variables).sort().forEach((variable) => {
        variables[ variable ] = foundMixins[ mixin ].variables[ variable ].value || false
        // if any variable is set we can use mixin
        if (variables[ variable ]) {
          useMixin = true
        }
      })
      if (useMixin) {
        if (!mixins[ element.data.tag ]) {
          mixins[ element.data.tag ] = {}
        }
        if (!mixins[ element.data.tag ][ mixin ]) {
          mixins[ element.data.tag ][ mixin ] = {}
        }
        if (!variables[ 'selector' ]) {
          variables[ 'selector' ] = `el-${element.data.id}`
        }
        mixins[ element.data.tag ][ mixin ].src = foundMixins[ mixin ].src
        mixins[ element.data.tag ][ mixin ].variables = variables
      }
    }
    return mixins
  },

  /**
   * Get googles fonts data by element
   * @param elData
   * @param fonts
   * @returns {{}}
   */
  getGoogleFontsByElement (elData, foundFonts = {}) {
    let element = this.cook().get(elData)
    let settings = element.get('settings')
    for (let key in settings) {
      // If found element then get actual data form element
      if (settings[ key ].type === 'element') {
        foundFonts = this.getGoogleFontsByElement(element.data[ key ], foundFonts)
      } else {
        if (settings[ key ].type === 'googleFonts') {
          let font = element.get(key)
          if (font) {
            let fontHref = ''

            if (font.fontStyle) {
              fontHref = `https://fonts.googleapis.com/css?family=${font.fontFamily}:${font.fontStyle.weight + font.fontStyle.style}`
            } else {
              fontHref = `https://fonts.googleapis.com/css?family=${font.fontFamily}`
            }
            if (!foundFonts[ fontHref ]) {
              foundFonts[ fontHref ] = fontHref
            }
          }
        }
      }
    }

    return foundFonts
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

  // get data

  getCustomCssData () {
    let styles = []
    if (this.getCustomCss()) {
      styles.push({
        src: this.getCustomCss()
      })
    }
    return styles
  },

  getGlobalCssData () {
    let styles = []
    if (this.getGlobalCss()) {
      styles.push({
        src: this.getGlobalCss()
      })
    }
    return styles
  },

  /**
   * Get css data for mixins
   * @returns {Array}
   */
  getMixinsCssData () {
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
          if (cssSettings.mixins && cssSettings.mixins[ mixin ]) {
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
   * Get css data for mixins
   * @returns {Array}
   */
  getAttributesMixinsCssData () {
    let styles = []
    for (let id in this.elements) {
      let attributeMixins = this.elements[ id ].attributesMixins
      if (attributeMixins) {
        Object.keys(attributeMixins).forEach((tag) => {
          Object.keys(attributeMixins[ tag ]).forEach((attribute) => {
            styles.push(attributeMixins[ tag ][ attribute ])
          })
        })
      }
    }
    return styles
  },

  /**
   * Get css data for mixins
   * @returns {Array}
   */
  getGoogleFontsData () {
    let fonts = {}
    for (let id in this.elements) {
      let googleFonts = this.elements[ id ].googleFonts
      if (googleFonts) {
        lodash.merge(fonts, googleFonts)
      }
    }

    return fonts
  },

  /**
   * Get css data for elements
   * @returns {Array}
   */
  getElementsCssData (editor = false) {
    let styles = []
    this.getTagsList().forEach((tag) => {
      let elementObject = this.cook().get({ tag: tag })
      let cssSettings = elementObject.get('cssSettings')
      if (cssSettings.css) {
        styles.push({
          src: cssSettings.css
        })
      }
      if (editor && cssSettings.editorCss) {
        styles.push({
          src: cssSettings.editorCss
        })
      }
    })
    return styles
  },

  /**
   * get compiled columns
   * @returns {Array}
   */
  getColumnsCssData () {
    let devices = rowColumn.getDevices()
    let viewPortBreakpoints = {}
    for (let device in devices) {
      if (vcCake.env('FEATURE_CUSTOM_ROW_LAYOUT')) {
        let sizes = []
        if (devices[ device ].min) {
          sizes.push('(min-width: ' + devices[ device ].min + ')')
        }
        if (devices[ device ].max) {
          sizes.push('(max-width: ' + devices[ device ].max + ')')
        }
        viewPortBreakpoints[ '--' + device ] = sizes.join(' and ')
      } else {
        viewPortBreakpoints[ '--' + device ] = '(min-width: ' + devices[ device ].min + ')'
      }
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
}

