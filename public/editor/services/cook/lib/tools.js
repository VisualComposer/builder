import {default as attributeManager} from './attribute-manager'

export function buildSettingsObject (settings) {
  return Object.keys(settings).reduce((data, k) => {
    data[ k ] = settings[ k ].value || undefined
    return data
  }, {})
}
export function createKey () {
  var i, random
  var uuid = ''

  for (i = 0; i < 8; i++) {
    random = Math.random() * 16 | 0
    if (i === 8 || i === 12 || i === 16 || i === 20) {
      uuid += '-'
    }
    uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random))
      .toString(16)
  }

  return uuid
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
