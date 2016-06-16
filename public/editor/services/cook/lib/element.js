/*eslint jsx-quotes: [2, "prefer-double"]*/
import React from 'react'
import {format} from 'util'
import {renderToStaticMarkup} from 'react-dom/server'

import {default as elementSettings} from './element-settings'
import {default as elementComponent} from './element-component'

import {createKey, getAttributeType} from './tools'

const elData = Symbol('element data')
const elComponent = Symbol('element component')

export default class Element {
  constructor (data) {
    let { id = createKey(), parent = false, order, ...attr } = data
    let elSettings = elementSettings && elementSettings.get ? elementSettings.get(data.tag) : false
    // Split on separate symbols
    Object.defineProperty(this, elData, {
      writable: true,
      value: {
        id: id,
        parent: parent,
        data: attr,
        order: order,
        settings: elSettings && elSettings.settings ? elSettings.settings : {},
        getAttributeType: function (k) {
          return getAttributeType(k, this.settings)
        }
      }
    })
    Object.defineProperty(this, elComponent, {
      value: {
        tag: data.tag,
        add (Component) {
          elementComponent.add(this.tag, Component)
        },
        get () {
          return elementComponent.get(this.tag)
        },
        has () {
          return elementComponent.has(this.tag)
        }
      }
    })
  }

  get (k) {
    if ([ 'id', 'parent', 'order' ].indexOf(k) > -1) {
      return this[ elData ][ k ]
    }
    let { type, settings } = this[ elData ].getAttributeType(k)
    return type && settings ? type.getValue(settings, this[ elData ].data, k) : undefined
  }

  settings (k) {
    return this[ elData ].getAttributeType(k)
  }

  set (k, v) {
    let { type, settings } = this[ elData ].getAttributeType(k)
    if (type && settings) {
      this[ elData ].data = type.setValue(settings, this[ elData ].data, k, v)
    }
    return this[ elData ].data[ k ]
  }

  render (content) {
    if (!this[ elComponent ].has()) {
      elementSettings.get(this[ elComponent ].tag).component(this[ elComponent ])
    }
    let Component = this[ elComponent ].get()
    let props = this.toJS()
    props.key = this[ elData ].id
    props.id = this[ elData ].id
    props[ 'data-vc-element' ] = this[ elData ].id
    props.content = content
    return React.createElement(Component, props)
  }

  static create (tag) {
    return new Element({ tag: tag })
  }

  toJS (rawData) {
    let data = {}
    for (let k of Object.keys(this[ elData ].settings)) {
      if (rawData) {
        let { type } = this[ elData ].getAttributeType(k)
        data[ k ] = type.getRawValue(this[ elData ].data, k)
      } else {
        data[ k ] = this.get(k)
      }
    }
    data.id = this[ elData ].id
    data.parent = this[ elData ].parent
    data.order = this[ elData ].order
    return data
  }

  field (k, updater) {
    let { type, settings } = this[ elData ].getAttributeType(k)
    let Component = type.component
    if (!Component) {
      return null
    }
    let label = ''
    if (!settings) {
      throw new Error(format('Wrong attribute %s', k))
    }
    if (!type) {
      throw new Error(format('Wrong type of attribute %s', k))
    }
    if (typeof (settings.options) !== 'undefined' && typeof (settings.options.label) === 'string') {
      label = (<span className="vc_ui-form-group-heading">{settings.options.label}</span>)
    }
    let description = ''
    if (typeof (settings.options) !== 'undefined' && typeof (settings.options.description) === 'string') {
      description = (<p className="vc_ui-form-helper">{settings.options.description}</p>)
    }
    return (
      <div className="vc_ui-form-group" key={'form-group-' + k}>
        {label}
        <Component
          fieldKey={k}
          options={settings.options}
          value={type.getRawValue(this[elData].data, k)}
          updater={updater}
        />
        {description}
      </div>
    )
  }

  renderHTML (content) {
    return renderToStaticMarkup(this.render(content))
  }

  publicKeys () {
    let data = []
    for (let k of Object.keys(this[ elData ].settings)) {
      var attrSettings = this[ elData ].settings[ k ]
      if (attrSettings.access === 'public') {
        data.push(k)
      }
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
    var group = this.get('relatedTo')
    if (group && group.has && group.has(keys)) {
      return true
    }
    return false
  }

  /**
   * Get container for value from group
   * @returns [] - list of
   */
  containerFor () {
    var group = this.get('containerFor')
    if (group && group.each) {
      return group.each()
    }
    return []
  }

  editFormTabs () {
    var group = this.get('editFormTabs')
    if (group && group.each) {
      return group.each(this.editFormTabsIterator.bind(this))
    }
    return []
  }

  editFormTabsIterator (item) {
    return {
      key: item,
      value: this.get(item),
      data: this.settings(item)
    }
  }

  editFormTabParams (tabName) {
    var group = this.get(tabName)
    if (group && group.each) {
      return group.each(this.editFormTabsIterator.bind(this))
    }
    return []
  }
}
