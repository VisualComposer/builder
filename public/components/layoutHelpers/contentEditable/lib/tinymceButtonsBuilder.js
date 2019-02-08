import fonts from 'public/sources/attributes/googleFonts/lib/google-fonts-set.json'
import webFontLoader from 'webfontloader'

const googleFonts = fonts.families
const fontWeightDefinitions = {
  100: 'Thin',
  200: 'Extra Light',
  300: 'Light',
  400: 'Normal',
  500: 'Medium',
  600: 'Semi Bold',
  700: 'Bold',
  800: 'Extra Bold',
  900: 'Black'
}

export default class TinymceButtonsBuilder {
  static getFontVariant (variant) {
    let number = variant.match(/\d+/g)
    let word = variant.match(/[a-z]+$/i)
    let fontWeight = number ? number[ 0 ] : '400'
    let fontStyle = word && word[ 0 ] === 'italic' ? 'italic' : 'regular'
    return { weight: fontWeight, style: fontStyle }
  }

  static parseFontVariant (variant) {
    let fontVariant = TinymceButtonsBuilder.getFontVariant(variant)
    let fontWeightDefinition = fontWeightDefinitions[ fontVariant.weight ]
    let fontStyle = fontVariant.style === 'italic' ? ' Italic' : ' Regular'
    return `${fontWeightDefinition} (${fontVariant.weight})` + fontStyle
  }

  static getFontWeightValues (fontFamilyData, editor) {
    let activeFont = fontFamilyData
    if (!activeFont) {
      const { controlManager } = editor
      const googleFontState = controlManager && controlManager.buttons && controlManager.buttons.googleFonts && controlManager.buttons.googleFonts.state
      activeFont = googleFontState && googleFontState.data && googleFontState.data.value
    }
    let options = []

    if (activeFont && !activeFont.defaultFont) { // Google fonts
      activeFont.variants.forEach((item) => {
        let fontStyle = TinymceButtonsBuilder.getFontVariant(item)

        options.push({
          text: TinymceButtonsBuilder.parseFontVariant(item),
          value: JSON.stringify(fontStyle),
          textStyle: `font-weight:${fontStyle.weight}`
        })
      })
    } else { // Default fonts
      options = [
        {
          text: 'Normal (400) Regular',
          value: JSON.stringify({
            weight: '400',
            style: 'regular'
          }),
          textStyle: `font-weight:normal`
        },
        {
          text: 'Bold (700) Regular',
          value: JSON.stringify({
            weight: '700',
            style: 'regular'
          }),
          textStyle: `font-weight:bold`
        }
      ]
    }

    return options
  }

  static setFontWeightValues (fontFamilyData, editor, values, activeValue, activeText) {
    const { controlManager } = editor
    const fontWeightButton = controlManager && controlManager.buttons && controlManager.buttons.fontWeight && controlManager.buttons.fontWeight
    if (fontWeightButton) {
      fontWeightButton._values = values
      if (activeValue) {
        fontWeightButton.state.set('value', activeValue)
        fontWeightButton.state.set('text', activeText)
      }
      fontWeightButton.state.set('menu', values)
    }
  }

  static getSelectionStart (editor) {
    const rng = editor.selection.getRng && editor.selection.getRng()
    const node = rng && rng.startContainer
    return node ? (node.nodeType === 3 ? node.parentNode : node) : null
  }

  static createFormats (formats) {
    formats = formats.replace(/;$/, '').split(';')
    let i = formats.length
    while (i--) {
      formats[ i ] = formats[ i ].split('=')
    }
    return formats
  }

  constructor (editor, iframe) {
    Object.defineProperties(this, {
      editor: {
        configurable: false,
        enumerable: false,
        value: editor,
        writable: true
      },
      iframe: {
        configurable: false,
        enumerable: false,
        value: iframe,
        writable: true
      },
      global$2: {
        configurable: false,
        enumerable: false,
        value: iframe.contentWindow.tinymce && iframe.contentWindow.tinymce.util.Tools.resolve('tinymce.util.Tools'),
        writable: true
      }
    })
  }

  addButton (name, buttonSettings) {
    if (name === 'googleFonts') {
      this.addGoogleFontsDropdown(name, buttonSettings)
    } else if (name === 'fontWeight') {
      this.addFontWeightDropdown(name, buttonSettings)
    } else {
      this.editor.addButton(name, buttonSettings)
    }
  }

