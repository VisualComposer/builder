import { addStorage, getService, getStorage } from 'vc-cake'

addStorage('hubElements', (storage) => {
  const workspaceStorage = getStorage('workspace')
  const workspaceNotifications = workspaceStorage.state('notifications')
  const hubElementsService = getService('hubElements')
  const utils = getService('utils')
  const sharedAssetsStorage = getStorage('sharedAssets')

  storage.on('start', () => {
    storage.state('elements').set(window.VCV_HUB_GET_ELEMENTS ? window.VCV_HUB_GET_ELEMENTS() : {})
  })

  storage.on('add', (elementData, addBundle) => {
    let elements = storage.state('elements').get() || {}
    elements[ elementData.tag ] = elementData
    hubElementsService.add(elementData)
    storage.state('elements').set(elements)
    if (addBundle) {
      Promise.all([ window.jQuery.getScript(elementData.bundlePath) ])
    }
  })

  storage.on('downloadElement', (element) => {
    const localizations = window.VCV_I18N ? window.VCV_I18N() : {}
    const { tag, name } = element
    let bundle = 'element/' + tag.charAt(0).toLowerCase() + tag.substr(1, tag.length - 1)
    if (element.bundle) {
      bundle = element.bundle
    }
    let data = {
      'vcv-action': 'hub:download:element:adminNonce',
      'vcv-bundle': bundle,
      'vcv-nonce': window.vcvNonce
    }
    let successMessage = localizations.successElementDownload || '{name} has been successfully downloaded from the Visual Composer Hub and added to your library'
    if (hubElementsService.get(tag) !== null) {
      return
    }

    let downloadingItems = workspaceStorage.state('downloadingItems').get() || []
    if (downloadingItems.includes(tag)) {
      return
    }
    downloadingItems.push(tag)
    workspaceStorage.state('downloadingItems').set(downloadingItems)

    let tries = 0
    const tryDownload = () => {
      let successCallback = (response) => {
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
            utils.buildVariables(jsonResponse.variables || [])
            if (jsonResponse.elements && Array.isArray(jsonResponse.elements)) {
              jsonResponse.elements.forEach((element) => {
                element.tag = element.tag.replace('element/', '')
                storage.trigger('add', element, true)
                workspaceStorage.trigger('removeFromDownloading', tag)
              })
            }
            if (jsonResponse.sharedAssets && jsonResponse.sharedAssetsUrl) {
              Object.keys(jsonResponse.sharedAssets).forEach((assetName) => {
                let assetData = jsonResponse.sharedAssets[ assetName ]
                if (assetData.jsBundle) {
                  assetData.jsBundle = jsonResponse.sharedAssetsUrl + assetData.jsBundle
                }
                if (assetData.cssBundle) {
                  assetData.cssBundle = jsonResponse.sharedAssetsUrl + assetData.cssBundle
                }
                sharedAssetsStorage.trigger('add', assetData)
                storage.trigger('addCssAssetInEditor', assetData)
              })
            }
          } else {
            tries++
            console.warn('failed to download element status is false', jsonResponse, response)
            if (tries < 2) {
              tryDownload()
            } else {
              let errorMessage = localizations.licenseErrorElementDownload || 'Failed to download element (license expired or request timed out)'
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
              workspaceStorage.trigger('removeFromDownloading', tag)
            }
          }
        } catch (e) {
          tries++
          console.warn('failed to parse download response', e, response)
          if (tries < 2) {
            tryDownload()
          } else {
            workspaceNotifications.set({
              type: 'error',
              text: localizations.defaultErrorElementDownload || 'Failed to download element',
              showCloseButton: 'true',
              icon: 'vcv-ui-icon vcv-ui-icon-error',
              time: 5000
            })
            workspaceStorage.trigger('removeFromDownloading', tag)
          }
        }
      }
      let errorCallback = (response) => {
        workspaceStorage.trigger('removeFromDownloading', tag)
        tries++
        console.warn('failed to download element general server error', response)
        if (tries < 2) {
          tryDownload()
        } else {
          workspaceNotifications.set({
            type: 'error',
            text: localizations.defaultErrorElementDownload || 'Failed to download element',
            showCloseButton: 'true',
            icon: 'vcv-ui-icon vcv-ui-icon-error',
            time: 5000
          })
        }
      }
      utils.startDownload(tag, data, successCallback, errorCallback)
    }
    tryDownload()
  })

  storage.on('addCssAssetInEditor', (asset) => {
    if (!asset.cssBundle) {
      return
    }

    const slugify = (text) => {
      return text.toString().toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '')
    }

    const id = `${slugify(asset.cssBundle)}-css`
    const styleElement = document.querySelector(`#vcv\\:assets\\:source\\:style\\:${id}`)

    if (!styleElement) {
      let link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = asset.cssBundle
      link.type = 'text/css'
      link.media = 'all'
      link.id = `vcv:assets:source:style:${id}`
      document.head.appendChild(link)
    }
  })
})
