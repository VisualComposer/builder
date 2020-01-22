import { getStorage, getService } from 'vc-cake'

const assets = getStorage('assets')
const storageState = assets.state('jsLibs')
const cook = getService('cook')

const getLibsFromAttribute = (attributeSettings, cookElement, attrKey, value) => {
  let assetLibraries = []
  if (attributeSettings.type.getAttributeLibs) {
    const attributeLibs = attributeSettings.type.getAttributeLibs(value)
    if (attributeLibs && attributeLibs.length) {
      assetLibraries.push(...attributeLibs)
    }
  }
  if (attributeSettings.settings.type === 'element') {
    const innerElement = cook.get(value)
    const innerElementValue = innerElement.toJS()
    assetLibraries = assetLibraries.concat(getElementLibNames(innerElementValue.id, innerElementValue).assetLibraries)
  }
  if (attributeSettings.settings.type === 'paramsGroup') {
    const attribute = cookElement.settings(attrKey)
    // TODO: Fix paramsGroup inside paramsGroup (disable this if)
    if (attribute && attribute.settings && attribute.settings.options && attribute.settings.options.settings) {
      const attributeSettings = cookElement.settings(attrKey).settings.options.settings
      const elementSettingsAttributes = Object.keys(attributeSettings)
      elementSettingsAttributes.forEach((settingsKey) => {
        const innerAttributeSettings = cookElement.settings(settingsKey, attributeSettings)
        value.value.forEach((paramGroupItemValue) => {
          const innerValue = paramGroupItemValue[settingsKey]
          const settingsLibs = getLibsFromAttribute(innerAttributeSettings, cookElement, settingsKey, innerValue)
          assetLibraries = assetLibraries.concat(settingsLibs)
        })
      })
    }
  }

  return assetLibraries
}

const getElementLibNames = (id, element) => {
  const cookElement = cook.get(element)
  const data = {
    id: id,
    assetLibraries: []
  }
  const cookGetAll = cookElement.getAll()
  const elementAttributes = Object.keys(cookGetAll)
  elementAttributes.forEach((attrKey) => {
    const attributeSettings = cookElement.settings(attrKey)
    const value = cookElement.get(attrKey)
    data.assetLibraries = data.assetLibraries.concat(getLibsFromAttribute(attributeSettings, cookElement, attrKey, value))
  })

  return data
}

const updateStorageState = (id, data) => {
  const stateElements = storageState.get() && storageState.get().elements ? storageState.get().elements : []
  const stateElementIndex = stateElements.findIndex((element) => {
    return element.id === id
  })
  if (stateElementIndex < 0) {
    stateElements.push(data)
  } else {
    stateElements[stateElementIndex].id = data.id
    stateElements[stateElementIndex].assetLibraries = data.assetLibraries
  }
  storageState.set({ elements: stateElements })
}

export default class AssetsLibraryManager {
  add (id, element) {
    const data = getElementLibNames(id, element)
    updateStorageState(id, data)
  }

  edit (id, element) {
    const data = getElementLibNames(id, element)
    updateStorageState(id, data)
  }

  remove (id) {
    const stateElements = storageState.get()
    if (stateElements && stateElements.elements) {
      const newElements = stateElements.elements.filter((element) => {
        return element.id !== id
      })
      storageState.set({ elements: newElements })
    }
  }
}
