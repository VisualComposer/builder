/* eslint jsx-quotes: [2, "prefer-double"] */
import React from 'react'
import vcCake from 'vc-cake'
import lodash from 'lodash'

import elementComponent from './element-component'
import DynamicElement from 'public/components/dynamicFields/dynamicElement'
import { getAttributeType } from './tools'

const { createKey } = vcCake.getService('utils')
const hubElementStorage = vcCake.getStorage('hubElements')
const assetsStorage = vcCake.getStorage('assets')
const elementSettingsStorage = vcCake.getStorage('elementSettings')
const elData = Symbol('element data')
const elComponent = Symbol('element component')
let cookApi = null
const hubElementsState = hubElementStorage.state('elements')

export default class Element {
  constructor (data, dataSettings = null, cssSettings = null, API) {
    this.init(data, dataSettings, cssSettings, API)
  }

  init (data, dataSettings = null, cssSettings = null, API) {
    let {
      id = createKey(),
      metaIsElementLocked = false,
      parent = false,
      tag,
      order,
      customHeaderTitle,
      hidden,
      metaElementAssets,
      ...attr
    } = data
    attr.tag = tag
    attr.id = id
    cookApi = API

    const elements = hubElementsState.get()
    let element = elements ? elements[tag] : null

    if (!element) {
      element = {
        settings: {
          metaDescription: '',
          metaPreviewUrl: '',
          metaThumbnailUrl: '',
          name: '--'
        }
      }
    }

    const metaSettings = element.settings

    let settings = {}
    const elSettings = elementSettingsStorage.action('get', tag) || null

    if (dataSettings) {
      for (const k in dataSettings) {
        if (Object.prototype.hasOwnProperty.call(dataSettings, k)) {
          const attrSettings = getAttributeType(k, dataSettings)
          if (Object.prototype.hasOwnProperty.call(attrSettings, 'settings')) {
            settings[k] = attrSettings.settings
            settings[k].attrSettings = attrSettings
          }
        }
      }
    } else {
      settings = elSettings ? elSettings.settings : {}
    }
    if (!cssSettings) {
      cssSettings = elSettings ? elSettings.cssSettings : {}
    }

    if (elSettings && elSettings.modifierOnCreate) {
      attr = elSettings.modifierOnCreate(lodash.defaultsDeep({}, attr))
    }

    Object.defineProperty(this, elData, {
      writable: true,
      value: {
        id: id,
        tag: tag,
        parent: parent,
        data: attr,
        name: metaSettings.name,
        metaThumbnailUrl: metaSettings.metaThumbnailUrl,
        metaPreviewUrl: metaSettings.metaPreviewUrl,
        metaDescription: metaSettings.metaDescription,
        metaAssetsPath: element.assetsPath,
        metaElementPath: element.elementPath,
        metaBundlePath: element.bundlePath,
        customHeaderTitle: customHeaderTitle || '',
        order: order,
        hidden: hidden,
        settings: settings || {},
        cssSettings: cssSettings || {},
        metaElementAssets: metaElementAssets || {},
        metaIsElementLocked: metaIsElementLocked,
        getAttributeType: function (k) {
          return getAttributeType(k, this.settings)
        }
      }
    })
    Object.defineProperty(this, elComponent, {
      value: {
        add (Component) {
          elementComponent.add(tag, Component)
        },
        get () {
          return elementComponent.get(tag)
        },
        has () {
          return elementComponent.has(tag)
        }
      }
    })
  }

  get (k, raw = false) {
    if (Object.keys(this[elData]).indexOf(k) > -1) {
      return this[elData][k]
    }
    const { type, settings } = this[elData].getAttributeType(k)

    return type && settings ? type.getValue(settings, this[elData].data, k, raw) : undefined
  }

  settings (k, settings = false) {
    if (settings !== false) {
      return getAttributeType(k, settings)
    }
    return this[elData].getAttributeType(k)
  }

  get data () {
    return this[elData].data
  }

  set (k, v) {
    if (['customHeaderTitle', 'parent', 'metaElementAssets'].indexOf(k) > -1) {
      this[elData][k] = v
      return this[elData][k]
    }
    const { type, settings } = this[elData].getAttributeType(k)
    if (type && settings) {
      this[elData].data = type.setValue(settings, this[elData].data, k, v)
    }
    return this[elData].data[k]
  }

