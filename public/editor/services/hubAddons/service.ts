import vcCake from 'vc-cake'

const dataManager = vcCake.getService('dataManager')

const addons = dataManager.get('hubGetAddons')

interface AddonData {
  bundlePath?: string,
  dependencies?: {
    [item:string]: string
  },
  settings: {
    metaAddonImageUrl?: string,
    metaDescription?: string,
    metaPreviewUrl?: string,
    metaThumbnailUr?: string,
    name: string
  },
  tag: string
}

const API = {
  all: () => {
    return addons
  },
  add: (data:AddonData) => {
    addons[data.tag] = data
  },
  get: (tag:string) => {
    return addons && addons[tag] ? addons[tag] : null
  }
}

vcCake.addService('hubAddons', API)
