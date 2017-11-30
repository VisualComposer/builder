import { addStorage, getService, getStorage } from 'vc-cake'
import $ from 'jquery'

addStorage('hubElements', (storage) => {
  const dataProcessor = getService('dataProcessor')
  const workspaceStorage = getStorage('workspace')
  const workspaceNotifications = workspaceStorage.state('notifications')
  const hubElementsService = getService('hubElements')

  storage.on('start', () => {
    storage.state('elements').set(window.VCV_HUB_GET_ELEMENTS())
  })

  storage.on('add', (elementData, addBundle) => {
    let elements = storage.state('elements').get() || {}
    elements[ elementData.tag ] = elementData
    hubElementsService.add(elementData)
    storage.state('elements').set(elements)
    if (addBundle) {
      Promise.all([ $.getScript(elementData.bundlePath) ])
    }
  })

  storage.on('removeFromDownloading', (tag) => {
    let downloadingElements = storage.state('downloadingElements').get() || []
    downloadingElements = downloadingElements.filter(downloadingTag => downloadingTag !== tag)
    storage.state('downloadingElements').set(downloadingElements)
  })

  storage.on('downloadElement', (element) => {
    const localizations = window.VCV_I18N ? window.VCV_I18N() : {}
    const tag = element.tag
    let bundle = 'element/' + tag.charAt(0).toLowerCase() + tag.substr(1, tag.length - 1)
    if (element.bundle) {
      bundle = element.bundle
    }
    let name = element.name
    let data = {
      'vcv-action': 'hub:download:element:adminNonce',
      'vcv-bundle': bundle,
      'vcv-nonce': window.vcvNonce
    }
    let successMessage = localizations.successElementDownload || '{name} has been successfully downloaded from the Visual Composer Hub and added to your library.'
    if (hubElementsService.get(tag) !== null) {
      return
    }
    let downloadingElements = storage.state('downloadingElements').get() || []
    if (downloadingElements.includes(tag)) {
      return
    }
    downloadingElements.push(tag)
    storage.state('downloadginElement').set(downloadingElements)

    let tries = 0
    const buildVariables = (variables) => {
      if (variables.length) {
        variables.forEach((item) => {
          if (typeof window[ item.key ] === 'undefined') {
            if (item.type === 'constant') {
              window[ item.key ] = function () { return item.value }
            } else {
              window[ item.key ] = item.value
            }
          }
        })
      }
    }
    const tryDownload = () => {
      let successCallback = (response, cancelled) => {
        try {
          let jsonResponse = window.JSON.parse(response)
          if (jsonResponse && jsonResponse.status) {
            workspaceNotifications.set({
              position: 'bottom',
              transparent: true,
              rounded: true,
              text: successMessage.replace('{name}', name),
              time: 3000
            })
            buildVariables(jsonResponse.variables || [])
            if (jsonResponse.elements && Array.isArray(jsonResponse.elements)) {
              jsonResponse.elements.forEach((element) => {
                element.tag = element.tag.replace('element/', '')
                getStorage('hubElements').trigger('add', element, true)
                storage.trigger('removeFromDownloading', tag)
              })
            }
          } else {
            if (!cancelled) {
              tries++
              console.warn('failed to download element status is false', jsonResponse, response)
              if (tries < 2) {
                tryDownload()
              } else {
                let errorMessage = localizations.licenseErrorElementDownload || 'Failed to download element (license is expired or request to account has timed out).'
                if (jsonResponse && jsonResponse.message) {
                  errorMessage = jsonResponse.message
                }

                console.warn('failed to download element status is false', errorMessage, response)
                workspaceNotifications.set({
                  type: 'error',
                  text: errorMessage,
                  showCloseButton: 'true',
                  icon: 'vcv-ui-icon vcv-ui-icon-error',
                  time: 5000
                })
              }
            } else {
              let errorMessage = localizations.licenseErrorElementDownload || 'Failed to download element (license is expired or request to account has timed out).'
              console.warn('failed to download element request cancelled', errorMessage, response)
              workspaceNotifications.set({
                type: 'error',
                text: errorMessage,
                showCloseButton: 'true',
                icon: 'vcv-ui-icon vcv-ui-icon-error',
                time: 5000
              })
            }
          }
        } catch (e) {
          if (!cancelled) {
            tries++
            console.warn('failed to parse download response', e, response)
            if (tries < 2) {
              tryDownload()
            } else {
              workspaceNotifications.set({
                type: 'error',
                text: localizations.defaultErrorElementDownload || 'Failed to download element.',
                showCloseButton: 'true',
                icon: 'vcv-ui-icon vcv-ui-icon-error',
                time: 5000
              })
            }
          } else {
            console.warn('failed to parse download response request cancelled', e, response)
            workspaceNotifications.set({
              type: 'error',
              text: localizations.defaultErrorElementDownload || 'Failed to download element.',
              showCloseButton: 'true',
              icon: 'vcv-ui-icon vcv-ui-icon-error',
              time: 5000
            })
          }
        }
      }
      let errorCallback = (response, cancelled) => {
        storage.trigger('removeFromDownloading', tag)
        if (!cancelled) {
          tries++
          console.warn('failed to download element general server error', response)
          if (tries < 2) {
            tryDownload()
          } else {
            workspaceNotifications.set({
              type: 'error',
              text: localizations.defaultErrorElementDownload || 'Failed to download element.',
              showCloseButton: 'true',
              icon: 'vcv-ui-icon vcv-ui-icon-error',
              time: 5000
            })
          }
        } else {
          console.warn('failed to download element general server error request cancelled', response)
          workspaceNotifications.set({
            type: 'error',
            text: localizations.defaultErrorElementDownload || 'Failed to download element.',
            showCloseButton: 'true',
            icon: 'vcv-ui-icon vcv-ui-icon-error',
            time: 5000
          })
        }
      }
      const req = { key: tag, data: data, successCallback: successCallback, errorCallback: errorCallback, cancelled: false }
      dataProcessor.appAdminServerRequest(req.data).then(
        (response) => {
          req.successCallback && req.successCallback(response, req.cancelled)
        },
        (response) => {
          req.errorCallback && req.errorCallback(response, req.cancelled)
        }
      )
    }
    tryDownload()
  })
})
