import vcCake from 'vc-cake'

const dataManager = vcCake.getService('dataManager')

const addons = dataManager.get('hubGetAddons')

const API = {
  all: () => {
    return addons
  },
  add: (data) => {
    addons[data.tag] = data
  },
  get: (tag) => {
    return addons && addons[tag] ? addons[tag] : null
  }
}

vcCake.addService('hubAddons', API)
