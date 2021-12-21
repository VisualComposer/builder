import { addStorage, getService, getStorage } from 'vc-cake'
import { getResponse } from 'public/tools/response'
import store from 'public/editor/stores/store'
import { notificationAdded } from 'public/editor/stores/notifications/slice'

const getCategory = (tag, categories) => {
  return categories ? categories.find(category => Object.values(category).find(value => value.elements.indexOf(tag) > -1)) : 'All'
}

addStorage('hubAddons', (storage) => {
  const workspaceStorage = getStorage('workspace')
  const hubAddonsService = getService('hubAddons')
  const utils = getService('utils')
  const dataManager = getService('dataManager')

  storage.on('start', () => {
    const addons = storage.state('addons').get() || {}
    if (!Object.keys(addons).length) {
      storage.state('addons').set(dataManager.get('hubGetAddons'))
    }
    storage.state('addonTeasers').set(dataManager.get('hubGetAddonTeaser'))
  })

  storage.on('add', (addonsData, addBundle) => {
    const addons = storage.state('addons').get() || {}
    addons[addonsData.tag] = addonsData
    hubAddonsService.add(addonsData)
    storage.state('addons').set(Object.assign({}, addons))
    if (addBundle && addonsData && addonsData.bundlePath) {
      Promise.all([window.jQuery.getScript(addonsData.bundlePath)])
    }
  })

  storage.on('downloadAddon', (addon) => {
    const localizations = dataManager.get('localizations')
    const { tag, name } = addon
    let bundle = 'addon/' + tag.charAt(0).toLowerCase() + tag.substr(1, tag.length - 1)
    const downloadedAddons = storage.state('addons').get()
    if (addon.bundle) {
      bundle = addon.bundle
    }
    const data = {
      'vcv-action': 'hub:download:addon:adminNonce',
      'vcv-bundle': bundle,
      'vcv-nonce': dataManager.get('nonce')
    }
    const successMessage = localizations.successAddonDownload || '{name} has been successfully downloaded from the Visual Composer Hub and added to your content library. To finish the installation process reload the page.'
    if (downloadedAddons[tag]) {
      return
    }

    const downloadingItems = workspaceStorage.state('downloadingItems').get() || []
    if (downloadingItems.includes(tag)) {
      return
    }
    downloadingItems.push(tag)
    workspaceStorage.state('downloadingItems').set(downloadingItems)
    let tries = 0
    const tryDownload = () => {
      const successCallback = (response) => {
        try {
          const jsonResponse = getResponse(response)
          if (jsonResponse && jsonResponse.status) {
            store.dispatch(notificationAdded({
              type: 'warning',
              text: successMessage.replace('{name}', name),
              time: 8000
            }))
            utils.buildVariables(jsonResponse.variables || [])
            // Initialize addon depended elements
            if (jsonResponse.elements && Array.isArray(jsonResponse.elements)) {
              jsonResponse.elements.forEach((element) => {
                element.tag = element.tag.replace('element/', '')
                const category = getCategory(element.tag, jsonResponse.categories)
                getStorage('hubElements').trigger('add', element, category, true)
              })
            }
            if (jsonResponse.addons && Array.isArray(jsonResponse.addons)) {
              jsonResponse.addons.forEach((addon) => {
                addon.tag = addon.tag.replace('addon/', '')
                storage.trigger('add', addon, true)
              })
            }
            workspaceStorage.trigger('removeFromDownloading', tag)
          } else {
            tries++
            console.warn('failed to download addon status is false', jsonResponse, response)
            if (tries < 2) {
              tryDownload()
            } else {
              let errorMessage = localizations.licenseErrorAddonDownload || 'Failed to download addon (license expired or request timed out)'
              if (jsonResponse && jsonResponse.message) {
                errorMessage = jsonResponse.message
              }

              console.warn('failed to download addon status is false', errorMessage, response)
              store.dispatch(notificationAdded({
                type: 'error',
                text: errorMessage,
                showCloseButton: 'true',
                time: 5000
              }))
              workspaceStorage.trigger('removeFromDownloading', tag)
            }
          }
        } catch (e) {
          tries++
          console.warn('failed to parse download response', e, response)
          if (tries < 2) {
            tryDownload()
          } else {
            store.dispatch(notificationAdded({
              type: 'error',
              text: localizations.defaultErrorAddonDownload || 'Failed to download addon',
              showCloseButton: 'true',
              time: 5000
            }))
            workspaceStorage.trigger('removeFromDownloading', tag)
          }
        }
      }
      const errorCallback = (response) => {
        workspaceStorage.trigger('removeFromDownloading', tag)
        tries++
        console.warn('failed to download addon general server error', response)
        if (tries < 2) {
          tryDownload()
        } else {
          store.dispatch(notificationAdded({
            type: 'error',
            text: localizations.defaultErrorAddonDownload || 'Failed to download addon',
            showCloseButton: 'true',
            time: 5000
          }))
        }
      }
      utils.startDownload(tag, data, successCallback, errorCallback)
    }
    tryDownload()
  })
})
