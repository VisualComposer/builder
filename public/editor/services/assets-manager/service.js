import vcCake from 'vc-cake'
import postcss from 'postcss'

vcCake.addService('assets-manager', {
  /**
   * Up-to-date list of all elements
   *
   * @param {Object}
   */
  elements: {},

  /**
   * @param elements
   */
  set: function (elements) {
    // todo: validate elements
    this.elements = elements
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
        let designOptions = cook.get(element).get('designOptions')
        let useDO = false
        if (typeof designOptions !== 'undefined' && designOptions.hasOwnProperty('used') && designOptions.used) {
          useDO = true
        }
        this.elements[ id ] = {
          tag: element.tag,
          useDesignOptions: useDO
        }
      }
    })
  },

  get: function (assetKey = false) {
    if (!assetKey) {
      return this.elements
    }
    if (typeof this.elements[ assetKey ] === 'undefined') {
      return null
    }
    return this.elements[ assetKey ]
  },

  update: function (id) {
    if (this.get(id)) {
      let cook = vcCake.getService('cook')
      let documentService = vcCake.getService('document')
      let element = documentService.get(id)
      let designOptions = cook.get(element).get('designOptions')
      let useDO = (typeof designOptions !== 'undefined' && designOptions.hasOwnProperty('used') && designOptions.used)
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
        let cssSettings = cook.get(element).get('cssSettings')
        styles[ elements[ id ].tag ] = {
          count: 1,
          css: cssSettings.css
        }
      }
    }

    return styles
  },

  getDesignOptions () {
    let cook = vcCake.getService('cook')
    let documentService = vcCake.getService('document')
    let returnOptions = {}
    let elements = this.get()
    for (let id in elements) {
      if (elements[ id ].useDesignOptions) {
        let element = documentService.get(id)
        let designOptions = cook.get(element).get('designOptions')
        if (typeof designOptions !== 'undefined' && designOptions.hasOwnProperty('used') && designOptions.used) {
          returnOptions[ id ] = designOptions
        }
      }
    }

    return returnOptions
  },

  /**
   * @returns {string}
   */
  getCompiledCss: function () {
    let styles = this.getStyles()
    var iterations = []
    for (let tagName in styles) {
      let stylePromise = new Promise((resolve, reject) => {
        if (styles[ tagName ].css) {
          postcss().process(styles[ tagName ].css).then((result) => {
            if (result.css) {
              resolve(result.css)
            } else {
              resolve(false)
            }
          })
        }
      })
      iterations.push(stylePromise)
    }

    return Promise.all(iterations).then((output) => {
      return output.join(' ')
    })
  },

  getCompiledDesignOptions: function () {
    let designOptionsData = this.getDesignOptions()

    let outputCss = []

    for (let id in designOptionsData) {
      let cssObj = {}
      let options = designOptionsData[ id ]
      let tempProperty = null
      let tempValue = null
      console.log(options)

      if (options.deviceTypes === 'all') {
        // get background color
        if (options.all.backgroundColor !== '') {
          cssObj[ 'background-color' ] = options.all.backgroundColor
        }
        // get background images
        if (options.all.backgroundImage.urls.length) {
          tempProperty = 'background-image'
          tempValue = []
          for (let url of options.all.backgroundImage.urls) {
            tempValue.push('url(' + url + ')')
          }
          tempValue = tempValue.join(',')
        }
        if (tempProperty && tempValue) {
          cssObj[ tempProperty ] = tempValue
        }
        // get background style
        switch (options.all.backgroundStyle) {
          case 'cover':
            tempProperty = 'background-size'
            tempValue = 'cover'
            break
          case 'contain':
            tempProperty = 'background-size'
            tempValue = 'contain'
            break
          case 'no-repeat':
            tempProperty = 'background-repeat'
            tempValue = 'no-repeat'
            break
          case 'repeat':
            tempProperty = 'background-repeat'
            tempValue = 'repeat'
            break
          default:
            tempProperty = null
            tempValue = null
            break
        }
        if (tempProperty && tempValue) {
          cssObj[ tempProperty ] = tempValue
        }
        // get borders
        if (options.all.borderTop !== '') {
          cssObj[ 'border-top-width' ] = (parseFloat(options.all.borderTop).toString() === options.all.borderTop) ? options.all.borderTop + 'px' : options.all.borderTop
        }
        if (options.all.borderRight !== '') {
          cssObj[ 'border-right-width' ] = (parseFloat(options.all.borderRight).toString() === options.all.borderRight) ? options.all.borderRight + 'px' : options.all.borderRight
        }
        if (options.all.borderBottom !== '') {
          cssObj[ 'border-bottom-width' ] = (parseFloat(options.all.borderBottom).toString() === options.all.borderBottom) ? options.all.borderBottom + 'px' : options.all.borderBottom
        }
        if (options.all.borderLeft !== '') {
          cssObj[ 'border-left-width' ] = (parseFloat(options.all.borderLeft).toString() === options.all.borderLeft) ? options.all.borderLeft + 'px' : options.all.borderLeft
        }
        // get border color
        if (options.all.borderColor !== '') {
          cssObj[ 'border-color' ] = options.all.borderColor
        }
        // get border style
        tempProperty = 'border-style'
        switch (options.all.borderStyle) {
          case 'solid':
            tempValue = 'solid'
            break
          case 'dotted':
            tempValue = 'dotted'
            break
          case 'dashed':
            tempValue = 'dashed'
            break
          case 'none':
            tempValue = 'none'
            break
          case 'hidden':
            tempValue = 'hidden'
            break
          case 'double':
            tempValue = 'double'
            break
          case 'groove':
            tempValue = 'groove'
            break
          case 'ridge':
            tempValue = 'ridge'
            break
          case 'inset':
            tempValue = 'inset'
            break
          case 'outset':
            tempValue = 'outset'
            break
          case 'initial':
            tempValue = 'initial'
            break
          case 'inherit':
            tempValue = 'inherit'
            break
          default:
            tempProperty = null
            tempValue = null
            break
        }
        if (tempProperty && tempValue) {
          cssObj[ tempProperty ] = tempValue
        }
        // get border radius
        if (options.all.borderTopRightRadius !== '') {
          cssObj[ 'border-top-right-radius' ] = (parseFloat(options.all.borderTopRightRadius).toString() === options.all.borderTopRightRadius) ? options.all.borderTopRightRadius + 'px' : options.all.borderTopRightRadius
        }
        if (options.all.borderBottomRightRadius !== '') {
          cssObj[ 'border-bottom-right-radius' ] = (parseFloat(options.all.borderBottomRightRadius).toString() === options.all.borderBottomRightRadius) ? options.all.borderBottomRightRadius + 'px' : options.all.borderBottomRightRadius
        }
        if (options.all.borderBottomLeftRadius !== '') {
          cssObj[ 'border-bottom-left-radius' ] = (parseFloat(options.all.borderBottomLeftRadius).toString() === options.all.borderBottomLeftRadius) ? options.all.borderBottomLeftRadius + 'px' : options.all.borderBottomLeftRadius
        }
        if (options.all.borderTopLeftRadius !== '') {
          cssObj[ 'border-top-left-radius' ] = (parseFloat(options.all.borderTopLeftRadius).toString() === options.all.borderTopLeftRadius) ? options.all.borderTopLeftRadius + 'px' : options.all.borderTopLeftRadius
        }
        // get margin
        if (options.all.marginTop !== '') {
          cssObj[ 'margin-top' ] = (parseFloat(options.all.marginTop).toString() === options.all.marginTop) ? options.all.marginTop + 'px' : options.all.marginTop
        }
        if (options.all.marginRight !== '') {
          cssObj[ 'margin-right' ] = (parseFloat(options.all.marginRight).toString() === options.all.marginRight) ? options.all.marginRight + 'px' : options.all.marginRight
        }
        if (options.all.marginBottom !== '') {
          cssObj[ 'margin-bottom' ] = (parseFloat(options.all.marginBottom).toString() === options.all.marginBottom) ? options.all.marginBottom + 'px' : options.all.marginBottom
        }
        if (options.all.marginLeft !== '') {
          cssObj[ 'margin-left' ] = (parseFloat(options.all.marginLeft).toString() === options.all.marginLeft) ? options.all.marginLeft + 'px' : options.all.marginLeft
        }
        // get padding
        if (options.all.paddingTop !== '') {
          cssObj[ 'padding-top' ] = (parseFloat(options.all.paddingTop).toString() === options.all.paddingTop) ? options.all.paddingTop + 'px' : options.all.paddingTop
        }
        if (options.all.paddingRight !== '') {
          cssObj[ 'padding-right' ] = (parseFloat(options.all.paddingRight).toString() === options.all.paddingRight) ? options.all.paddingRight + 'px' : options.all.paddingRight
        }
        if (options.all.paddingBottom !== '') {
          cssObj[ 'padding-bottom' ] = (parseFloat(options.all.paddingBottom).toString() === options.all.paddingBottom) ? options.all.paddingBottom + 'px' : options.all.paddingBottom
        }
        if (options.all.paddingLeft !== '') {
          cssObj[ 'padding-left' ] = (parseFloat(options.all.paddingLeft).toString() === options.all.paddingLeft) ? options.all.paddingLeft + 'px' : options.all.paddingLeft
        }
      }

      let css = ''
      for (let prop in cssObj) {
        css += prop + ':' + cssObj[ prop ] + ';'
      }
      outputCss.push('#el-' + id + '{' + css + '}')
    }

    var iterations = []
    for (let style of outputCss) {
      let stylePromise = new Promise((resolve, reject) => {
        if (style) {
          postcss().process(style).then((result) => {
            if (result.css) {
              resolve(result.css)
            } else {
              resolve(false)
            }
          })
        }
      })
      iterations.push(stylePromise)
    }

    return Promise.all(iterations).then((output) => {
      return output.join(' ')
    })
  }
})
