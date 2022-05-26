const ButtonsRegister = function (editor) {
  const createLineHeightListBoxChangeHandler = function (editor, items) {
    return function () {
      const self = this // eslint-disable-line
      editor.on('nodeChange', (e) => {
        const formatName = 'lineheight'
        const formatter = editor.formatter
        let value = null
        e.parents.forEach((node) => {
          items.forEach((item) => {
            if (formatter.matchNode(node, formatName, { value: item.value })) {
              value = item.value
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

  const items = []
  const defaultLineHeightFormats = 'Default 0.5 0.75 1 1.25 1.5 1.75 2 2.25 2.5 3'
  defaultLineHeightFormats.split(' ').forEach(function (item) {
    let text = item
    let value = item === 'Default' ? 'inherit' : item
    // Allow text=value for line-height formats
    const values = item.split('=')
    if (values.length > 1) {
      text = values[0]
      value = values[1]
    }
    items.push({ text: text, value: value })
  })

  editor.addButton('lineHeight', {
    type: 'listbox',
    text: 'Line Height',
    tooltip: 'Line Height',
    fixedWidth: true,
    values: items,
    onPostRender: createLineHeightListBoxChangeHandler(editor, items),
    onselect: (e) => {
      const { value } = e.control.settings
      if (value) {
        editor.formatter.apply('lineheight', { value: value })
        editor.fire('change')
      }
    }
  })
}

export default ButtonsRegister
