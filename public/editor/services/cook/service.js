import {default as lodash} from 'lodash'
import {addService, getService} from 'vc-cake'

import {buildSettingsObject} from './lib/tools'
import {default as elementSettings} from './lib/element-settings'
import {default as attributeManager} from './lib/attribute-manager'
import {default as Element} from './lib/element'

const documentManager = getService('document')

addService('cook', {
  get (data) {
    return data && data.tag ? new Element(data) : undefined
  },
  getById (id) {
    let data = documentManager.get(id)
    return data !== null ? this.get(data) : undefined
  },
  add (settings, componentCallback, cssSettings, javascriptCallback) {
    elementSettings.add(settings, componentCallback, cssSettings, javascriptCallback)
  },
  getTagByName (name) {
    return elementSettings.findTagByName(name)
  },
  attributes: {
    add (name, component, settings) {
      attributeManager.add(name, component,
        lodash.defaults((typeof settings === 'object' ? settings : {}), { setter: null, getter: null }))
    },
    remove (name) {
      delete attributeManager.items[ name ]
    },
    get (name) {
      var attributeElement = attributeManager.get(name)
      if (attributeElement) {
        return attributeElement
      }
      return null
    }
  },
  list: {
    settings (sortSelector = [ 'name' ]) {
      var list = elementSettings.list()
      return lodash.sortBy(list.map((item) => {
        return buildSettingsObject(item.settings)
      }), sortSelector)
    }
  }
})
