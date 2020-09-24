import { addStorage, getStorage, getService } from 'vc-cake'
import { getPopupDataFromElement } from 'public/tools/popup'

addStorage('popup', (storage) => {
  const elementsStorage = getStorage('elements')
  const cook = getService('cook')
  const dataProcessor = getService('dataProcessor')

  const addPopupHtml = (id) => {
    storage.state('popupAddInProgress').set(true)
    const contentWindow = window.document.querySelector('.vcv-layout-iframe').contentWindow
    const documentBody = contentWindow.document.body
    const domId = `vcv-popup-${id}`

    if (documentBody.querySelector(`#${domId}`)) {
      storage.state('popupAddInProgress').set(false)
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
      storage.state('popupAddInProgress').set(false)
    }, (error) => {
      storage.state('popupAddInProgress').set(false)
      console.warn('Failed to get popup HTML', error)
    })
  }

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
