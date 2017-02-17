import vcCake from 'vc-cake'

const API = {
  all: () => {
    return window.VCV_HUB_GET_CATEGORIES()
  },
  get: (key) => {
    return API.all()[ key ]
  }
}

vcCake.addService('hubCategories', API)
