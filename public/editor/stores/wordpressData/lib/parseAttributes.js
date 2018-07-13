export const parseRowAttributes = (attrs) => {
  const data = { tag: 'row', rowWidth: 'boxed' }
  console.log(attrs)
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
