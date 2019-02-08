/* eslint jsx-quotes: [2, "prefer-double"] */
import React from 'react'
import vcCake from 'vc-cake'
import lodash from 'lodash'
import PropTypes from 'prop-types'

import Element from './element'
import elementSettings from './element-settings'
import elementComponent from './element-component'
import { getAttributeType } from './tools'

const createKey = vcCake.getService('utils').createKey
const elData = 'element data'
const elComponent = Symbol('element component')

let _service = null
let hubElementService = () => {
  if (_service) {
    return _service
  }
  _service = vcCake.getService('hubElements')
  return _service
}

export default class CookElement extends Element {
  static propTypes = {
    tag: PropTypes.string.isRequired
  }

  init (data, dataSettings = {}) {
    let { id = createKey(), parent = false, tag, order, customHeaderTitle, hidden, metaElementAssets, ...attr } = data
    attr.tag = tag
    attr.id = id

    let elements = hubElementService().all()
    let element = elements ? elements[ tag ] : null

    if (!element) {
      vcCake.env('VCV_DEBUG') === true && console.warn(`Element ${tag} is not registered in system`, data)
      element = {
        settings: {
          metaDescription: '',
          metaPreviewUrl: '',
          metaThumbnailUrl: '',
          name: '--'
        }
      }
    }
    let metaSettings = element.settings
    let elSettings = elementSettings && elementSettings.get ? elementSettings.get(tag) : false
    // Split on separate symbols

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
        settings: elSettings && elSettings.settings ? elSettings.settings : {},
        cssSettings: elSettings && elSettings.cssSettings ? elSettings.cssSettings : {},
        metaElementAssets: metaElementAssets || {},
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

  getContentComponent () {
    if (!this[ elComponent ].has()) {
      let elSettings = elementSettings.get(this[ elData ].tag)
      if (vcCake.env('VCV_DEBUG') === true && (!elSettings || !elSettings.component)) {
        console.error('Component settings doesnt exists! Failed to get component', this[ elData ].tag, this[ elData ], elSettings, this[ elComponent ])
      }
      elSettings && elSettings.component && elSettings.component(this[ elComponent ])
    }
    return this[ elComponent ].get()
  }

  static create (tag) {
    return new CookElement({ tag: tag })
  }

  render (content, editor) {
    if (!this[ elComponent ].has()) {
      elementSettings.get(this[ elData ].tag).component(this[ elComponent ])
    }
    let ElementToRender = this[ elComponent ].get()
    let props = {}
    let editorProps = {}
    let atts = this.toJS(true, false)
    props.key = this[ elData ].id
    props.id = this[ elData ].atts && typeof this[ elData ].atts.metaCustomId !== 'undefined' ? this[ elData ].atts.metaCustomId : this[ elData ].id
    editorProps[ 'data-vc-element' ] = this[ elData ].id
    if (typeof editor === 'undefined' || editor) {
      props.editor = editorProps
    }
    props.atts = atts
    props.content = content

    return <ElementToRender {...props} />
  }
  toJS (raw = true, publicOnly = true) {
    let data = {}
    for (let k of Object.keys(this[ elData ].settings)) {
      let value = this.get(k, raw)
      if (value !== undefined) {
        data[ k ] = value
      }
    }
    data.id = this[ elData ].id
    data.tag = this[ elData ].tag
    data.name = this[ elData ].name
    data.metaThumbnailUrl = this[ elData ].metaThumbnailUrl
    data.metaPreviewUrl = this[ elData ].metaPreviewUrl
    data.metaDescription = this[ elData ].metaDescription
    data.metaAssetsPath = this[ elData ].metaAssetsPath
    data.metaElementPath = this[ elData ].metaElementPath
    data.metaBundlePath = this[ elData ].metaBundlePath
    data.metaElementAssets = this[ elData ].metaElementAssets
    if (this[ elData ].customHeaderTitle !== undefined) {
      data.customHeaderTitle = this[ elData ].customHeaderTitle
    }
    if (this[ elData ].hidden !== undefined) {
      data.hidden = this[ elData ].hidden
    } else {
      data.hidden = false
    }
    // JSON.parse can return '' for false entries
    if (this[ elData ].parent !== undefined && this[ elData ].parent !== '') {
      data.parent = this[ elData ].parent
    } else {
      data.parent = false
    }
    if (this[ elData ].order !== undefined) {
      data.order = this[ elData ].order
    } else {
      data.order = 0
    }
    if (publicOnly) {
      const publicKeys = this.getPublicKeys() // TODO: merge all data with public keys
      return lodash.pick(data, publicKeys)
    }
    return data
  }
}
