/* global wp */
import { getStorage, getService } from 'vc-cake'

const utils = getService('utils')
const cook = getService('cook')
const elementsStorage = getStorage('elements')

const parse = (multipleShortcodesRegex, content, parent = false) => {
  const localShortcodesRegex = new RegExp(multipleShortcodesRegex.source)
  const globalMatches = content.match(multipleShortcodesRegex)
  globalMatches.forEach((line) => {
    const innerContent = line.match(localShortcodesRegex)
    if (innerContent && innerContent[ 2 ] === 'vc_row') {
      const row = cook.get({ tag: 'row' })
      elementsStorage.trigger('add', row.toJS(), false, { addColumn: false })
      if (innerContent[ 5 ]) {
        parse(multipleShortcodesRegex, innerContent[ 5 ], row.get('id'))
      }
    } else if (innerContent[ 2 ] === 'vc_column') {
      const attr = wp.shortcode.attrs(innerContent[ 3 ]).named
      const column = cook.get({ tag: 'column', parent: parent, size: attr.width || 'auto' })
      elementsStorage.trigger('add', column.toJS(), false)
      if (innerContent[ 5 ]) {
        parse(multipleShortcodesRegex, innerContent[ 5 ], column.get('id'))
      }
    } else if (innerContent[ 2 ] === 'vc_column_text') {
      const textElement = cook.get({ tag: 'textBlock', output: utils.wpAutoP(innerContent[ 5 ], '__VCVID__') })
      elementsStorage.trigger('add', textElement.toJS())
    } else {
      const shortcode = cook.get({ tag: 'shortcode', parent: parent, shortcode: line })
      elementsStorage.trigger('add', shortcode.toJS(), false)
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