  toJS (raw = true, publicOnly = true) {
    const data = {}
    for (const k of Object.keys(this[elData].settings)) {
      const value = this.get(k, raw)
      if (value !== undefined) {
        data[k] = value
      }
    }
    data.id = this[elData].id
    data.tag = this[elData].tag
    data.name = this[elData].name
    data.metaThumbnailUrl = this[elData].metaThumbnailUrl
    data.metaPreviewUrl = this[elData].metaPreviewUrl
    data.metaDescription = this[elData].metaDescription
    data.metaAssetsPath = this[elData].metaAssetsPath
    data.metaElementPath = this[elData].metaElementPath
    data.metaBundlePath = this[elData].metaBundlePath
    data.metaElementAssets = this[elData].metaElementAssets
    data.metaIsElementLocked = this[elData].metaIsElementLocked
    data.metaReplaceCategory = this[elData].metaReplaceCategory

    if (this[elData].customHeaderTitle !== undefined) {
      data.customHeaderTitle = this[elData].customHeaderTitle
    }
    if (this[elData].hidden !== undefined) {
      data.hidden = this[elData].hidden
    } else {
      data.hidden = false
    }
    // JSON.parse can return '' for false entries
    if (this[elData].parent !== undefined && this[elData].parent !== '') {
      data.parent = this[elData].parent
    } else {
      data.parent = false
    }
    if (this[elData].order !== undefined) {
      data.order = this[elData].order
    } else {
      data.order = 0
    }
    if (publicOnly) {
      const publicKeys = this.getPublicKeys() // TODO: merge all data with public keys
      return lodash.pick(data, publicKeys)
    }
    return data
  }

  /**
   * Get all fields as groups: if group in group
   * Lazy list
   *
   * @param keys
   */
  relatedTo (keys) {
    const group = this.get('relatedTo')
    return group && group.has && group.has(keys)
  }

  /**
   * Get container for value from group
   * @returns [] - list of
   */
  containerFor () {
    const group = this.get('containerFor')
    if (group && group.each) {
      return group.each()
    }

    return []
  }

  /**
   * Get all attributes using getter of attributes types
   */
  getAll (onlyPublic = true) {
    return this.toJS(false, onlyPublic)
  }

  filter (callback) {
    return Object.keys(this[elData].settings).filter((key) => {
      const settings = this[elData].settings[key]
      const value = this.get(key)
      return callback(key, value, settings)
    })
  }

  getPublicKeys () {
    const publicKeys = [
      'id',
      'order',
      'parent',
      'tag',
      'customHeaderTitle',
      'metaAssetsPath',
      'hidden',
      'metaElementAssets',
      'metaIsElementLocked'
    ]
    return publicKeys.concat(this.filter((key, value, settings) => {
      return settings.access === 'public'
    }))
  }

  getName () {
    return this.get('customHeaderTitle') || this.get('name')
  }

  getContentComponent () {
    if (!this[elComponent].has()) {
      const elSettings = elementSettingsStorage.action('get', this[elData].tag)

      if (vcCake.env('VCV_DEBUG') === true && (!elSettings || !elSettings.component)) {
        console.error('Component settings doesnt exists! Failed to get component', this[elData].tag, this[elData], elSettings, this[elComponent])
      }
      elSettings && elSettings.component && elSettings.component(this[elComponent])
    }
    return this[elComponent].get()
  }

  static create (tag) {
    return new Element({ tag: tag })
  }

  render (content, editor, inner = true) {
    if (!this[elComponent].has()) {
      elementSettingsStorage.action('get', this[elData].tag).component(this[elComponent])
    }
    const ElementToRender = this[elComponent].get()
    const props = {}
    const editorProps = {}
    const atts = this.getAll()
    props.key = this[elData].id + '-' + this[elData].tag
    props.id = this[elData].atts && typeof this[elData].atts.metaCustomId !== 'undefined' ? this[elData].atts.metaCustomId : this[elData].id
    editorProps['data-vc-element'] = this[elData].id
    if (typeof editor === 'undefined' || editor) {
      props.editor = editorProps
    }
    props.atts = cookApi.visualizeAttributes(cookApi.get(atts), false, false, true)
    props.rawAtts = atts
    props.content = content
    if (inner) {
      assetsStorage.trigger('updateInnerElementByData', atts)
    }

    return (
      <DynamicElement
        key={this[elData].id + '-' + this[elData].tag} // key must be unique to call unmount on each update & replace
        cookApi={cookApi}
        cookElement={this}
        element={this.getAll()}
        elementToRender={ElementToRender}
        elementProps={{ ...props }}
        inner={inner}
      />
    )
  }
}
