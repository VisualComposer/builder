import vcCake from 'vc-cake'

let templates = window.VCV_HUB_GET_TEMPLATES_TEASER && window.VCV_HUB_GET_TEMPLATES_TEASER()

const API = {
  all: () => {
    return templates
  },
  add: (data) => {
    templates[ data.tag ] = data
  },
  get: (tag) => {
    return templates && templates[tag] ? templates[tag] : null
  }
}

vcCake.addService('hubTemplates', API)
