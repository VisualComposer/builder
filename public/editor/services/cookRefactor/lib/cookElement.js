/* eslint jsx-quotes: [2, "prefer-double"] */
import React from 'react'
import vcCake from 'vc-cake'
import PropTypes from 'prop-types'

import Element from './element'
import { default as elementSettings } from './element-settings'
import { default as elementComponent } from './element-component'
import { getAttributeType } from '../../../../../tools'

const createKey = vcCake.getService('utils').createKey
const elData = Symbol('element data')
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
    let { id = createKey(), parent = false, tag, order, customHeaderTitle, hidden, ...attr } = data
    attr.tag = tag
    attr.id = id

    let elements = hubElementService().all()
    let element = elements ? elements[ tag ] : null

    if (!element) {
      vcCake.env('debug') === true && console.warn(`Element ${tag} is not registered in system`)
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
      elementSettings.get(this[ elData ].tag) && elementSettings.get(this[ elData ].tag).component(this[ elComponent ])
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
}
