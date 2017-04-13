import {default as lodash} from 'lodash'
import {addService, getService} from 'vc-cake'

import {buildSettingsObject} from './lib/tools'
import {default as elementSettings} from './lib/element-settings'
import {default as attributeManager} from './lib/attribute-manager'
import CookElement from './lib/element'

const DocumentData = getService('document')

const API = {
  get (data) {
    if (!data || !data.tag) {
      console.error('No element Tag provided', data)
      return null
    }
    if (!window.VCV_HUB_GET_ELEMENTS()[data.tag]) {
      console.warn('Element is not registered in system', data)
      return null
    }

    return new CookElement(data)
  },
  getById (id) {
    let data = DocumentData.get(id)
    return data !== null ? this.get(data) : null
  },
  add (settings, componentCallback, cssSettings, javascriptCallback) {
    elementSettings.add(settings, componentCallback, cssSettings, javascriptCallback)
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
  getChildren: function (tag) {
    const element = this.get({tag: tag})
    let groups = element.containerFor()
    let allElements = this.list.settings()
    return allElements.filter((settings) => {
      let element = API.get(settings)
      return element ? element.relatedTo(groups) : false
    })
  }
}

addService('cook', API)
