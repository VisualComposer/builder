import vcCake from 'vc-cake'

// TODO: Fix if element is in many categories
let categoryByTag = (tag) => {
  let key = Object.keys(window.VCV_HUB_GET_CATEGORIES()).find((cat) => {
    let category = window.VCV_HUB_GET_CATEGORIES()[ cat ]
    return category.elements && category.elements.indexOf(tag) > -1
  })
  return window.VCV_HUB_GET_CATEGORIES()[ key ]
}

const API = {
  all: () => {
    return window.VCV_HUB_GET_CATEGORIES()
  },
  get: (key) => {
    return API.all()[ key ]
  },
  getElementIcon (tag, dark = false) {
    let category = categoryByTag(tag)
    if (dark) {
      return category && category.iconDark ? category.iconDark : ''
    }

    return category && category.icon ? category.icon : ''
  }
}

vcCake.addService('hubCategories', API)
