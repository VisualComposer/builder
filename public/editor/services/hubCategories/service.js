import vcCake from 'vc-cake'
import { sortingTool } from './lib/tools'
import lodash from 'lodash'

const hubElementsStorage = vcCake.getStorage('hubElements')

// TODO: Fix if element is in many categories
let categoryByTag = (tag) => {
  const categories = hubElementsStorage.state('categories').get()
  const key = Object.keys(categories).find((cat) => {
    const category = categories[ cat ]
    return category.elements && category.elements.indexOf(tag) > -1
  })
  return categories[ key ]
}

const API = {
  all: () => {
    return hubElementsStorage.state('categories').get()
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
        cookElements.push(cookElement.toJS(true, false))
      }
    })

    return cookElements.sort(sortingTool)
  }),
  getElementIcon: (tag, dark = false) => {
    let category = categoryByTag(tag)
    let allCategories = API.all()
    if (dark) {
      return category && category.iconDark ? category.iconDark : allCategories.Misc.iconDark
    }

    return category && category.icon ? category.icon : allCategories.Misc.icon
  },
  getElementCategoryName: (tag) => {
    const categories = hubElementsStorage.state('categories').get()
    return Object.keys(categories).find((cat) => {
      const category = categories[ cat ]
      return category.elements && category.elements.includes(tag)
    })
  }
}

vcCake.addService('hubCategories', API)
