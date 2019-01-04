import { defaultsDeep } from 'lodash'
import { getStorage } from 'vc-cake'

let items = {}
export default {
  add (settings, componentCallback, cssSettings, modifierOnCreate) {
    let allElementsSettings = getStorage('hubElements').state('elements').get() || (window.VCV_HUB_GET_ELEMENTS ? window.VCV_HUB_GET_ELEMENTS() : {})
    let settingsCloneJsonString = JSON.stringify(settings)

    if (allElementsSettings[ settings.tag.value ]) {
      settingsCloneJsonString = settingsCloneJsonString.replace('[assetsPath]/', allElementsSettings[ settings.tag.value ].assetsPath).replace('[assetsPath]', allElementsSettings[ settings.tag.value ])
    }

    items[ settings.tag.value ] = {
      settings: JSON.parse(settingsCloneJsonString),
      component: componentCallback,
      cssSettings: cssSettings,
      modifierOnCreate: modifierOnCreate
    }
  },
  remove (tag) {
    delete items[ tag ]
  },
  get (tag) {
    return defaultsDeep({}, items[ tag ]) || null
  },
  findTagByName (name) {
    return Object.keys(items).find((key) => {
      return items[ key ].settings && items[ key ].settings.name && items[ key ].settings.name.value === name
    })
  },
  getAttributeType (tag, key) {
    let settings = items[ tag ].settings[ key ]
    return settings || undefined
  },
  all () {
    return items
  },
  list () {
    return Object.keys(items).map((k) => {
      return items[ k ]
    })
  }
}