  addGoogleFontsDropdown (name, buttonSettings) {
    let googleFontItems = this.getFontValues()
    this.editor.addButton(name, {
      ...buttonSettings,
      onselect: (e) => {
        const { value } = e.control.settings
        if (value) {
          this.editor.execCommand('FontName', false, value.family)
          this.loadFonts(value)
        }
        buttonSettings.onselect && buttonSettings.onselect(value)
      },
      values: googleFontItems,
      onPostRender: this.createFontNameListBoxChangeHandler(this.editor, googleFontItems, buttonSettings.onPostRender)
    })
  }

  addFontWeightDropdown (name, buttonSettings) {
    let items = TinymceButtonsBuilder.getFontWeightValues(null, this.editor)
    this.editor.addButton(name, {
      ...buttonSettings,
      onselect: (e) => {
        const { value } = e.control.settings
        if (value) {
          let parsedValue = JSON.parse(value)
          this.editor.formatter.toggle('fontweight', { value: parsedValue.weight })
          this.editor.formatter.toggle('fontstyle', { value: parsedValue.style === 'regular' ? 'normal' : parsedValue.style })
          const { controlManager } = this.editor
          if (controlManager && controlManager.buttons && controlManager.buttons.fontWeight) {
            controlManager.buttons.fontWeight.classes.remove('active')
          }
          this.editor.nodeChanged()
        }
        buttonSettings.onselect && buttonSettings.onselect(value)
      },
      values: items,
      onPostRender: this.createFontWeightListBoxChangeHandler(this.editor, buttonSettings.onPostRender)
    })
  }

  createFontWeightListBoxChangeHandler (editor, items, callback) {
    const getFontWeight = () => {
      const node = TinymceButtonsBuilder.getSelectionStart(editor)
      if (node) {
        const styles = window.getComputedStyle(node)
        const { fontWeight, fontStyle } = styles
        return { weight: fontWeight, style: fontStyle }
      }
      return ''
    }

    const findMatchingValue = (fontWeight, items) => {
      const fontStyle = fontWeight.style === 'normal' ? 'regular' : fontWeight.style
      let match = {}
      this.global$2.each(items, (item) => {
        let itemValue = JSON.parse(item.value)
        if (itemValue && (itemValue.style === fontStyle) && (itemValue.weight === fontWeight.weight)) {
          match.value = item.value
          match.text = item.text
        }
      })
      return match
    }

    return function () {
      let self = this
      self.state.set('value', null)
      editor.on('init nodeChange', function (e) {
        let items = TinymceButtonsBuilder.getFontWeightValues(null, editor)
        let fontWeight = getFontWeight()
        let match = findMatchingValue(fontWeight, items)
        TinymceButtonsBuilder.setFontWeightValues(null, editor, items, match.value, match.text)
      })
      callback && callback()
    }
  }

  getGoogleFontValues () {
    let values = []
    googleFonts.forEach((item) => {
      values.push({
        text: item.family,
        value: {
          family: item.family,
          defaultFont: false,
          variants: item.variants,
          subsets: item.subsets
        },
        textStyle: `font-family:${item.family}`
      })
    })

    return values
  }

  getFontValues () {
    return [ ...this.getFontItems(), { text: '-' }, ...this.getGoogleFontValues() ]
  }

  getFontItems () {
    let defaultFontsFormats = 'Andale Mono=andale mono,monospace;' + 'Arial=arial,helvetica,sans-serif;' + 'Arial Black=arial black,sans-serif;' + 'Book Antiqua=book antiqua,palatino,serif;' + 'Comic Sans MS=comic sans ms,sans-serif;' + 'Courier New=courier new,courier,monospace;' + 'Georgia=georgia,palatino,serif;' + 'Helvetica=helvetica,arial,sans-serif;' + 'Impact=impact,sans-serif;' + 'Symbol=symbol;' + 'Tahoma=tahoma,arial,helvetica,sans-serif;' + 'Terminal=terminal,monaco,monospace;' + 'Times New Roman=times new roman,times,serif;' + 'Trebuchet MS=trebuchet ms,geneva,sans-serif;' + 'Verdana=verdana,geneva,sans-serif;' + 'Webdings=webdings;' + 'Wingdings=wingdings,zapf dingbats'
    let fonts = TinymceButtonsBuilder.createFormats(this.editor.settings.font_formats || defaultFontsFormats)
    return this.global$2.map(fonts, (font) => {
      return {
        text: { raw: font[ 0 ] },
        value: {
          family: font[ 1 ],
          defaultFont: true
        },
        textStyle: font[ 1 ].indexOf('dings') === -1 ? 'font-family:' + font[ 1 ] : ''
      }
    })
  }

