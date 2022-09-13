import vcCake from 'vc-cake'
import { sortingTool } from './lib/tools'
import lodash from 'lodash'

const hubElementsStorage = vcCake.getStorage('hubElements')
const cook = vcCake.getService('cook')

interface ElementData {
  name: string,
  tag: string,
  metaDescription: string,
  description: string,
  get: (name:string) => string
}

interface Api {
  get: (key: string) => {
    elements: string[],
    icon: string,
    iconDark: string,
    title: string,
  },
  getElementName: (elementData: ElementData) => string,
  getElementDescription: (elementData: ElementData) => string,
  // disabling lint, because element can be any element object with different properties
  getSortedElements: (elementTags: []) => any[], // eslint-disable-line
  getElementIcon: (tag: string, dark: boolean) => string,
  getElementCategoryName: (tag: string) => string | undefined
}

const API:Api = {
  get: (key:string) => {
    return hubElementsStorage.state('categories').get()[key]
  },
  getElementName: (elementData:ElementData) => {
    let elName = ''
    if (elementData.name) {
      elName = elementData.name
    } else if (typeof elementData.get === 'function') {
      if (elementData.get('name')) {
        elName = elementData.get('name')
      }
    } else if (elementData.tag) {
      const element = cook.get(elementData)
      if (element.get('name')) {
        elName = element.get('name')
      }
    }

    return elName.toString().toLowerCase()
  },
  getElementDescription: (elementData:ElementData) => {
    let elDescription = elementData.metaDescription || elementData.description || ''
    if (!elDescription && elementData.tag) {
      const element = cook.get(elementData)
      const cookElementDescription = element.get('metaDescription')
      if (cookElementDescription) {
        elDescription = cookElementDescription
      }
    }
    return elDescription.toLowerCase()
  },
  getSortedElements: lodash.memoize((elementTags:string[] = []) => {
    // disabling lint, because items inside array can be any element object with different properties
    const cookElements:any[] = [] // eslint-disable-line

    const hubElements = hubElementsStorage.state('elements').get()
    if (!elementTags.length) {
      elementTags = Object.keys(hubElements)
    }
    elementTags.forEach((tag:string) => {
      if (hubElements[tag] && !hubElements[tag].metaIsElementRemoved) {
        const cookElement = cook.get({ tag: tag })
        const elementObject = cookElement.toJS(true, false)
        const element = hubElements[tag]
        elementObject.thirdParty = Object.prototype.hasOwnProperty.call(element, 'thirdParty') && element.thirdParty === true
        delete elementObject.id
        elementObject.usageCount = hubElements[tag].usageCount
        elementObject.metaIsDefaultElement = hubElements[tag].metaIsDefaultElement
        cookElements.push(elementObject)
      }
    })

    return cookElements.sort(sortingTool)
  }),
  getElementIcon: lodash.memoize((tag, dark = false) => {
    const category = API.getElementCategoryName(tag)
    const allCategories = hubElementsStorage.state('categories').get()
    if (category && dark) {
      return allCategories[category] && allCategories[category].iconDark ? allCategories[category].iconDark : allCategories.Misc.iconDark
    }

    return category && allCategories[category] && allCategories[category].icon ? allCategories[category].icon : allCategories.Misc.icon
  }),
  getElementCategoryName: lodash.memoize((tag) => {
    const categories = hubElementsStorage.state('categories').get()
    return Object.keys(categories).find((cat) => {
      const category = categories[cat]
      return category.elements && category.elements.includes(tag)
    })
  })
}

vcCake.addService('hubElements', API)
