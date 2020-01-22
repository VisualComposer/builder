import { defaultsDeep } from 'lodash'
import { getStorage } from 'vc-cake'
import { getAttributeType } from './tools'

const fieldOptionsStorage = getStorage('fieldOptions')

const items = {}
export default {
  add (settings, componentCallback, cssSettings, modifierOnCreate) {
    const allElementsSettings = getStorage('hubElements').state('elements').get() || (window.VCV_HUB_GET_ELEMENTS ? window.VCV_HUB_GET_ELEMENTS() : {})
    let settingsCloneJsonString = JSON.stringify(settings)

    if (allElementsSettings[settings.tag.value]) {
      settingsCloneJsonString = settingsCloneJsonString.replace('[assetsPath]/', allElementsSettings[settings.tag.value].assetsPath).replace('[assetsPath]', allElementsSettings[settings.tag.value])
    }

    const dataSettings = JSON.parse(settingsCloneJsonString)

    // Change elements initial values from storage
    const elementInitialValues = fieldOptionsStorage.state('elementInitialValue').get()
    if (elementInitialValues) {
      const currentElementValues = elementInitialValues[dataSettings.tag.value]
      if (dataSettings.tag.value && currentElementValues) {
        Object.keys(currentElementValues).forEach((attrKey) => {
          if (dataSettings[attrKey] && Object.prototype.hasOwnProperty.call(dataSettings[attrKey], 'value')) {
            dataSettings[attrKey].value = currentElementValues[attrKey]
          }
        })
      }
    }

    for (const k in dataSettings) {
      if (Object.prototype.hasOwnProperty.call(dataSettings, k)) {
        const attrSettings = getAttributeType(k, dataSettings)
        dataSettings[k].attrSettings = attrSettings
      }
    }

    items[settings.tag.value] = {
      settings: dataSettings,
      component: componentCallback,
      cssSettings: cssSettings,
      modifierOnCreate: modifierOnCreate
    }
  },
  remove (tag) {
    delete items[tag]
  },
  get (tag) {
    return items[tag] ? defaultsDeep({}, items[tag]) : null
  },
  findTagByName (name) {
    return Object.keys(items).find((key) => {
      return items[key].settings && items[key].settings.name && items[key].settings.name.value === name
    })
  },
  getAttributeType (tag, key) {
    const settings = items[tag].settings[key]
    return settings || undefined
  },
  all () {
    return items
  },
  list () {
    return Object.keys(items).map((k) => {
      return items[k]
    })
  }
}
