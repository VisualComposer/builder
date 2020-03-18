import { addStorage, getStorage, getService } from 'vc-cake'

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
      if (requestData) {
        const popupContainer = document.createElement('div')
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

  const parseUrlAttributes = (cookElement) => {
    const urlAttrKeys = cookElement.filter((key, value, settings) => {
      return settings.type === 'url'
    })

    urlAttrKeys.forEach((urlKey) => {
      const urlValue = cookElement.get(urlKey)

      if (urlValue && urlValue.url && urlValue.type === 'popup') {
        const popupId = urlValue.url.split('#vcv-popup-')
        if (popupId && popupId[1]) {
          addPopupHtml(popupId[1])
        }
      }
    })
  }

  elementsStorage.on('add', (elementData) => {
    const cookElement = cook.get(elementData)
    parseUrlAttributes(cookElement)
  })

  elementsStorage.on('update', (id) => {
    const cookElement = cook.getById(id)
    parseUrlAttributes(cookElement)
  })
})
