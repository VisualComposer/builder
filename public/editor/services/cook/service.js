import lodash from 'lodash'
import { addService, env, getService, getStorage } from 'vc-cake'

import { buildSettingsObject } from './lib/tools'
import attributeManager from './lib/attribute-manager'
import Element from './lib/element'
import React from 'react'
import ReactDOM from 'react-dom'
import MobileDetect from 'mobile-detect'
import ContentEditableComponent from 'public/components/layoutHelpers/contentEditable/contentEditableComponent'

const DocumentData = getService('document')
const { getBlockRegexp, parseDynamicBlock } = getService('utils')
const blockRegexp = getBlockRegexp()
const dataManager = getService('dataManager')
const roleManager = getService('roleManager')
const localizations = dataManager.get('localizations')

const hubElementsStorage = getStorage('hubElements')
const settingsStorage = getStorage('settings')
const elementSettingsStorage = getStorage('elementSettings')
const containerRelations = {}
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
    return elementSettingsStorage.action('get', tag)
  },
  getById (id) {
    const data = DocumentData.get(id)
    return data !== null ? this.get(data) : null
  },
  add (settings, componentCallback, cssSettings, modifierOnCreate) {
    elementSettingsStorage.trigger('add', settings, componentCallback, cssSettings, typeof modifierOnCreate === 'function' ? modifierOnCreate : undefined)
  },
  getTagByName (name) {
    return elementSettingsStorage.action('findTagByName', name)
  },
  attributes: {
    add (name, component, settings, representers = {}) {
      attributeManager.add(name, component,
        lodash.defaults((typeof settings === 'object' ? settings : {}), { setter: null, getter: null }),
        representers)
    },
    remove (name) {
      delete attributeManager.items[name]
    },
    get (name) {
      const attributeElement = attributeManager.get(name)
      if (attributeElement) {
        return attributeElement
      }
      return null
    }
  },
  dynamicFields: {
    getDynamicFieldsData: (props, attribute = null, raw = false, options = {}) => {
      const { blockAtts, beforeBlock, afterBlock } = props
      let postData = settingsStorage.state('postData').get()
      const postFields = settingsStorage.state('postFields').get()

      const key = blockAtts.value.replace('::', ':')
      let result = null
      let sourceId = blockAtts.sourceId || dataManager.get('sourceID')
      sourceId = parseInt(sourceId)

      if (dataManager.get('sourceID') !== sourceId) {
        postData = postData[sourceId]
      }
      if (blockAtts && blockAtts.value && postData && typeof postData[key] !== 'undefined') {
        if (postData && postData[key].length) {
          // Value should be NEVER empty
          result = postData[key]

          if (dataManager.get('editorType') === 'vcv_layouts' && blockAtts.value === 'post_title') {
            result = 'Post title'
          }
        }
      }
      const getDefaultPlaceholder = (blockValue) => {
        const isDefaultPlaceholderAcfImage = function (metaValue) {
          let isImage = false
          if (postFields?.attachimage?.acf?.group?.values) {
            for (const acf of postFields.attachimage.acf.group.values) {
              if (acf.fieldType === 'image' && (acf.fieldMetaSlug === metaValue || acf.value === metaValue)) {
                isImage = true
              }
            }
          }

          return isImage
        }

        if (blockValue === 'post_excerpt') {
          return localizations ? localizations.excerptPlaceholderText : 'This is a sample excerpt placeholder that will be replaced with the actual content. You can style this excerpt to your liking using the editor controls.'
        } else if (blockValue === 'post_author_bio') {
          return localizations ? localizations.authorBioPlaceholderText : 'This is a placeholder for the Author Bio element. It will be replaced by the actual content.'
        } else if (isDefaultPlaceholderAcfImage(blockValue)) {
          if (attribute?.fieldType && attribute.fieldType === 'attachimage') {
            return postData.featured_image
          } else {
            return '<img src="' + postData.featured_image + '">'
          }
        }
        const noValueText = localizations ? localizations.noValue : 'No Value'
        return `${noValueText} (${blockValue})`
      }

      // In case if type===string and HTML Then:
      if (!raw && attribute && ['string', 'htmleditor', 'inputSelect'].indexOf(attribute.fieldType) !== -1) {
        const isHtmlAllowed = attribute.fieldOptions.dynamicField === true || (typeof attribute.fieldOptions.dynamicField.html !== 'undefined' && attribute.fieldOptions.dynamicField.html === true)
        if (isHtmlAllowed) {
          if (!result) {
            result = getDefaultPlaceholder(blockAtts.value)
          }
          if (dataManager.get('editorType') === 'vcv_layouts' && blockAtts.value === 'post_title') {
            result = 'Post title'
          }
          const dynamicProps = {
            value: blockAtts.value,
            currentValue: result
          }
          if (dataManager.get('sourceID') !== sourceId || blockAtts.sourceId) {
            dynamicProps.sourceId = sourceId
          }
          if (attribute?.fieldOptions?.dynamicFieldsOptions?.addAttributes) {
            const element = options?.element || {}
            dynamicProps.attributes = {}
            attribute.fieldOptions.dynamicFieldsOptions.addAttributes.forEach((fieldKey) => {
              dynamicProps.attributes[fieldKey] = element[fieldKey]
            })
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
      return !result ? getDefaultPlaceholder(blockAtts.value) : result
    },
    cleanComments: (el, id) => {
      const clean = (el, type) => {
        if (el) {
          while (el[type]) {
            const node = el[type]
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
      }
      clean(el, 'previousSibling')
      clean(el, 'nextSibling')
    },
    getCommentsStack: function (id, cookElement, inner, attributesLevel = 0) {
      const atts = cookElement.getAll ? cookElement.getAll(false) : cookElement.atts
      let commentStack = []

      Object.keys(atts).forEach((fieldKey) => {
        let isDynamic = false
        const attrSettings = cookElement.settings ? cookElement.settings(fieldKey) : cookElement.attrSettings.settings.options.settings
        let typeName
        if (attrSettings[fieldKey] && attrSettings[fieldKey].type) {
          typeName = attrSettings[fieldKey].type
        } else if (attrSettings.type && attrSettings.type.name) {
          typeName = attrSettings.type.name
        } else {
          return
        }
        const options = attrSettings[fieldKey] && attrSettings[fieldKey].options ? attrSettings[fieldKey].options : attrSettings.settings && attrSettings.settings.options ? attrSettings.settings.options : {}
        let value = atts[fieldKey]

        if (typeName === 'paramsGroup') {
          const attrValue = cookElement.get(fieldKey).value
          attrValue.forEach((value, i) => {
            const paramsGroupProps = {}
            paramsGroupProps.element = cookElement
            paramsGroupProps.attrKey = fieldKey
            paramsGroupProps.attrSettings = attrSettings
            paramsGroupProps.atts = value
            paramsGroupProps.paramGroupItemId = `${i}-${id}`
            const commentsStackResult = API.dynamicFields.getCommentsStack(id, paramsGroupProps, inner, attributesLevel)
            attributesLevel = commentsStackResult.attributesLevel
            commentStack = commentStack.concat(commentsStackResult.commentStack)
          })
        }

        if (env('VCV_JS_FT_DYNAMIC_FIELDS') && options && typeof options.dynamicField !== 'undefined') {
          if (options.dynamicField.html) {
            // Ignore for HTML Enabled versions
            return
          }
          if (typeName === 'htmleditor') {
            // Ignore for HTML editor attribute
            return
          }
          if (typeName === 'inputSelect') {
            isDynamic = value.input && value.input.match(blockRegexp)
          } else if (typeName === 'string') {
            isDynamic = value.match(blockRegexp)
          } else if (['attachimage'].indexOf(typeName) !== -1) {
            const linkValue = value.link ? value.link : (value.urls && value.urls[0] ? value.urls[0].link : '')
            if (linkValue && linkValue.url) {
              const isLinkDynamic = linkValue.url.match(blockRegexp)
              if (isLinkDynamic) {
                const urlAttribute = {}
                urlAttribute.element = cookElement
                urlAttribute.settings = () => {
                  return {
                    settings: {
                      options: {
                        dynamicField: true
                      }
                    },
                    type: {
                      name: 'url'
                    }
                  }
                }

                urlAttribute.atts = {
                  url: linkValue
                }

                const commentsStackResult = API.dynamicFields.getCommentsStack(id, urlAttribute, inner, attributesLevel)
                attributesLevel = commentsStackResult.attributesLevel
                commentStack = commentStack.concat(commentsStackResult.commentStack)
              }
            }

            value = value.full ? value.full : (value.urls && value.urls[0] ? value.urls[0].full : '')
            isDynamic = value.match(blockRegexp)
          } else if (['url'].indexOf(typeName) !== -1) {
            value = value && value.url ? value.url : ''
            isDynamic = value.match(blockRegexp)
          }
        }
        if (isDynamic) {
          if (typeName === 'inputSelect') {
            value = value.input
          }
          const blockInfo = parseDynamicBlock(value)
          blockInfo.blockAtts.elementId = id
          if (typeof blockInfo.blockAtts.currentValue !== 'undefined') {
            blockInfo.blockAtts.currentValue = API.dynamicFields.getDynamicFieldsData(blockInfo, {
              fieldType: typeName,
              fieldOptions: options
            }, true, { element: atts })
          }
          if (cookElement.paramGroupItemId) {
            blockInfo.blockAtts.paramGroupItemId = cookElement.paramGroupItemId
          }
          attributesLevel++
          commentStack.push({ blockInfo, attributesLevel })
        }

        // Check isDynamic for designOptions/designOptionsAdvanced
        if (attrSettings.type && attrSettings.type.name && ['designOptions', 'designOptionsAdvanced'].indexOf(attrSettings.type.name) !== -1) {
          const designOptions = value
          if (designOptions && designOptions.device) {
            Object.keys(designOptions.device).forEach((device) => {
              const imgValueObj = attrSettings.type.name === 'designOptionsAdvanced' ? designOptions.device[device].images : designOptions.device[device].image
              const imgValue = imgValueObj && imgValueObj.urls && imgValueObj.urls[0] ? imgValueObj.urls[0].full : ''
              if (typeof imgValue === 'string' && imgValue.match(blockRegexp)) {
                const blockInfo = parseDynamicBlock(imgValue)
                blockInfo.blockAtts.device = device
                blockInfo.blockAtts.elementId = id
                blockInfo.blockAtts.typeName = attrSettings.type.name
                if (typeof blockInfo.blockAtts.currentValue !== 'undefined') {
                  blockInfo.blockAtts.currentValue = API.dynamicFields.getDynamicFieldsData(blockInfo, null, true, { element: atts })
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
      if (!ref || !cookElement) {
        return
      }
      const el = ReactDOM.findDOMNode(ref)

      // Clean all comments before/after element dom ref
      API.dynamicFields.cleanComments(el, id)

      el.insertAdjacentHTML('beforebegin', `<!-- vcwb/dynamicElementComment:${id} -->`)
      el.insertAdjacentHTML('afterend', `<!-- /vcwb/dynamicElementComment:${id} -->`)
      if (env('VCV_JS_FT_DYNAMIC_FIELDS')) {
        const commentsStackResult = API.dynamicFields.getCommentsStack(id, cookElement, inner)
        if (commentsStackResult.commentStack.length) {
          if (inner) {
            innerRenderCount++
          }
          const nestingLevel = API.getParentCount(id)
          const innerNestingLevel = inner ? innerRenderCount : 0
          commentsStackResult.commentStack.forEach((commentData) => {
            const { blockInfo, attributesLevel } = commentData
            el.insertAdjacentHTML('beforebegin', `<!-- wp:${blockInfo.blockScope}${blockInfo.blockName}-${nestingLevel}-${attributesLevel}-${innerNestingLevel} ${JSON.stringify(blockInfo.blockAtts)} -->`)
            el.insertAdjacentHTML('afterend', `<!-- /wp:${blockInfo.blockScope}${blockInfo.blockName}-${nestingLevel}-${attributesLevel}-${innerNestingLevel} -->`)
          })
        }
      }
      API.dynamicFields.updateViewPageRenderComments(ref, id, cookElement, inner)
      // NOTE: Issue with slick-slider elements, need to find out the way to write comments after dom was modified by element js (slick slider)
    },
    updateViewPageRenderComments: (ref, id, cookElement, inner) => {
      if (!ref || !cookElement) {
        return
      }
      const el = ReactDOM.findDOMNode(ref)
      // Clean all comments before/after element dom ref
      const tag = cookElement.get('tag')
      if (['contentSlide', 'pageableTab'].indexOf(tag) !== -1) {
        // Unfortunately we must skip comments logic for contentSlide/pageableTab because of slick slider problem
        return
      }
      const atts = JSON.stringify({
        id: id,
        tag: tag
      })
      el.insertAdjacentHTML('beforebegin', `<!-- wp:vcwb-view-page-render-element/el-${tag.toLowerCase()}-${id} ${atts} -->`)
      el.insertAdjacentHTML('afterend', `<!-- /wp:vcwb-view-page-render-element/el-${tag.toLowerCase()}-${id} ${atts} -->`)
    },
    getDynamicFieldsList: (fieldType) => {
      const postFields = settingsStorage.state('postFields').get() || []

      return postFields[fieldType] || []
    },
    getDynamicValue: (dynamicFieldKey, sourceId = null, attribute = null, options = {}) => {
      if (!sourceId) {
        sourceId = dataManager.get('sourceID')
      }
      const { dynamicTemplateProps, forceSaveSourceId } = options
      let newValue = null

      const dynamicProps = Object.assign({}, dynamicTemplateProps || {})
      dynamicProps.value = dynamicFieldKey
      if (!forceSaveSourceId && (dataManager.get('sourceID') === sourceId)) {
        delete dynamicProps.sourceId
      } else {
        dynamicProps.sourceId = sourceId
      }

      const currentValue = API.dynamicFields.getDynamicFieldsData(
        {
          blockAtts: {
            value: dynamicFieldKey,
            sourceId: sourceId
          }
        },
        attribute,
        true,
        options
      )
      dynamicProps.currentValue = currentValue

      if (options?.fieldOptions?.dynamicFieldsOptions?.addAttributes) {
        const element = options?.element || {}
        dynamicProps.attributes = {}
        options.fieldOptions.dynamicFieldsOptions.addAttributes.forEach((fieldKey) => {
          dynamicProps.attributes[fieldKey] = element[fieldKey]
        })
      }

      newValue = `<!-- wp:vcv-gutenberg-blocks/dynamic-field-block ${JSON.stringify(dynamicProps)} --><!-- /wp:vcv-gutenberg-blocks/dynamic-field-block -->`

      return newValue
    },
    getDefaultDynamicFieldKey: (fieldType) => {
      const dynamicFieldsList = API.dynamicFields.getDynamicFieldsList(fieldType)
      const dynamicFieldListValues = Object.values(dynamicFieldsList)
      let dynamicFieldKey = ''

      if (dynamicFieldListValues[0] && dynamicFieldListValues[0].group && dynamicFieldListValues[0].group.values && dynamicFieldListValues[0].group.values[0]) {
        dynamicFieldKey = dynamicFieldListValues[0].group.values[0].value
      }

      return dynamicFieldKey
    },
    getDefaultValue: (options) => {
      if (options.defaultValue) {
        return options.defaultValue
      }
      const { fieldKey, elementAccessPoint } = options
      const cookElement = elementAccessPoint.cook()

      const { settings } = cookElement.settings(fieldKey)
      let defaultValue = settings.defaultValue
      if (typeof defaultValue === 'undefined' && settings.value) {
        defaultValue = settings.value
      }

      return defaultValue || ''
    }
  },
  list: {
    settings (sortSelector = ['name']) {
      const list = elementSettingsStorage.action('list')

      return lodash.sortBy(list.map((item) => {
        const elementValues = buildSettingsObject(item.settings)
        return API.get(elementValues).toJS()
      }), sortSelector)
    },
    elements (sortSelector = ['name']) {
      const list = elementSettingsStorage.action('list')

      return lodash.sortBy(list.map((item) => {
        const elementValues = buildSettingsObject(item.settings)
        return API.get(elementValues)
      }), sortSelector)
    }
  },
  getContainerChildren (tag) {
    if (Object.prototype.hasOwnProperty.call(containerRelations, tag)) {
      return containerRelations[tag]
    } else {
      return []
    }
  },
  getParentCount: (id, count = 0) => {
    const element = DocumentData.get(id)
    const parent = !element || !element.parent ? false : element.parent
    if (parent) {
      const parentElement = DocumentData.get(parent)
      count++
      return API.getParentCount(parentElement.id, count)
    }

    return count
  },
  visualizeAttributes: (element, api = false, props = false, isNested = false, raw = false) => {
    const atts = props ? props.atts : element.getAll(false)
    const id = props ? props.id : atts.id
    const layoutAtts = {}
    let allowInline = true
    const mobileDetect = new MobileDetect(window.navigator.userAgent)
    if (mobileDetect.mobile() && (mobileDetect.tablet() || mobileDetect.phone())) {
      allowInline = false
    }
    Object.keys(atts).forEach((fieldKey) => {
      const attrSettings = props && props.attrSettings ? props.attrSettings.settings.options.settings : element.settings(fieldKey)
      let typeName
      if (props) {
        if (attrSettings[fieldKey] && attrSettings[fieldKey].type) {
          typeName = attrSettings[fieldKey].type
        } else {
          return
        }
      } else if (attrSettings.type && attrSettings.type.name) {
        typeName = attrSettings.type && attrSettings.type.name ? attrSettings.type.name : ''
      }
      const options = props ? attrSettings[fieldKey].options : attrSettings.settings.options ? attrSettings.settings.options : {}

      let value = null
      if (typeof atts[fieldKey] === 'object' && atts[fieldKey] !== null && !(atts[fieldKey] instanceof Array)) {
        value = JSON.parse(JSON.stringify(atts[fieldKey]))
      } else {
        value = atts[fieldKey]
      }

      let dynamicValue = value

      let isDynamic = false
      if (env('VCV_JS_FT_DYNAMIC_FIELDS') && options && typeof options.dynamicField !== 'undefined') {
        if (['string', 'htmleditor', 'inputSelect'].indexOf(typeName) !== -1) {
          let matchValue
          if (typeName === 'inputSelect') {
            matchValue = value.input && value.input.match(blockRegexp)
          } else {
            matchValue = value.match(blockRegexp)
          }
          if (matchValue) {
            isDynamic = true
          }
        } else if (['attachimage'].indexOf(typeName) !== -1) {
          const tempValue = value.full ? value.full : (value.urls && value.urls[0] ? value.urls[0].full : '')
          isDynamic = tempValue.match(blockRegexp)
          if (isDynamic) {
            dynamicValue = tempValue
          }

          const linkValue = value.link ? value.link : (value.urls && value.urls[0] ? value.urls[0].link : '')
          const isLinkDynamic = linkValue && linkValue.url && linkValue.url.match(blockRegexp)
          if (isLinkDynamic) {
            const urlElement = {
              settings: () => {
                return {
                  url: {
                    options: {
                      dynamicField: true
                    },
                    type: 'url'
                  }
                }
              }
            }
            const linkProps = {
              atts: {
                url: linkValue
              }
            }

            const newLinkValue = API.visualizeAttributes(urlElement, false, linkProps, false, raw)

            if (value.link) {
              value.link = newLinkValue.url
            } else if (value.urls && value.urls[0] && value.urls[0].link) {
              value.urls[0].link = newLinkValue.url
            }
          }
        } else if (['url'].indexOf(typeName) !== -1) {
          const tempValue = value && value.url ? value.url : ''
          isDynamic = tempValue.match(blockRegexp)
          if (isDynamic) {
            dynamicValue = tempValue
          }
        }
      }

      if (isDynamic) {
        let blockInfo
        if (typeName === 'inputSelect') {
          blockInfo = dynamicValue.input && dynamicValue.input.split(blockRegexp)
        } else {
          blockInfo = dynamicValue.split(blockRegexp)
        }
        const dynamicFieldsData = API.dynamicFields.getDynamicFieldsData(
          {
            fieldKey: fieldKey,
            value: dynamicValue,
            blockName: blockInfo[3],
            blockAtts: JSON.parse(blockInfo[4].trim()),
            blockContent: blockInfo[7],
            beforeBlock: blockInfo[0] || '',
            afterBlock: blockInfo[14] || ''
          },
          {
            fieldKey: fieldKey,
            fieldType: typeName,
            fieldOptions: options
          },
          raw,
          { element: atts }
        )

        if (['attachimage'].indexOf(typeName) !== -1) {
          if (value && value.full) {
            value.full = dynamicFieldsData
            layoutAtts[fieldKey] = value
          } else if (value.urls && value.urls[0]) {
            const newValue = { ids: [], urls: [{ full: dynamicFieldsData }] }
            if (value.urls[0] && value.urls[0].filter) {
              newValue.urls[0].filter = value.urls[0].filter
            }
            if (value.urls[0] && value.urls[0].link) {
              newValue.urls[0].link = value.urls[0].link
            }
            layoutAtts[fieldKey] = newValue
          } else {
            layoutAtts[fieldKey] = dynamicFieldsData
          }
        } else if (typeName === 'inputSelect') {
          value.input = dynamicFieldsData
          value.select = null
          layoutAtts[fieldKey] = value
        } else if (typeName === 'url') {
          value.url = dynamicFieldsData
          layoutAtts[fieldKey] = value
        } else {
          layoutAtts[fieldKey] = dynamicFieldsData
        }
      } else if (!isNested && options && options.inline) {
        if (env('VCV_ADDON_ROLE_MANAGER_ENABLED') && element.get('metaIsElementLocked') && !roleManager.can('editor_settings_element_lock', roleManager.defaultAdmin())) {
          allowInline = false
        }
        const paramGroupProps = {}
        if (props) {
          paramGroupProps.paramIndex = props.index
          paramGroupProps.paramField = fieldKey
          paramGroupProps.paramParentField = props.attrKey
        }
        layoutAtts[fieldKey] =
          <ContentEditableComponent
            id={id} fieldKey={fieldKey} fieldType={typeName} api={api} cook={API}
            options={{
              ...options,
              allowInline
            }}
            {...paramGroupProps}
          >
            {value || ''}
          </ContentEditableComponent>
      } else if (typeName === 'paramsGroup') {
        const paramsGroupProps = {}
        paramsGroupProps.element = element
        paramsGroupProps.attrKey = fieldKey
        paramsGroupProps.attrSettings = attrSettings
        paramsGroupProps.allowInline = allowInline
        paramsGroupProps.id = id
        const fieldValue = {}
        fieldValue.value = []
        const attrValue = element.get(fieldKey).value
        attrValue.forEach((value, i) => {
          paramsGroupProps.atts = value
          paramsGroupProps.index = i
          fieldValue.value[i] = API.visualizeAttributes(element, api, paramsGroupProps, isNested, raw)
        })
        layoutAtts[fieldKey] = fieldValue
      } else if ((typeName === 'htmleditor' && (!options || !options.inline)) || (isNested && options && options.inline)) {
        layoutAtts[fieldKey] = (
          <div className='vcvhelper' data-vcvs-html={value} dangerouslySetInnerHTML={{ __html: value }} />
        )
      } else if (typeName === 'dropdown' && !value && Object.prototype.hasOwnProperty.call(options, 'global') && options.global) {
        let globalOptions
        if (typeof window[options.global] === 'function') {
          globalOptions = window[options.global]()
        } else {
          globalOptions = window[options.global]
        }
        if (globalOptions && globalOptions.length) {
          layoutAtts[fieldKey] = globalOptions[0].value
        }
      } else {
        layoutAtts[fieldKey] = value
      }
    })
    return layoutAtts
  }
}

const getChildren = (groups, allElements) => {
  const result = []
  allElements.forEach((element) => {
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
  const allElements = API.list.elements()
  allElements.forEach((element) => {
    const containerFor = element.containerFor()
    const tag = element.get('tag')
    if (containerFor.length && containerFor.indexOf('General') < 0) {
      containerRelations[tag] = getChildren(containerFor, allElements)
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
