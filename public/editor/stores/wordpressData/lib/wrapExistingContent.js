/* global wp */
import { getStorage, getService } from 'vc-cake'

// const utils = getService('utils')
const cook = getService('cook')
const elementsStorage = getStorage('elements')
const multipleShortcodesRegex = wp.shortcode.regexp(window.VCV_API_WPBAKERY_VC_MAP().join('|'))
const localShortcodesRegex = new RegExp(multipleShortcodesRegex.source)

const parse = (content, parent = false) => {
  const globalMatches = content.match(multipleShortcodesRegex)
  globalMatches.forEach((line) => {
    const innerContent = line.match(localShortcodesRegex)
    if (innerContent && innerContent[ 2 ] === 'vc_row') {
      const row = cook.get({ tag: 'row' })
      elementsStorage.trigger('add', row.toJS(), false, {addColumn: false})
      if (innerContent[ 5 ]) {
        parse(innerContent[ 5 ], row.get('id'))
      }
    } else if (innerContent[ 2 ] === 'vc_column') {
      const column = cook.get({ tag: 'column', parent: parent })
      elementsStorage.trigger('add', column.toJS(), false)
      if (innerContent[ 5 ]) {
        parse(innerContent[ 5 ], column.get('id'))
      }
    } else {
      const shortcode = cook.get({ tag: 'shortcode', parent: parent, shortcode: line })
      elementsStorage.trigger('add', shortcode.toJS(), false)
    }
  })
}

export default (content) => {
  parse(content)
  // let localMatches = globalMatches[0].match(localShortcodesRegex)
  // let subContent = localMatches[5]
  /*
    const textElement = cook.get({ tag: 'textBlock', output: utils.wpAutoP(content, '__VCVID__') })
    if (textElement) {
      elementsStorage.trigger('add', textElement.toJS())
    }
  */
}
