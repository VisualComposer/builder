import { getStorage, getService } from 'vc-cake'
import store from 'public/editor/stores/store'
import { notificationAdded } from 'public/editor/stores/notifications/slice'

const elementsStorage = getStorage('elements')
const documentManager = getService('document')
const cook = getService('cook')
const dataManager = getService('dataManager')

const localizations = dataManager.get('localizations')
const limitTexts = {
  elementLimit1: localizations.onlyOneElementCanBeAddedToPage || 'Only one %element element can be added to the page.',
  elementLimit2: localizations.onlyTwoElementsCanBeAddedToPage || 'Only two %element elements can be added to the page.',
  elementLimit3: localizations.onlyThreeElementsCanBeAddedToPage || 'Only three %element elements can be added to the page.',
  elementLimit4: localizations.onlyFourElementsCanBeAddedToPage || 'Only four %element elements can be added to the page.',
  elementLimit5: localizations.onlyFiveElementsCanBeAddedToPage || 'Only five %element elements can be added to the page.',
  elementLimitDefault: localizations.elementLimitDefaultText || 'Only %count %element elements can be added to the page.'
}

const triggerNotification = (type, elementName, limit) => {
  let limitText = limitTexts.elementLimitDefault
  if (limit < 6) {
    limitText = limitTexts[`elementLimit${limit}`]
  } else {
    limitText = limitText.replace('%count', limit)
  }
  limitText = limitText.replace('%element', elementName)

  store.dispatch(notificationAdded({
    type: type,
    text: limitText,
    time: 5000,
    showCloseButton: true
  }))
}

const getElementExceededLimitStatus = (element) => {
  const limitData = {}
  if (Object.prototype.hasOwnProperty.call(element, 'metaElementLimit')) {
    const limit = parseInt(element.metaElementLimit)
    const limitedElements = documentManager.getByTag(element.tag) || {}
    if (limit > 0 && Object.keys(limitedElements).length >= limit) {
      limitData.hasExceeded = true
      limitData.limit = limit
    }
  }
  return limitData
}

elementsStorage.registerAction('beforeAdd', (element) => {
  const elementLimitData = getElementExceededLimitStatus(element)
  if (elementLimitData.hasExceeded) {
    const cookElement = cook.get(element)
    triggerNotification('error', cookElement.get('name'), elementLimitData.limit)
    return true
  }
  return false
})

elementsStorage.registerAction('beforeClone', (elementID) => {
  const element = documentManager.get(elementID)
  const elementLimitData = getElementExceededLimitStatus(element)
  if (elementLimitData.hasExceeded) {
    const cookElement = cook.get(element)
    triggerNotification('error', cookElement.get('name'), elementLimitData.limit)
    return true
  }
  return false
})
