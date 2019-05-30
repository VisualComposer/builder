import { getStorage, getService, env } from 'vc-cake'
import ReactDOM from 'react-dom'

const { getBlockRegexp } = getService('utils')
const settingsStorage = getStorage('settings')
const blockRegexp = getBlockRegexp()

export function getDynamicFieldsData (props) {
  const { value, blockAtts } = props
  const postData = settingsStorage.state('postData').get()

  if (blockAtts && blockAtts.value && typeof postData[ blockAtts.value ] !== 'undefined') {
    return postData[ blockAtts.value ]
  }

  return value
}

/**
 * Example value <!-- wp:vcv-..{value:"featured_image"}.... -->
 * @param value
 * @returns {boolean|{blockName: *, blockContent: *, blockAtts: any, value: *}}
 */
export function parseDynamicBlock (value) {
  if (value.match(blockRegexp)) {
    const blockInfo = value.split(blockRegexp)
    return {
      value: value,
      blockScope: blockInfo[ 2 ],
      blockName: blockInfo[ 3 ],
      blockAtts: JSON.parse(blockInfo[ 4 ].trim()),
      blockContent: blockInfo[ 7 ]
    }
  }

  return false
}

export function cleanComments (el, id) {
  while (el.previousSibling) {
    let node = el.previousSibling
    if (node.nodeType === document.COMMENT_NODE) {
      let textContent = node.textContent
      if (textContent.indexOf('/dynamicElementComment')) {
        if (textContent.indexOf(`/dynamicElementComment:${id}`)) {
          // This is comment of element so we can remove it
          node.remove()
        } else {
          // This is comment of another element, so we should break
          break
        }
      }
    } else {
      break
    }
  }
  while (el.nextSibling) {
    let node = el.nextSibling
    if (node.nodeType === document.COMMENT_NODE) {
      let textContent = node.textContent
      if (textContent.indexOf('/dynamicElementComment')) {
        if (textContent.indexOf(`/dynamicElementComment:${id}`)) {
          // This is comment of element so we can remove it
          node.remove()
        } else {
          // This is comment of another element, so we should break
          break
        }
      }
    } else {
      break
    }
  }
}

export function updateDynamicComments (ref, id, cookElement) {
  if (!env('VCV_JS_FT_DYNAMIC_FIELDS')) {
    return
  }
  if (!ref || !cookElement) {
    return
  }
  const el = ReactDOM.findDOMNode(ref)
  // Clean everything before/after
  cleanComments(el, id)

  let atts = cookElement.getAll(false)

  let beforeBeginStack = []
  let afterEndStack = []
  beforeBeginStack.push(`<!-- vcwb/dynamicElementComment:${id} -->`)
  afterEndStack.push(`<!-- /vcwb/dynamicElementComment:${id} -->`)
  let hasDynamic = false
  Object.keys(atts).forEach((fieldKey) => {
    const attrSettings = cookElement.settings(fieldKey)
    let isDynamic = attrSettings.settings.options &&
      attrSettings.settings.options.dynamicField &&
      typeof atts[ fieldKey ] === 'string' &&
      atts[ fieldKey ].match(blockRegexp)

    if (isDynamic) {
      let blockInfo = parseDynamicBlock(atts[ fieldKey ])
      blockInfo.blockAtts.elementId = id
      hasDynamic = true
      beforeBeginStack.push(`<!-- wp:${blockInfo.blockScope}${blockInfo.blockName} ${JSON.stringify(blockInfo.blockAtts)} -->`)
      afterEndStack.push(`<!-- /wp:${blockInfo.blockScope}${blockInfo.blockName} -->`)
    } else if (attrSettings.type && attrSettings.type.name && (attrSettings.type.name === 'designOptions')) {
      let designOptions = atts[ fieldKey ]
      if (designOptions && designOptions.device) {
        // TODO: Design options image value update
        Object.keys(designOptions.device).forEach((device) => {
          let imgValue = designOptions.device[ device ].image
          if (typeof imgValue === 'string' && imgValue.match(blockRegexp)) {
            let blockInfo = parseDynamicBlock(imgValue)
            blockInfo.blockAtts.device = device
            blockInfo.blockAtts.elementId = id
            hasDynamic = true
            beforeBeginStack.push(`<!-- wp:${blockInfo.blockScope}${blockInfo.blockName} ${JSON.stringify(blockInfo.blockAtts)} -->`)
            afterEndStack.push(`<!-- /wp:${blockInfo.blockScope}${blockInfo.blockName} -->`)
          }
        })
      }
    } else if (attrSettings.type && attrSettings.type.name && (attrSettings.type.name === 'designOptionsAdvanced')) {
      let designOptions = atts[ fieldKey ]
      if (designOptions && designOptions.device) {
        Object.keys(designOptions.device).forEach((device) => {
          let imgValue = designOptions.device[ device ].images
          if (typeof imgValue === 'string' && imgValue.match(blockRegexp)) {
            let blockInfo = parseDynamicBlock(imgValue)
            blockInfo.blockAtts.elementId = id
            hasDynamic = true
            beforeBeginStack.push(`<!-- wp:${blockInfo.blockScope}${blockInfo.blockName} ${JSON.stringify(blockInfo.blockAtts)} -->`)
            afterEndStack.push(`<!-- /wp:${blockInfo.blockScope}${blockInfo.blockName} -->`)
          }
        })
      }
    }
  })
  if (hasDynamic) {
    beforeBeginStack.forEach((comment) => {
      el.insertAdjacentHTML('beforebegin', comment)
    })
    afterEndStack.forEach((comment) => {
      el.insertAdjacentHTML('afterend', comment)
    })
  }
}

export function getDynamicFieldsList (fieldType) {
  // TODO: Add and get this from API/Storage etc
  if (fieldType === 'attachimage') {
    return [ {
      key: 'featured_image',
      label: 'Featured Image'
    }
    ]
  } else if (fieldType === 'string') {
    return [
      {
        key: 'post_title',
        label: 'Post Title'
      },
      {
        key: 'post_excerpt',
        label: 'Post Exceprt'
      },
      {
        key: 'post_content',
        label: 'Post Content'
      }
    ]
  }

  return []
}
