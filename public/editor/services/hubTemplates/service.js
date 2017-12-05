import vcCake from 'vc-cake'

let templates
if (vcCake.env('HUB_DOWNLOAD_SPINNER')) {
  templates = window.VCV_HUB_GET_TEMPLATES_TEASER()
}

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
