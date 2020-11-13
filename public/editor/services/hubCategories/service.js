import vcCake from 'vc-cake'
import { sortingTool } from './lib/tools'
import lodash from 'lodash'

const hubElementsStorage = vcCake.getStorage('hubElements')

// TODO: Fix if element is in many categories
const categoryByTag = (tag) => {
  const categories = hubElementsStorage.state('categories').get()
  const key = Object.keys(categories).find((cat) => {
    const category = categories[cat]
    return category.elements && category.elements.indexOf(tag) > -1
  })
  return categories[key]
}

const API = {
  all: () => {
    return hubElementsStorage.state('categories').get()
  },
  get: (key) => {
    return API.all()[key]
  },
  getSortedElements: lodash.memoize((elements = []) => {
    const hubElements = hubElementsStorage.state('elements').get()
    const cook = vcCake.getService('cook')
    const allCategories = API.all()
    const setElements = (cat) => {
      const category = API.get(cat)
      elements = elements.concat(category && category.elements ? category.elements : [])
    }
    if (!elements.length) {
      Object.keys(allCategories).forEach(setElements)
    }
    // Make unique
    elements = [...new Set(elements)]

    // Get sorted cook elements
    const cookElements = []
    elements.forEach((element) => {
      if (hubElements[element]) {
        const cookElement = cook.get({ tag: element })
        if (cookElement) {
          const elementObject = cookElement.toJS(true, false)
          const elementHubElement = hubElements[elementObject.tag]
          elementObject.thirdParty = elementHubElement && Object.prototype.hasOwnProperty.call(elementHubElement, 'thirdParty') && elementHubElement.thirdParty === true
          delete elementObject.id
          elementObject.usageCount = hubElements[element].usageCount
          cookElements.push(elementObject)
        }
      }
    })
    return cookElements.sort(sortingTool)
  }),
  getElementIcon: (tag, dark = false) => {
    const category = categoryByTag(tag)
    const allCategories = API.all()
    if (dark) {
      return category && category.iconDark ? category.iconDark : allCategories.Misc.iconDark
    }

    return category && category.icon ? category.icon : allCategories.Misc.icon
  },
  getElementCategoryName: (tag) => {
    const categories = hubElementsStorage.state('categories').get()
    return Object.keys(categories).find((cat) => {
      const category = categories[cat]
      return category.elements && category.elements.includes(tag)
    })
  }
}

vcCake.addService('hubCategories', API)
