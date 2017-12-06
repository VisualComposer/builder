import vcCake from 'vc-cake'

const API = {
  all: () => {
    return window.VCV_HUB_GET_TEMPLATES_TEASER()
  },
  add: (data) => {
    window.VCV_HUB_GET_TEMPLATES_TEASER()[ data.tag ] = data
  },
  get: (tag) => {
    const templates = window.VCV_HUB_GET_TEMPLATES_TEASER()
    return templates && templates[tag] ? templates[tag] : null
  }
}

vcCake.addService('hubTemplates', API)
