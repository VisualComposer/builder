import { add, getStorage, getService } from 'vc-cake'
import { getPopupDataFromElement } from 'public/tools/popup'
import store from 'public/editor/stores/store'
import { popupAddInProgressSet } from 'public/editor/stores/popup/slice'

const elementsStorage = getStorage('elements')
const dataProcessor = getService('dataProcessor')
const cook = getService('cook')

const addPopupHtml = (id) => {
  store.dispatch(popupAddInProgressSet(true))
  const contentWindow = window.document.querySelector('.vcv-layout-iframe').contentWindow
  const documentBody = contentWindow.document.body
  const domId = `vcv-popup-${id}`

  if (documentBody.querySelector(`#${domId}`)) {
    store.dispatch(popupAddInProgressSet(false))
    return
  }

  dataProcessor.appAdminServerRequest({
    'vcv-action': 'popupBuilder:getData:adminNonce',
    'vcv-source-id': id
  }).then((requestData) => {
    if (requestData && typeof requestData === 'string') {
      const popupContainer = contentWindow.document.createElement('div')
      popupContainer.id = domId
      popupContainer.className = 'vcv-popup-container'
      popupContainer.innerHTML = requestData
      documentBody.appendChild(popupContainer)
    }
    store.dispatch(popupAddInProgressSet(false))
  }, (error) => {
    store.dispatch(popupAddInProgressSet(false))
    console.warn('Failed to get the popup HTML', error)
  })
}

add('popups', () => {
  elementsStorage.on('add', (elementData) => {
    const cookElement = cook.get(elementData)
    const ids = getPopupDataFromElement(cookElement)
    ids.forEach((id) => {
      addPopupHtml(id)
    })
  })

  elementsStorage.on('update', (id) => {
    const cookElement = cook.getById(id)
    if (!cookElement) {
      return
    }
    const ids = getPopupDataFromElement(cookElement)
    ids.forEach((id) => {
      addPopupHtml(id)
    })
  })
})
