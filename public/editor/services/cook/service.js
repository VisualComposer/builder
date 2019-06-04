import lodash from 'lodash'
import { addService, getService, getStorage } from 'vc-cake'

import { buildSettingsObject } from './lib/tools'
import elementSettings from './lib/element-settings'
import attributeManager from './lib/attribute-manager'
import Element from './lib/element'

const DocumentData = getService('document')
const hubElementsStorage = getStorage('hubElements')
let containerRelations = {}

const API = {
  get (data) {
    if (!data || !data.tag) {
      console.error('No element Tag provided', data)
      return null
    }
    return new Element(data)
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
  getContainerChildren (tag) {
    if (containerRelations.hasOwnProperty(tag)) {
      return containerRelations[ tag ]
    } else {
      return []
    }
  },
  getParentCount: (id, count = 0) => {
    let element = DocumentData.get(id)
    let parent = element.parent
    if (parent) {
      let parentElement = DocumentData.get(parent)
      count++
      return API.getParentCount(parentElement.id, count)
    }

    return count
  }
}

const getChildren = (groups) => {
  let result = []
  const allElements = API.list.settings()
  allElements.forEach((settings) => {
    let element = API.get(settings)
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
  const allElements = API.list.settings()
  allElements.forEach((settings) => {
    const element = API.get(settings)
    const containerFor = element.containerFor()
    const tag = element.get('tag')
    if (containerFor.length && containerFor.indexOf('General') < 0) {
      containerRelations[ tag ] = getChildren(containerFor, allElements)
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
