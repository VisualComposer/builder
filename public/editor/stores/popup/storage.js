import { addStorage, getStorage, getService } from 'vc-cake'

addStorage('popup', (storage) => {
  const elementsStorage = getStorage('elements')
  const cook = getService('cook')
  const dataProcessor = getService('dataProcessor')

  const getPopupId = (attrValue) => {
    if (attrValue && attrValue.url && attrValue.type === 'popup') {
      const popupId = attrValue.url.split('#vcv-popup-')
      if (popupId && popupId[1]) {
        return popupId[1]
      }
      return null
    }
    return null
  }

  const parseUrlAttributes = (cookElement) => {
    const urlAttrKeys = cookElement.filter((key, value, settings) => {
      return settings.type === 'url'
    })

    urlAttrKeys.forEach((urlKey) => {
      const urlValue = cookElement.get(urlKey)
      const popupId = getPopupId(urlValue)
      if (popupId) {
        storage.trigger('addPopupHtml', popupId)
      }
    })

    const attachImageAttrKeys = cookElement.filter((key, value, settings) => {
      return settings.type === 'attachimage'
    })

    attachImageAttrKeys.forEach((attachImageKey) => {
      const imageValue = cookElement.get(attachImageKey)
      if (Array.isArray(imageValue)) {
        imageValue.forEach((imgValue) => {
          const popupId = getPopupId(imgValue.link)
          if (popupId) {
            storage.trigger('addPopupHtml', popupId)
          }
        })
      } else if (typeof imageValue === 'object') {
        const popupId = getPopupId(imageValue.link)
        if (popupId) {
          storage.trigger('addPopupHtml', popupId)
        }
      }
    })
  }

  storage.on('addPopupHtml', (id) => {
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
  })

  elementsStorage.on('add', (elementData) => {
    const cookElement = cook.get(elementData)
    parseUrlAttributes(cookElement)
  })

  elementsStorage.on('update', (id) => {
    const cookElement = cook.getById(id)
    parseUrlAttributes(cookElement)
  })
})
