import { add, getStorage, getService } from 'vc-cake'
import { getPopupDataFromElement } from 'public/tools/popup'
import store from 'public/editor/stores/store'
import { popupAddInProgressSet } from 'public/editor/stores/popup/slice'
import { ElementData } from 'public/global'

const elementsStorage = getStorage('elements')
const dataProcessor = getService('dataProcessor')
const cook = getService('cook')

const addPopupHtml = (id:string) => {
  store.dispatch(popupAddInProgressSet(true))
  const iframe = window.document.querySelector('.vcv-layout-iframe') as HTMLIFrameElement
  const contentWindow = iframe?.contentWindow
  const documentBody = contentWindow?.document.body
  const domId = `vcv-popup-${id}`

  if (documentBody?.querySelector(`#${domId}`)) {
    setTimeout(() => {
      store.dispatch(popupAddInProgressSet(false))
    }, 0)
    return
  }

  dataProcessor.appAdminServerRequest({
    'vcv-action': 'popupBuilder:getData:adminNonce',
    'vcv-source-id': id
  }).then((requestData:string|void) => {
    if (requestData && typeof requestData === 'string') {
      const popupContainer = contentWindow?.document.createElement('div')
      if (popupContainer) {
        popupContainer.id = domId
        popupContainer.className = 'vcv-popup-container'
        popupContainer.innerHTML = requestData
        documentBody?.appendChild(popupContainer)
      }
    }
    store.dispatch(popupAddInProgressSet(false))
  }, (error:string) => {
    store.dispatch(popupAddInProgressSet(false))
    console.warn('Failed to get the popup HTML', error)
  })
}

add('popups', () => {
  elementsStorage.on('add', (elementData:ElementData) => {
    const cookElement = cook.get(elementData)
    const ids = getPopupDataFromElement(cookElement)
    ids.forEach((id) => {
      addPopupHtml(id)
    })
  })

  elementsStorage.on('update', (id:string) => {
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
