var ButtonsRegister = function (editor, window) {
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

  const getFontVariant = function (variant) {
    const number = variant.match(/\d+/g)
    const word = variant.match(/[a-z]+$/i)
    const fontWeight = number ? number[0] : '400'
    const fontStyle = word && word[0] === 'italic' ? 'italic' : 'regular'

    return { weight: fontWeight, style: fontStyle }
  }

  const parseFontVariant = function (variant) {
    const fontVariant = getFontVariant(variant)
    const fontWeightDefinition = fontWeightDefinitions[fontVariant.weight]
    const fontStyle = fontVariant.style === 'italic' ? ' Italic' : ' Regular'

    return `${fontWeightDefinition} (${fontVariant.weight})` + fontStyle
  }

  const getFontWeightValues = function (fontFamilyData, editor) {
    let activeFont = fontFamilyData
    if (!activeFont) {
      const { controlManager } = editor
      const googleFontState = controlManager && controlManager.buttons && controlManager.buttons.VcvFontsSelect && controlManager.buttons.VcvFontsSelect.state
      activeFont = googleFontState && googleFontState.data && googleFontState.data.value
    }
    let options = []
    const defaultOption = {
      text: 'Default',
      value: JSON.stringify({
        weight: 'inherit',
        style: 'inherit'
      }),
      textStyle: 'font-weight:inherit'
    }

    if (activeFont && !activeFont.defaultFont) { // Google fonts
      activeFont.variants.forEach((item) => {
        const fontStyle = getFontVariant(item)

        options.push({
          text: parseFontVariant(item),
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
          textStyle: 'font-weight:normal'
        },
        {
          text: 'Bold (700) Regular',
          value: JSON.stringify({
            weight: '700',
            style: 'regular'
          }),
          textStyle: 'font-weight:bold'
        }
      ]
    }

    options = [defaultOption, ...options]

    return options
  }

  const setFontWeightValues = function (fontFamilyData, editor, values, activeValue, activeText) {
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

  const getSelectionStart = function (editor) {
    const rng = editor.selection.getRng && editor.selection.getRng()
    const node = rng && rng.startContainer

    return node ? (node.nodeType === 3 ? node.parentNode : node) : null
  }

  const createFontWeightListBoxChangeHandler = function (editor, items, callback) {
    const getFontWeight = () => {
      const node = getSelectionStart(editor)
      if (node) {
        const isDefault = node.style.fontWeight === 'inherit'
        const styles = window.getComputedStyle(node)
        const { fontWeight, fontStyle } = styles

        return { weight: isDefault ? 'inherit' : fontWeight, style: isDefault ? 'inherit' : fontStyle }
      }

      return ''
    }

    const findMatchingValue = (fontWeight, items) => {
      const fontStyle = fontWeight.style === 'normal' ? 'regular' : fontWeight.style
      const match = {}
      items.forEach((item) => {
        const itemValue = JSON.parse(item.value)
        if (itemValue && (itemValue.style === fontStyle) && (itemValue.weight === fontWeight.weight)) {
          match.value = item.value
          match.text = item.text
        }
      })

      return match
    }

    return function () {
      const self = this
      self.state.set('value', null)
      editor.on('init nodeChange', function (e) {
        const items = getFontWeightValues(null, editor)
        const fontWeight = getFontWeight()
        const match = findMatchingValue(fontWeight, items)
        setFontWeightValues(null, editor, items, match.value, match.text)
      })
    }
  }

  const items = getFontWeightValues(null, editor)
  editor.addButton('fontWeight', {
    type: 'listbox',
    text: 'Font Weight',
    tooltip: 'Font Weight',
    icon: false,
    fixedWidth: true,
    onselect: (e) => {
      const { value } = e.control.settings
      if (value) {
        const parsedValue = JSON.parse(value)
        editor.formatter.toggle('fontweight', { value: parsedValue.weight })
        editor.formatter.toggle('fontstyle', { value: parsedValue.style === 'regular' ? 'normal' : parsedValue.style })
        const { controlManager } = editor
        if (controlManager && controlManager.buttons && controlManager.buttons.fontWeight) {
          controlManager.buttons.fontWeight.classes.remove('active')
        }
        editor.nodeChanged()
        editor.fire('change')
      }
    },
    values: items,
    onPostRender: createFontWeightListBoxChangeHandler(editor)
  })
}

export default ButtonsRegister
