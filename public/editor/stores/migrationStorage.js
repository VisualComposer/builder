import { addStorage, getStorage, getService } from 'vc-cake'

addStorage('migration', (storage) => {
  const cook = getService('cook')
  const utils = getService('utils')
  const elementsStorage = getStorage('elements')

  // vc_row migration
  storage.on('migrateElement', (elementData) => {
    console.log('migrate row')
    if (elementData.tag === 'vc_row') {
      const parseRowAttributes = (attrs) => {
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

      const rowAttributes = Object.assign({}, parseRowAttributes(elementData._attrs))
      const rowElement = cook.get(rowAttributes)
      elementsStorage.trigger('add', rowElement.toJS(), false)
      if (elementData._subInnerContent) {
        elementData._parse(elementData._multipleShortcodesRegex, elementData._subInnerContent, rowElement.get('id'))
      }
      elementData._migrated = true
    }
  })

  // vc_column Migration
  storage.on('migrateElement', (elementData) => {
    console.log('migrate column')
    if (elementData.tag === 'vc_column') {
      const columnAttributes = Object.assign({}, { tag: 'column', parent: elementData._parent, size: elementData._attrs.width || 'auto' })
      const columnElement = cook.get(columnAttributes)
      elementsStorage.trigger('add', columnElement.toJS(), false)
      if (elementData._subInnerContent) {
        elementData._parse(elementData._multipleShortcodesRegex, elementData._subInnerContent, columnElement.get('id'))
      }
      elementData._migrated = true
    }
  })

  // vc_column_text Migration
  storage.on('migrateElement', (elementData) => {
    console.log('migrate text')
    if (elementData.tag === 'vc_column_text') {
      const textElementAttributes = Object.assign({}, { tag: 'textBlock', output: utils.wpAutoP(elementData._subInnerContent, '__VCVID__'), parent: elementData._parent })
      const textElement = cook.get(textElementAttributes)
      elementsStorage.trigger('add', textElement.toJS())
      elementData._migrated = true
    }
  })

  storage.on('migrateElement', (elementData) => {
    window.setTimeout(() => {
      if (!elementData._migrated) {
        // if ([ 'vc_row', 'vc_column_text', 'vc_column' ].indexOf(elementData.tag) === -1) {
        const shortcodeElementAttributes = Object.assign({}, { tag: 'shortcode', parent: elementData._parent, shortcode: elementData._shortcodeString })
        const shortcodeElement = cook.get(shortcodeElementAttributes)
        elementsStorage.trigger('add', shortcodeElement.toJS(), false)
        // }
      }
    }, 1)
  })
})
