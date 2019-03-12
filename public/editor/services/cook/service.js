import lodash from 'lodash'
import { addService, getService, getStorage } from 'vc-cake'

import { buildSettingsObject } from './lib/tools'
import elementSettings from './lib/element-settings'
import attributeManager from './lib/attribute-manager'
import CookElement from './lib/cookElement'
import Element from './lib/element'

const DocumentData = getService('document')
const hubElementsStorage = getStorage('hubElements')

const API = {
  get (data) {
    if (!data || !data.tag) {
      console.error('No element Tag provided', data)
      return null
    }
    return new CookElement(data)
  },
  buildSettingsElement (data, settings, cssSettings) {
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
  list: {
    settings (sortSelector = [ 'name' ]) {
      let list = elementSettings.list()

      return lodash.sortBy(list.map((item) => {
        let elementValues = buildSettingsObject(item.settings)
        return API.get(elementValues).toJS()
      }), sortSelector)
    }
  },
  getChildrenTags: function (tag) {
    const categories = hubElementsStorage.state('categories')
    const element = this.get({ tag: tag })
    let groups = element.containerFor()
    let children = []
    groups.forEach((group) => {
      if (categories[ group ] && categories[ group ].elements) {
        children = [ ...children, ...categories[ group ].elements ]
      }
    })
    return children
  }
}
addService('cook', API)
