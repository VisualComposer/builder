import { getStorage, getService } from 'vc-cake'
const assets = getStorage('assets')
const storageState = assets.state('jsLibs')
const cook = getService('cook')

const getElementLibNames = (id, element, callback) => {
  let cookElement = cook.get(element)
  let data = {
    id: id,
    assetLibraries: []
  }
  let cookGetAll = cookElement.getAll()
  let elementAttributes = Object.keys(cookGetAll)
  elementAttributes.forEach((attrKey) => {
    let attributeSettings = cookElement.settings(attrKey)
    if (attributeSettings.type.getAttributeLibs) {
      let attributeValue = cookElement.get(attrKey, true)
      let attributeLibs = attributeSettings.type.getAttributeLibs(attributeValue)
      if (attributeLibs && attributeLibs.length) {
        data.assetLibraries.push(...attributeLibs)
      }
    }
    if (attributeSettings.settings.type === 'element') {
      let value = cookElement.get(attrKey)
      let innerElement = cook.get(value)
      let innerElementValue = innerElement.toJS()
      callback(innerElementValue.id, innerElementValue)
    }
  })
  return data
}

export default class AssetsLibraryManager {
  add (id, element) {
    let data = getElementLibNames(id, element, this.add.bind(this))
    let stateElements = storageState.get() && storageState.get().elements ? storageState.get().elements : []
    stateElements.push(data)
    storageState.set({ elements: stateElements })
  }

  edit (id, element) {
    let data = getElementLibNames(id, element, this.edit.bind(this))
    let stateElements = storageState.get() && storageState.get().elements ? storageState.get().elements : []
    let stateElementIndex = stateElements.findIndex((element) => {
      return element.id === id
    })
    if (stateElementIndex < 0) {
      stateElements.push(data)
    } else {
      stateElements[ stateElementIndex ].id = data.id
      stateElements[ stateElementIndex ].assetLibraries = data.assetLibraries
    }
    storageState.set({ elements: stateElements })
  }

  remove (id) {
    let stateElements = storageState.get()
    if (stateElements && stateElements.elements) {
      let newElements = stateElements.elements.filter((element) => {
        return element.id !== id
      })
      storageState.set({ elements: newElements })
    }
  }
}
