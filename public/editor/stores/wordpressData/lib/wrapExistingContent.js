/* global wp */
import { getStorage, getService } from 'vc-cake'
// import { parseRowAttributes, parseGeneralAttributes } from './parseAttributes'

const utils = getService('utils')
const cook = getService('cook')
const migrationStorage = getStorage('migration')
const elementsStorage = getStorage('elements')

const parse = (multipleShortcodesRegex, content, parent = false) => {
  const localShortcodesRegex = new RegExp(multipleShortcodesRegex.source)
  const globalMatches = content.match(multipleShortcodesRegex)
  globalMatches.forEach((line) => {
    const innerContent = line.match(localShortcodesRegex)
    const shortcodeTag = innerContent[ 2 ]
    const subInnerContent = innerContent[ 5 ]
    const attr = wp.shortcode.attrs(innerContent[ 3 ]).named
    // const generalElementAttributes = parseGeneralAttributes(attr)
    // Migrate All other elements to shortcode Element

    migrationStorage.trigger('migrateElement', {
      tag: shortcodeTag,
      _attrs: attr,
      _subInnerContent: subInnerContent,
      _parse: parse,
      _multipleShortcodesRegex: multipleShortcodesRegex,
      _parent: parent,
      _shortcodeString: line,
      _migrated: false
    })
  })
}

export default (content) => {
  if (window.hasOwnProperty('VCV_API_WPBAKERY_WPB_MAP')) {
    const multipleShortcodesRegex = wp.shortcode.regexp(window.VCV_API_WPBAKERY_WPB_MAP().join('|'))
    parse(multipleShortcodesRegex, content)
  } else {
    const textElement = cook.get({ tag: 'textBlock', output: utils.wpAutoP(content, '__VCVID__') })
    if (textElement) {
      elementsStorage.trigger('add', textElement.toJS())
    }
  }
}
