export const parseRowAttributes = (attrs) => {
  const data = { tag: 'row', rowWidth: 'boxed' }
  attrs = Object.assign({
    full_width: '',
    full_height: ''
  }, attrs)
  if (attrs.full_width === 'stretch_row') {
    data.rowWidth = 'stretchedRow'
  } else if (attrs.full_width === 'stretch_row_content') {
    data.rowWidth = 'stretchedRowAndColumn'
  } else if (attrs.full_width === 'stretch_row_content_no_spaces') {
    data.rowWidth = 'stretchedRowAndColumn'
    data.removeSpaces = true
  }
  if (attrs.full_height) {
    data.fullHeight = true
  }
  return data
}

export const parseGeneralAttributes = (attrs) => {
  const data = {}
  if (attrs.css) {
    // design options
    let cssData = attrs.css.split(/\s*(\.[^\{]+)\s*\{\s*([^\}]+)\s*\}\s*/g)
    if (cssData && cssData[ 1 ]) {
      data.customClass = cssData[ 1 ].replace('.', '')
    }
  }
  return data
}
