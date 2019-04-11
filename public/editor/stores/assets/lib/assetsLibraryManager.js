import { getStorage, getService } from 'vc-cake'

const assets = getStorage('assets')
const storageState = assets.state('jsLibs')
const cook = getService('cook')

const getLibsFromAttribute = (attributeSettings, cookElement, attrKey, value) => {
  let assetLibraries = []
  if (attributeSettings.type.getAttributeLibs) {
    let attributeLibs = attributeSettings.type.getAttributeLibs(value)
    if (attributeLibs && attributeLibs.length) {
      assetLibraries.push(...attributeLibs)
    }
  }
  if (attributeSettings.settings.type === 'element') {
    let innerElement = cook.get(value)
    let innerElementValue = innerElement.toJS()
    assetLibraries = assetLibraries.concat(getElementLibNames(innerElementValue.id, innerElementValue).assetLibraries)
  }
  if (attributeSettings.settings.type === 'paramsGroup') {
    let attributeSettings = cookElement.settings(attrKey).settings.options.settings
    let elementSettingsAttributes = Object.keys(attributeSettings)
    elementSettingsAttributes.forEach((settingsKey) => {
      let innerAttributeSettings = cookElement.settings(settingsKey, attributeSettings)
      value.value.forEach((paramGroupItemValue) => {
        let innerValue = paramGroupItemValue[ settingsKey ]
        const settingsLibs = getLibsFromAttribute(innerAttributeSettings, cookElement, settingsKey, innerValue)
        assetLibraries = assetLibraries.concat(settingsLibs)
      })
    })
  }

  return assetLibraries
}

const getElementLibNames = (id, element) => {
  let cookElement = cook.get(element)
  let data = {
    id: id,
    assetLibraries: []
  }
  let cookGetAll = cookElement.getAll()
  let elementAttributes = Object.keys(cookGetAll)
  elementAttributes.forEach((attrKey) => {
    let attributeSettings = cookElement.settings(attrKey)
    let value = cookElement.get(attrKey)
    data.assetLibraries = data.assetLibraries.concat(getLibsFromAttribute(attributeSettings, cookElement, attrKey, value))
  })

  return data
}

const updateStorageState = (id, data) => {
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

export default class AssetsLibraryManager {
  add (id, element) {
    let data = getElementLibNames(id, element)
    updateStorageState(id, data)
  }

  edit (id, element) {
    let data = getElementLibNames(id, element)
    updateStorageState(id, data)
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
