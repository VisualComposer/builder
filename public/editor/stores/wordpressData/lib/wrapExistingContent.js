/* global wp */
import { getStorage, getService } from 'vc-cake'
import {parseRowAttributes} from './parseAttributes'

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
    if (innerContent && shortcodeTag === 'vc_row') {
      const attr = wp.shortcode.attrs(innerContent[ 3 ]).named
      const rowAttributes = parseRowAttributes(attr)
      const rowElement = cook.get(rowAttributes)
      elementsStorage.trigger('add', rowElement.toJS(), false, { addColumn: false })
      if (subInnerContent) {
        parse(multipleShortcodesRegex, subInnerContent, rowElement.get('id'))
      }
    } else if (shortcodeTag === 'vc_column') {
      const attr = wp.shortcode.attrs(innerContent[ 3 ]).named
      const columnElement = cook.get({ tag: 'column', parent: parent, size: attr.width || 'auto' })
      elementsStorage.trigger('add', columnElement.toJS(), false)
      if (subInnerContent) {
        parse(multipleShortcodesRegex, subInnerContent, columnElement.get('id'))
      }
    } else if (shortcodeTag === 'vc_column_text') {
      const textElement = cook.get({ tag: 'textBlock', output: utils.wpAutoP(subInnerContent, '__VCVID__') })
      elementsStorage.trigger('add', textElement.toJS())
    } else {
      const shortcodeElement = cook.get({ tag: 'shortcode', parent: parent, shortcode: line })
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
