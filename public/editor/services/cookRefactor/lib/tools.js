import {default as attributeManager} from './attribute-manager'

export function buildSettingsObject (settings) {
  return Object.keys(settings).reduce((data, k) => {
    data[ k ] = settings[ k ].value || undefined
    return data
  }, {})
}
export function getAttributeType (k, settings) {
  let data = { type: false, settings: false }
  let attrSettings = settings[ k ]
  if (attrSettings && attrSettings.type) {
    data.settings = attrSettings
    data.type = attributeManager.get(attrSettings.type) || false
  }
  return data
}
