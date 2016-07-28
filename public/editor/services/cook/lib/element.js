/*eslint jsx-quotes: [2, "prefer-double"]*/
import React from 'react'
import vcCake from 'vc-cake'
import {format} from 'util'
import {renderToStaticMarkup} from 'react-dom/server'

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
      elementSettings.get(this[ elData ].tag).component(this[ elComponent ])
    }
    let ElementToRender = this[ elComponent ].get()
    let props = this.toJS()
    props.key = this[ elData ].id
    props.id = this[ elData ].id
    props[ 'data-vc-element' ] = this[ elData ].id
    props.content = content
    return <ElementToRender {...props} />
  }

  static create (tag) {
    return new CookElement({ tag: tag })
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
      label = (<span className="vcv-ui-form-group-heading">{settings.options.label}</span>)
    }
    let description = ''
    if (typeof (settings.options) !== 'undefined' && typeof (settings.options.description) === 'string') {
      description = (<p className="vcv-ui-form-helper">{settings.options.description}</p>)
    }
    return (
      <div className="vcv-ui-form-group" key={'form-group-' + k}>
        {label}
        <Component
          key={k + this.get('id')}
          fieldKey={k}
          options={settings.options}
          value={type.getRawValue(this[ elData ].data, k)}
          updater={updater}
        />
        {description}
      </div>
    )
  }

  renderHTML (content) {
    return renderToStaticMarkup(this.render(content))
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
CookElement.propTypes = {
  tag: React.PropTypes.string.isRequired
}

module.exports = CookElement
