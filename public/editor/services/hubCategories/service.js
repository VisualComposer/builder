import vcCake from 'vc-cake'
import { sortingTool } from './lib/tools'
import lodash from 'lodash'

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
  getSortedElements: lodash.memoize((category) => {
    let cook = vcCake.getService('cook')
    let allCategories = API.all()
    let elements = []
    let setElements = (cat) => {
      let category = API.get(cat)
      elements = elements.concat(category && category.elements ? category.elements : [])
    }
    if (category) {
      setElements(category)
    } else {
      Object.keys(allCategories).forEach(setElements)
    }
    // Make unique
    elements = [ ...new Set(elements) ]

    // Get sorted cook elements
    let cookElements = []
    elements.forEach((element) => {
      let cookElement = cook.get({ tag: element })
      if (cookElement) {
        cookElements.push(cookElement.toJS())
      }
    })

    return cookElements.sort(sortingTool)
  }),
  getElementIcon: (tag, dark = false) => {
    let category = categoryByTag(tag)
    if (dark) {
      return category && category.iconDark ? category.iconDark : ''
    }

    return category && category.icon ? category.icon : ''
  }
}

vcCake.addService('hubCategories', API)
