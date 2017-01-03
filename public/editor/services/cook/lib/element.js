/* eslint jsx-quotes: [2, "prefer-double"] */
import React from 'react'
import vcCake from 'vc-cake'

import {default as elementSettings} from './element-settings'
import {default as elementComponent} from './element-component'
import {getAttributeType} from './tools'

const createKey = vcCake.getService('utils').createKey
const elData = Symbol('element data')
const elComponent = Symbol('element component')

class CookElement {
  constructor (data) {
    let { id = createKey(), parent = false, tag, order, ...attr } = data
    attr.tag = tag
    attr.id = id
    let elSettings = elementSettings && elementSettings.get ? elementSettings.get(tag) : false
    // Split on separate symbols
    Object.defineProperty(this, elData, {
      writable: true,
      value: {
        id: id,
        tag: tag,
        parent: parent,
        data: attr,
        order: order,
        settings: elSettings && elSettings.settings ? elSettings.settings : {},
        cssSettings: elSettings && elSettings.cssSettings ? elSettings.cssSettings : {},
        jsSettings: elSettings && elSettings.javascript ? elSettings.javascript : {},
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
    if ([ 'id', 'parent', 'order', 'cssSettings', 'settings', 'jsSettings' ].indexOf(k) > -1) {
      return this[ elData ][ k ]
    }
    let { type, settings } = this[ elData ].getAttributeType(k)

    return type && settings ? type.getValue(settings, this[ elData ].data, k, raw) : undefined
  }

  settings (k) {
    return this[ elData ].getAttributeType(k)
  }

  get data () {
    return this[ elData ].data
  }

  set (k, v) {
    let { type, settings } = this[ elData ].getAttributeType(k)
    if (type && settings) {
      this[ elData ].data = type.setValue(settings, this[ elData ].data, k, v)
    }
    return this[ elData ].data[ k ]
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

  toJS (raw = true) {
    let data = {}
    for (let k of Object.keys(this[ elData ].settings)) {
      let value = this.get(k, raw)
      if (value !== undefined) {
        data[ k ] = value
      }
    }
    data.id = this[ elData ].id
    if (this[ elData ].parent !== undefined) {
      data.parent = this[ elData ].parent
    }
    if (this[ elData ].order !== undefined) {
      data.order = this[ elData ].order
    }
    return data
  }
  render (content, editor) {
    if (!this[ elComponent ].has()) {
      elementSettings.get(this[ elData ].tag).component(this[ elComponent ])
    }
    let ElementToRender = this[ elComponent ].get()
    let props = {}
    let editorProps = {}
    let atts = this.toJS()
    props.key = this[ elData ].id
    props.id = typeof this[ elData ].atts.metaCustomId !== 'undefined' ? this[ elData ].atts.metaCustomId : this[ elData ].id
    editorProps[ 'data-vc-element' ] = this[ elData ].id
    if (typeof editor === 'undefined' || editor) {
      props.editor = editorProps
    }
    props.atts = atts
    props.content = content

    return <ElementToRender {...props} />
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
  getAll () {
    return this.toJS(false)
  }
}
CookElement.propTypes = {
  tag: React.PropTypes.string.isRequired
}

module.exports = CookElement
