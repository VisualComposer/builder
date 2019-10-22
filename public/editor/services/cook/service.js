import lodash from 'lodash'
import { addService, env, getService, getStorage } from 'vc-cake'

import { buildSettingsObject } from './lib/tools'
import elementSettings from './lib/element-settings'
import attributeManager from './lib/attribute-manager'
import Element from './lib/element'
import React from 'react'
import ReactDOM from 'react-dom'
import MobileDetect from 'mobile-detect'
import ContentEditableComponent from 'public/components/layoutHelpers/contentEditable/contentEditableComponent'

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
    return new Element(data, null, null, API)
  },
  buildSettingsElement (data, settings, cssSettings) {
    return new Element(data, settings, cssSettings, API)
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
      const { blockAtts, beforeBlock, afterBlock } = props
      let postData = settingsStorage.state('postData').get()

      let key = blockAtts.value.replace('::', ':')
      let result = null
      let sourceId = blockAtts.sourceId || window.vcvSourceID
      sourceId = parseInt(sourceId)

      if (window.vcvSourceID !== sourceId) {
        postData = postData[ sourceId ]
      }
      if (blockAtts && blockAtts.value && postData && typeof postData[ key ] !== 'undefined') {
        if (postData && postData[ key ].length) {
          // Value should be NEVER empty
          result = postData[ key ]
        }
      }

      // In case if type===string and HTML Then:
      if (!raw && attribute && [ 'string', 'htmleditor', 'inputSelect' ].indexOf(attribute.fieldType) !== -1) {
        const isHtmlAllowed = attribute.fieldOptions.dynamicField === true || (typeof attribute.fieldOptions.dynamicField.html !== 'undefined' && attribute.fieldOptions.dynamicField.html === true)
        if (isHtmlAllowed) {
          if (!result) {
            result = `No Value (${blockAtts.value})`
          }
          let dynamicProps = {
            value: blockAtts.value,
            currentValue: result
          }
          if (window.vcvSourceID !== sourceId || blockAtts.sourceId) {
            dynamicProps.sourceId = sourceId
          }
          return React.createElement(attribute.fieldType === 'htmleditor' ? 'div' : 'span', {
            className: 'vcvhelper',
            dangerouslySetInnerHTML: {
              __html: beforeBlock + result + afterBlock
            },
            'data-vcvs-html': `<!-- wp:vcv-gutenberg-blocks/dynamic-field-block ${JSON.stringify(dynamicProps)} -->${beforeBlock + result + afterBlock}<!-- /wp:vcv-gutenberg-blocks/dynamic-field-block -->`
          })
        }
      }

      // Plain text
      return !result ? `No Value (${blockAtts.value})` : result
    },
    cleanComments: (el, id) => {
      const clean = (el, type) => {
        while (el[ type ]) {
          const node = el[ type ]
          if (node.nodeType === document.COMMENT_NODE) {
            const textContent = node.textContent
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
    getCommentsStack: function (id, cookElement, inner, attributesLevel = 0) {
      let atts = cookElement.getAll ? cookElement.getAll(false) : cookElement.atts
      let commentStack = []

      Object.keys(atts).forEach((fieldKey) => {
        let isDynamic = false
        const attrSettings = cookElement.settings ? cookElement.settings(fieldKey) : cookElement.attrSettings.settings.options.settings
        const type = attrSettings[ fieldKey ] && attrSettings[ fieldKey ].type ? attrSettings[ fieldKey ].type : attrSettings.type && attrSettings.type.name ? attrSettings.type.name : ''
        const options = attrSettings[ fieldKey ] && attrSettings[ fieldKey ].options ? attrSettings[ fieldKey ].options : attrSettings.settings && attrSettings.settings.options ? attrSettings.settings.options : {}
        let value = atts[ fieldKey ]

        if (type === 'paramsGroup') {
          const attrValue = cookElement.get(fieldKey).value
          attrValue.forEach((value, i) => {
            const paramsGroupProps = {}
            paramsGroupProps.element = cookElement
            paramsGroupProps.attrKey = fieldKey
            paramsGroupProps.attrSettings = attrSettings
            paramsGroupProps.atts = value
            paramsGroupProps.paramGroupItemId = `${i}-${id}`
            let commentsStackResult = API.dynamicFields.getCommentsStack(id, paramsGroupProps, inner, attributesLevel)
            attributesLevel = commentsStackResult.attributesLevel
            commentStack = commentStack.concat(commentsStackResult.commentStack)
          })
        }

        if (env('VCV_JS_FT_DYNAMIC_FIELDS') && options && typeof options.dynamicField !== 'undefined') {
          if (options.dynamicField.html) {
            // Ignore for HTML Enabled versions
            return
          }
          if (type === 'htmleditor') {
            // Ignore for HTML editor attribute
            return
          }
          if (type === 'inputSelect') {
            isDynamic = value.input && value.input.match(blockRegexp)
          } else if (type === 'string') {
            isDynamic = value.match(blockRegexp)
          } else if ([ 'attachimage' ].indexOf(type) !== -1) {
            value = value.full ? value.full : (value.urls && value.urls[ 0 ] ? value.urls[ 0 ].full : '')
            isDynamic = value.match(blockRegexp)
          } else if ([ 'url' ].indexOf(type) !== -1) {
            value = value && value.url ? value.url : ''
            isDynamic = value.match(blockRegexp)
          }
        }
        if (isDynamic) {
          if (type === 'inputSelect') {
            value = value.input
          }
          let blockInfo = parseDynamicBlock(value)
          blockInfo.blockAtts.elementId = id
          if (typeof blockInfo.blockAtts.currentValue !== 'undefined') {
            blockInfo.blockAtts.currentValue = API.dynamicFields.getDynamicFieldsData(blockInfo, {
              fieldType: type,
              fieldOptions: options
            }, true)
          }
          if (cookElement.paramGroupItemId) {
            blockInfo.blockAtts.paramGroupItemId = cookElement.paramGroupItemId
          }
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
                attributesLevel++
                commentStack.push({ blockInfo, attributesLevel })
              }
            })
          }
        }
      })

      return {
        attributesLevel,
        commentStack
      }
    },
    updateDynamicComments: (ref, id, cookElement, inner) => {
      if (!env('VCV_JS_FT_DYNAMIC_FIELDS')) {
        return
      }
      if (!ref || !cookElement) {
        return
      }
      const el = ReactDOM.findDOMNode(ref)

      // Clean all comments before/after element dom ref
      API.dynamicFields.cleanComments(el, id)

      let commentsStackResult = API.dynamicFields.getCommentsStack(id, cookElement, inner)

      if (commentsStackResult.commentStack.length) {
        if (inner) {
          innerRenderCount++
        }
        let nestingLevel = API.getParentCount(id)
        let innerNestingLevel = inner ? innerRenderCount : 0
        el.insertAdjacentHTML('beforebegin', `<!-- vcwb/dynamicElementComment:${id} -->`)
        el.insertAdjacentHTML('afterend', `<!-- /vcwb/dynamicElementComment:${id} -->`)
        commentsStackResult.commentStack.forEach((commentData) => {
          const { blockInfo, attributesLevel } = commentData
          el.insertAdjacentHTML('beforebegin', `<!-- wp:${blockInfo.blockScope}${blockInfo.blockName}-${nestingLevel}-${attributesLevel}-${innerNestingLevel} ${JSON.stringify(blockInfo.blockAtts)} -->`)
          el.insertAdjacentHTML('afterend', `<!-- /wp:${blockInfo.blockScope}${blockInfo.blockName}-${nestingLevel}-${attributesLevel}-${innerNestingLevel} ${JSON.stringify(blockInfo.blockAtts)} -->`)
        })
      }
    },
    getDynamicFieldsList: (fieldType) => {
      let postFields = settingsStorage.state('postFields').get() || []

      return postFields[ fieldType ] || []
    },
    getDynamicValue: (dynamicFieldKey, sourceId = null, attribute = null, options = {}) => {
      if (!sourceId) {
        sourceId = window.vcvSourceID
      }
      let { dynamicTemplateProps, forceSaveSourceId } = options
      let newValue = null

      if (dynamicTemplateProps) {
        let dynamicProps = Object.assign({}, dynamicTemplateProps)
        dynamicProps.value = dynamicFieldKey
        if (!forceSaveSourceId && (window.vcvSourceID === sourceId)) {
          delete dynamicProps.sourceId
        } else {
          dynamicProps.sourceId = sourceId
        }
        newValue = `<!-- wp:vcv-gutenberg-blocks/dynamic-field-block ${JSON.stringify(dynamicProps)} --><!-- /wp:vcv-gutenberg-blocks/dynamic-field-block -->`
      } else {
        const currentValue = API.dynamicFields.getDynamicFieldsData(
          {
            blockAtts: {
              value: dynamicFieldKey,
              sourceId: sourceId
            }
          },
          attribute,
          true
        )
        let dynamicProps = {
          value: dynamicFieldKey,
          currentValue: currentValue
        }
        if (window.vcvSourceID !== sourceId || forceSaveSourceId) {
          dynamicProps.sourceId = sourceId
        }
        newValue = `<!-- wp:vcv-gutenberg-blocks/dynamic-field-block ${JSON.stringify(dynamicProps)} --><!-- /wp:vcv-gutenberg-blocks/dynamic-field-block -->`
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
  },
  visualizeAttributes: (element, api = false, props = false, isNested = false) => {
    const atts = props ? props.atts : element.getAll(false)
    const id = props ? props.id : atts.id
    let layoutAtts = {}
    let allowInline = true
    const mobileDetect = new MobileDetect(window.navigator.userAgent)
    if (mobileDetect.mobile() && (mobileDetect.tablet() || mobileDetect.phone())) {
      allowInline = false
    }
    Object.keys(atts).forEach((fieldKey) => {
      const attrSettings = props ? props.attrSettings.settings.options.settings : element.settings(fieldKey)
      const type = props ? attrSettings[ fieldKey ].type : attrSettings.type && attrSettings.type.name ? attrSettings.type.name : ''
      const options = props ? attrSettings[ fieldKey ].options : attrSettings.settings.options ? attrSettings.settings.options : {}

      let value = null
      if (typeof atts[ fieldKey ] === 'object' && atts[ fieldKey ] !== null && !(atts[ fieldKey ] instanceof Array)) {
        value = JSON.parse(JSON.stringify(atts[ fieldKey ]))
      } else {
        value = atts[ fieldKey ]
      }

      let dynamicValue = value

      let isDynamic = false
      if (env('VCV_JS_FT_DYNAMIC_FIELDS') && options && typeof options.dynamicField !== 'undefined') {
        if ([ 'string', 'htmleditor', 'inputSelect' ].indexOf(type) !== -1) {
          let matchValue
          if (type === 'inputSelect') {
            matchValue = value.input && value.input.match(blockRegexp)
          } else {
            matchValue = value.match(blockRegexp)
          }
          if (matchValue) {
            isDynamic = true
          }
        } else if ([ 'attachimage' ].indexOf(type) !== -1) {
          let tempValue = value.full ? value.full : (value.urls && value.urls[ 0 ] ? value.urls[ 0 ].full : '')
          isDynamic = tempValue.match(blockRegexp)
          if (isDynamic) {
            dynamicValue = tempValue
          }
        } else if ([ 'url' ].indexOf(type) !== -1) {
          let tempValue = value && value.url ? value.url : ''
          isDynamic = tempValue.match(blockRegexp)
          if (isDynamic) {
            dynamicValue = tempValue
          }
        }
      }

      if (isDynamic) {
        let blockInfo
        if (type === 'inputSelect') {
          blockInfo = dynamicValue.input && dynamicValue.input.split(blockRegexp)
        } else {
          blockInfo = dynamicValue.split(blockRegexp)
        }
        let dynamicFieldsData = API.dynamicFields.getDynamicFieldsData(
          {
            fieldKey: fieldKey,
            value: dynamicValue,
            blockName: blockInfo[ 3 ],
            blockAtts: JSON.parse(blockInfo[ 4 ].trim()),
            blockContent: blockInfo[ 7 ],
            beforeBlock: blockInfo[ 0 ] || '',
            afterBlock: blockInfo[ 14 ] || ''
          },
          {
            fieldKey: fieldKey,
            fieldType: type,
            fieldOptions: options
          }
        )

        if ([ 'attachimage' ].indexOf(type) !== -1) {
          if (value && value.full) {
            value.full = dynamicFieldsData
            layoutAtts[ fieldKey ] = value
          } else if (value.urls && value.urls[ 0 ]) {
            let newValue = { ids: [], urls: [ { full: dynamicFieldsData } ] }
            if (value.urls[ 0 ] && value.urls[ 0 ].filter) {
              newValue.urls[ 0 ].filter = value.urls[ 0 ].filter
            }
            if (value.urls[ 0 ] && value.urls[ 0 ].link) {
              newValue.urls[ 0 ].link = value.urls[ 0 ].link
            }
            layoutAtts[ fieldKey ] = newValue
          } else {
            layoutAtts[ fieldKey ] = dynamicFieldsData
          }
        } else if (type === 'inputSelect') {
          value.input = dynamicFieldsData
          value.select = null
          layoutAtts[ fieldKey ] = value
        } else if (type === 'url') {
          value.url = dynamicFieldsData
          layoutAtts[ fieldKey ] = value
        } else {
          layoutAtts[ fieldKey ] = dynamicFieldsData
        }
      } else if (!isNested && options && options.inline) {
        layoutAtts[ fieldKey ] =
          <ContentEditableComponent id={id} fieldKey={fieldKey} fieldType={type} api={api} cook={API}
            options={{
              ...options,
              allowInline
            }}>
            {value || ''}
          </ContentEditableComponent>
      } else if (type === 'paramsGroup') {
        const paramsGroupProps = {}
        paramsGroupProps.element = element
        paramsGroupProps.attrKey = fieldKey
        paramsGroupProps.attrSettings = attrSettings
        paramsGroupProps.allowInline = allowInline
        paramsGroupProps.id = id
        let fieldValue = {}
        fieldValue.value = []
        const attrValue = element.get(fieldKey).value
        attrValue.forEach((value, i) => {
          paramsGroupProps.atts = value
          fieldValue.value[ i ] = API.visualizeAttributes(element, api, paramsGroupProps, isNested)
        })
        layoutAtts[ fieldKey ] = fieldValue
      } else if ((type === 'htmleditor' && (!options || !options.inline)) || (isNested && options && options.inline)) {
        layoutAtts[ fieldKey ] =
          <div className='vcvhelper' data-vcvs-html={value} dangerouslySetInnerHTML={{ __html: value }} />
      } else {
        layoutAtts[ fieldKey ] = value
      }
    })
    return layoutAtts
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
