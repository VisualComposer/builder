import vcCake from 'vc-cake'

const addons = window.VCV_HUB_GET_ADDONS ? window.VCV_HUB_GET_ADDONS() : {}

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
