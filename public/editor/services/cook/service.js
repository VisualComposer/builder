import lodash from 'lodash'
import { addService, env, getService, getStorage } from 'vc-cake'

import { buildSettingsObject } from './lib/tools'
import elementSettings from './lib/element-settings'
import attributeManager from './lib/attribute-manager'
import Element from './lib/element'
import React from 'react'
import ReactDOM from 'react-dom'

const DocumentData = getService('document')
const { getBlockRegexp, parseDynamicBlock } = getService('utils')
const blockRegexp = getBlockRegexp()

const hubElementsStorage = getStorage('hubElements')
const settingsStorage = getStorage('settings')
let containerRelations = {}
let innerRenderCount = 0

const API = {
  get (data) {
    if (!data || !data.tag) {
      console.error('No element Tag provided', data)
      return null
    }
    data.cookApi = API
    return new Element(data)
  },
  buildSettingsElement (data, settings, cssSettings) {
    data.cookApi = API
    return new Element(data, settings, cssSettings)
  },
  getSettings (tag) {
    return elementSettings.get(tag)
  },
  getById (id) {
    let data = DocumentData.get(id)
    return data !== null ? this.get(data) : null
  },
  add (settings, componentCallback, cssSettings, modifierOnCreate) {
    elementSettings.add(settings, componentCallback, cssSettings, typeof modifierOnCreate === 'function' ? modifierOnCreate : undefined)
  },
  getTagByName (name) {
    return elementSettings.findTagByName(name)
  },
  attributes: {
    add (name, component, settings, representers = {}) {
      attributeManager.add(name, component,
        lodash.defaults((typeof settings === 'object' ? settings : {}), { setter: null, getter: null }),
        representers)
    },
    remove (name) {
      delete attributeManager.items[ name ]
    },
    get (name) {
      let attributeElement = attributeManager.get(name)
      if (attributeElement) {
        return attributeElement
      }
      return null
    }
  },
  dynamicFields: {
    getDynamicFieldsData: (props, attribute = null, raw = false) => {
      const { blockAtts } = props
      const postData = settingsStorage.state('postData').get()
      let key = blockAtts.value.replace('::', ':')
      let result = null
      if (blockAtts && blockAtts.value && typeof postData[ key ] !== 'undefined') {
        if (postData && postData[ key ].length) {
          // Value should be NEVER empty
          result = postData[ key ]
        }
      }

      // In case if type===string and HTML Then:
      if (!raw && attribute && [ 'string', 'htmleditor' ].indexOf(attribute.fieldType) !== -1) {
        const isHtmlAllowed = attribute.fieldOptions.dynamicField === true || (typeof attribute.fieldOptions.dynamicField.html !== 'undefined' && attribute.fieldOptions.dynamicField.html === true)
        if (isHtmlAllowed) {
          if (!result) {
            result = 'No Value'
          }
          return React.createElement('div', {
            className: 'vcvhelper',
            dangerouslySetInnerHTML: {
              __html: result
            },
            'data-vcvs-html': `<!-- wp:vcv-gutenberg-blocks/dynamic-field-block ${JSON.stringify({
              value: blockAtts.value,
              currentValue: result
            })} -->${result}<!-- /wp:vcv-gutenberg-blocks/dynamic-field-block -->`
          })
        }
      }

      // Plain text
      return !result ? `No Value (${blockAtts.value})` : result
    },
    cleanComments: (el, id) => {
      const clean = (el, type) => {
        while (el[ type ]) {
          let node = el[ type ]
          if (node.nodeType === document.COMMENT_NODE) {
            let textContent = node.textContent
            if (textContent.indexOf('/dynamicElementComment') !== -1) {
              if (textContent.indexOf(`/dynamicElementComment:${id}`) !== -1) {
                // This is comment of element so we can remove it
                node.remove()
              }
              break
            } else {
              node.remove()
            }
          } else {
            break
          }
        }
      }
      clean(el, 'previousSibling')
      clean(el, 'nextSibling')
    },
    updateDynamicComments: (ref, id, cookElement, inner) => {
      if (!env('VCV_JS_FT_DYNAMIC_FIELDS')) {
        return
      }
      if (!ref || !cookElement) {
        return
      }
      const el = ReactDOM.findDOMNode(ref)
      // Clean everything before/after
      API.dynamicFields.cleanComments(el, id)

      let atts = cookElement.getAll(false)

      let hasDynamic = false
      let commentStack = []
      let attributesLevel = 0
      Object.keys(atts).forEach((fieldKey) => {
        const attrSettings = cookElement.settings(fieldKey)
        const type = attrSettings.type && attrSettings.type.name ? attrSettings.type.name : ''
        const options = attrSettings.settings.options ? attrSettings.settings.options : {}
        let value = atts[ fieldKey ]

        // Check isDynamic for string/htmleditor/attachimage
        let isDynamic = false
        if (env('VCV_JS_FT_DYNAMIC_FIELDS') && typeof options.dynamicField !== 'undefined') {
          if (options.dynamicField.html) {
            // Ignore for HTML Enabled versions
            return
          }
          if ([ 'string', 'htmleditor' ].indexOf(type) !== -1 && value.match(blockRegexp)) {
            if (options.dynamicField === true || options.dynamicField.html) {
              // Ignore for HTML Enabled versions
              return
            }
            isDynamic = true
          } else if ([ 'attachimage' ].indexOf(type) !== -1) {
            value = value.full ? value.full : (value.urls && value.urls[ 0 ] ? value.urls[ 0 ].full : '')
            isDynamic = value.match(blockRegexp)
          }
        }
        if (isDynamic) {
          let blockInfo = parseDynamicBlock(value)
          blockInfo.blockAtts.elementId = id
          if (typeof blockInfo.blockAtts.currentValue !== 'undefined') {
            blockInfo.blockAtts.currentValue = API.dynamicFields.getDynamicFieldsData(blockInfo, {
              fieldType: attrSettings.type.name,
              fieldOptions: attrSettings.settings.options
            }, true)
          }
          hasDynamic = true
          attributesLevel++
          commentStack.push({ blockInfo, attributesLevel })
        }

        // Check isDynamic for designOptions/designOptionsAdvanced
        if (attrSettings.type && attrSettings.type.name && [ 'designOptions', 'designOptionsAdvanced' ].indexOf(attrSettings.type.name) !== -1) {
          let designOptions = value
          if (designOptions && designOptions.device) {
            Object.keys(designOptions.device).forEach((device) => {
              let imgValueObj = attrSettings.type.name === 'designOptionsAdvanced' ? designOptions.device[ device ].images : designOptions.device[ device ].image
              let imgValue = imgValueObj && imgValueObj.urls && imgValueObj.urls[ 0 ] ? imgValueObj.urls[ 0 ].full : ''
              if (typeof imgValue === 'string' && imgValue.match(blockRegexp)) {
                let blockInfo = parseDynamicBlock(imgValue)
                blockInfo.blockAtts.device = device
                blockInfo.blockAtts.elementId = id
                if (typeof blockInfo.blockAtts.currentValue !== 'undefined') {
                  blockInfo.blockAtts.currentValue = API.dynamicFields.getDynamicFieldsData(blockInfo, null, true)
                }
                hasDynamic = true
                attributesLevel++
                commentStack.push({ blockInfo, attributesLevel })
              }
            })
          }
        }
      })
      if (hasDynamic) {
        if (inner) {
          innerRenderCount++
        }
        let nestingLevel = API.getParentCount(id)
        let innerNestingLevel = inner ? innerRenderCount : 0
        el.insertAdjacentHTML('beforebegin', `<!-- vcwb/dynamicElementComment:${id} -->`)
        el.insertAdjacentHTML('afterend', `<!-- /vcwb/dynamicElementComment:${id} -->`)
        commentStack.forEach((commentData) => {
          const { blockInfo, attributesLevel } = commentData
          el.insertAdjacentHTML('beforebegin', `<!-- wp:${blockInfo.blockScope}${blockInfo.blockName}-${nestingLevel}-${attributesLevel}-${innerNestingLevel} ${JSON.stringify(blockInfo.blockAtts)} -->`)
          el.insertAdjacentHTML('afterend', `<!-- /wp:${blockInfo.blockScope}${blockInfo.blockName}-${nestingLevel}-${attributesLevel}-${innerNestingLevel} -->`)
        })
      }
    },
    getDynamicFieldsList: (fieldType) => {
      let postFields = settingsStorage.state('postFields').get() || []

      return postFields[ fieldType ] || []
    },
    getDynamicValue: (dynamicFieldKey, attribute = null, options = {}) => {
      let { dynamicTemplate } = options
      let newValue = null

      if (dynamicTemplate) {
        newValue = dynamicTemplate.replace('$dynamicFieldKey', dynamicFieldKey)
      } else {
        const currentValue = API.dynamicFields.getDynamicFieldsData(
          {
            blockAtts: {
              value: dynamicFieldKey
            }
          },
          attribute,
          true
        )
        newValue = `<!-- wp:vcv-gutenberg-blocks/dynamic-field-block ${JSON.stringify({
          value: dynamicFieldKey,
          currentValue: currentValue
        })} -->`
      }
      return newValue
    },
    getDefaultDynamicFieldKey: (fieldType) => {
      const dynamicFieldsList = API.dynamicFields.getDynamicFieldsList(fieldType)
      const dynamicFieldListValues = Object.values(dynamicFieldsList)
      let dynamicFieldKey = ''

      if (dynamicFieldListValues[ 0 ] && dynamicFieldListValues[ 0 ].group && dynamicFieldListValues[ 0 ].group.values && dynamicFieldListValues[ 0 ].group.values[ 0 ]) {
        dynamicFieldKey = dynamicFieldListValues[ 0 ].group.values[ 0 ].value
      }

      return dynamicFieldKey
    },
    getDefaultValue: (options) => {
      if (options.defaultValue) {
        return options.defaultValue
      }
      const { fieldKey, elementAccessPoint } = options
      let cookElement = elementAccessPoint.cook()

      let { settings } = cookElement.settings(fieldKey)
      let defaultValue = settings.defaultValue
      if (typeof defaultValue === 'undefined' && settings.value) {
        defaultValue = settings.value
      }

      return defaultValue || ''
    }
  },
  list: {
    settings (sortSelector = [ 'name' ]) {
      let list = elementSettings.list()

      return lodash.sortBy(list.map((item) => {
        let elementValues = buildSettingsObject(item.settings)
        return API.get(elementValues).toJS()
      }), sortSelector)
    }
  },
  getContainerChildren (tag) {
    if (containerRelations.hasOwnProperty(tag)) {
      return containerRelations[ tag ]
    } else {
      return []
    }
  },
  getParentCount: (id, count = 0) => {
    let element = DocumentData.get(id)
    let parent = !element || !element.parent ? false : element.parent
    if (parent) {
      let parentElement = DocumentData.get(parent)
      count++
      return API.getParentCount(parentElement.id, count)
    }

    return count
  }
}

const getChildren = (groups) => {
  let result = []
  const allElements = API.list.settings()
  allElements.forEach((settings) => {
    let element = API.get(settings)
    if (element && element.relatedTo(groups)) {
      result.push({
        tag: element.get('tag'),
        name: element.getName()
      })
    }
  })
  return result
}

const setRelations = () => {
  const allElements = API.list.settings()
  allElements.forEach((settings) => {
    const element = API.get(settings)
    const containerFor = element.containerFor()
    const tag = element.get('tag')
    if (containerFor.length && containerFor.indexOf('General') < 0) {
      containerRelations[ tag ] = getChildren(containerFor, allElements)
    }
  })
}

hubElementsStorage.on('start', () => {
  setTimeout(() => {
    setRelations()
  }, 1)
})

hubElementsStorage.on('add', () => {
  setTimeout(() => {
    setRelations()
  }, 1)
})

addService('cook', API)