  createFontNameListBoxChangeHandler (editor, items, callback) {
    const findMatchingValue = (items, fontFamily) => {
      let font = fontFamily ? fontFamily.toLowerCase() : ''
      let value
      this.global$2.each(items, (item) => {
        if (item.value && item.value.family.toLowerCase() === font) {
          value = item.value
        }
      })
      this.global$2.each(items, (item) => {
        if (!value && item.value && getFirstFont(item.value.family).toLowerCase() === getFirstFont(font).toLowerCase()) {
          value = item.value
        }
      })
      return value
    }

    const getFirstFont = (fontFamily) => {
      return fontFamily ? fontFamily.split(',')[ 0 ] : ''
    }

    return function () {
      let self = this
      self.state.set('value', null)
      editor.on('init nodeChange', function (e) {
        let fontFamily = editor.queryCommandValue('FontName')
        let match = findMatchingValue(items, fontFamily)
        self.value(match || null)
        if (!match && fontFamily) {
          self.text(getFirstFont(fontFamily))
        }
      })
      callback && callback()
    }
  }

  loadFonts (fontData) {
    const { family, defaultFont } = fontData
    if (defaultFont) { // do not load default fonts
      return
    }
    let iframeSettings = {}
    this.iframe && this.iframe.contentWindow && (iframeSettings.context = this.iframe.contentWindow)
    webFontLoader.load({
      google: {
        families: [ `${family}` ]
      },
      ...iframeSettings
    })
  }

  getFontVariant (fontStyle, fontWeight, position) {
    const availableVariants = googleFonts[ position ].variants
    if (availableVariants && availableVariants.length === 1 && availableVariants[ 0 ] === 'regular') {
      return 'all'
    }
    let variant = ''
    if (fontStyle === 'normal' && fontWeight === '400') {
      variant = 'regular'
    } else if (fontStyle === 'italic' && fontWeight === '400') {
      variant = 'italic'
    } else if (fontStyle === 'italic') {
      variant = `${fontWeight}${fontStyle}`
    } else {
      variant = fontWeight
    }
    const isAvailable = availableVariants.indexOf(variant) > -1
    if (isAvailable) {
      return variant
    } else {
      return 'all'
    }
  }

  getUsedFonts (element) {
    let allFonts = {}
    for (let node of element.querySelectorAll('*')) {
      const computedStyles = window.getComputedStyle(node)
      let fontFamily = computedStyles.fontFamily

      // Remove the surrounding quotes around elements
      fontFamily = fontFamily.replace(/^\s*['"]([^'"]*)['"]\s*$/, '$1').trim()

      const familyPositionInFonts = googleFonts.map((item) => { return item.family.toLowerCase() }).indexOf(fontFamily.toLowerCase())

      if (familyPositionInFonts > -1) {
        const fontStyle = computedStyles.fontStyle
        const fontWeight = computedStyles.fontWeight
        const fontVariant = this.getFontVariant(fontStyle, fontWeight, familyPositionInFonts)

        if (allFonts.hasOwnProperty(fontFamily)) {
          if (allFonts[ fontFamily ].variants.indexOf('all') < 0 && allFonts[ fontFamily ].variants.indexOf(fontVariant) < 0) {
            allFonts[ fontFamily ].variants.push(fontVariant)
          }
        } else {
          allFonts[ fontFamily ] = {
            variants: [ fontVariant ],
            subsets: googleFonts[ familyPositionInFonts ].subsets
          }
        }
      }
    }

    Object.keys(allFonts).forEach((key) => {
      if (allFonts[ key ].variants.indexOf('all') > -1) {
        delete allFonts[ key ].variants
      }
    })

    return allFonts
  }
}
