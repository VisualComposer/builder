/* global wp */
import { getStorage, getService } from 'vc-cake'
import { parseRowAttributes, parseGeneralAttributes } from './parseAttributes'

const utils = getService('utils')
const cook = getService('cook')
const elementsStorage = getStorage('elements')

const parse = (multipleShortcodesRegex, content, parent = false) => {
  const localShortcodesRegex = new RegExp(multipleShortcodesRegex.source)
  const globalMatches = content.match(multipleShortcodesRegex)
  globalMatches.forEach((line) => {
    const innerContent = line.match(localShortcodesRegex)
    const shortcodeTag = innerContent[ 2 ]
    const subInnerContent = innerContent[ 5 ]
    const attr = wp.shortcode.attrs(innerContent[ 3 ]).named
    const generalElementAttributes = parseGeneralAttributes(attr)
    if (innerContent && shortcodeTag === 'vc_row') {
      const rowAttributes = Object.assign({}, generalElementAttributes, parseRowAttributes(attr))
      const rowElement = cook.get(rowAttributes)
      elementsStorage.trigger('add', rowElement.toJS(), false, { addColumn: false })
      if (subInnerContent) {
        parse(multipleShortcodesRegex, subInnerContent, rowElement.get('id'))
      }
    } else if (shortcodeTag === 'vc_column') {
      const columnAttributes = Object.assign({}, generalElementAttributes, { tag: 'column', parent: parent, size: attr.width || 'auto' })
      const columnElement = cook.get(columnAttributes)
      elementsStorage.trigger('add', columnElement.toJS(), false)
      if (subInnerContent) {
        parse(multipleShortcodesRegex, subInnerContent, columnElement.get('id'))
      }
    } else if (shortcodeTag === 'vc_column_text') {
      const textElementAttributes = Object.assign({}, generalElementAttributes, { tag: 'textBlock', output: utils.wpAutoP(subInnerContent, '__VCVID__') })
      const textElement = cook.get(textElementAttributes)
      elementsStorage.trigger('add', textElement.toJS())
    } else {
      const shortcodeElementAttributes = Object.assign({}, generalElementAttributes, { tag: 'shortcode', parent: parent, shortcode: line })
      const shortcodeElement = cook.get(shortcodeElementAttributes)
      elementsStorage.trigger('add', shortcodeElement.toJS(), false)
    }
  })
}

export default (content) => {
  if (window.hasOwnProperty('VCV_API_WPBAKERY_VC_MAP')) {
    const multipleShortcodesRegex = wp.shortcode.regexp(window.VCV_API_WPBAKERY_VC_MAP().join('|'))
    parse(multipleShortcodesRegex, content)
  } else {
    const textElement = cook.get({ tag: 'textBlock', output: utils.wpAutoP(content, '__VCVID__') })
    if (textElement) {
      elementsStorage.trigger('add', textElement.toJS())
    }
  }
}
