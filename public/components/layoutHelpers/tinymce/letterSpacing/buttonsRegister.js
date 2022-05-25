const ButtonsRegister = function (editor) {
  const getLetterSpacingItems = function () {
    const fontSizeFormats = 'Default 1px 2px 3px 4px 5px 6px 7px 8px 9px 10px 15px 25px 30px 35px'
    return fontSizeFormats.split(' ').map((item) => {
      let text = item
      let value = item === 'Default' ? 'inherit' : item
      const values = item.split('=')
      if (values.length > 1) {
        text = values[0]
        value = values[1]
      }
      return {
        text: text,
        value: value
      }
    })
  }

  const createLetterSpacingListBoxChangeHandler = function (editor, items) {
    return function () {
      const self = this // eslint-disable-line
      editor.on('nodeChange', (e) => {
        const formatName = 'letterspacing'
        const formatter = editor.formatter
        let value = null
        e.parents.forEach((node) => {
          items.forEach((item) => {
            if (formatName) {
              if (formatter.matchNode(node, formatName, { value: item.value })) {
                value = item.value
              }
            } else {
              if (formatter.matchNode(node, item.value)) {
                value = item.value
              }
            }
            if (value) {
              return false
            }
          })
          if (value) {
            return false
          }
        })
        self.value(value)
      })
    }
  }

  const items = getLetterSpacingItems()
  editor.addButton('letterSpacing', {
    type: 'listbox',
    text: 'Letter Spacing',
    tooltip: 'Letter Spacing',
    fixedWidth: true,
    values: items,
    onPostRender: createLetterSpacingListBoxChangeHandler(editor, items),
    onselect: (e) => {
      const { value } = e.control.settings
      if (value) {
        editor.formatter.apply('letterspacing', { value: value })
        editor.fire('change')
      }
    }
  })
}

export default ButtonsRegister
