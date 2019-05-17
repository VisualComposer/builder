import { addStorage, getService, getStorage } from 'vc-cake'
import lodash from 'lodash'
import { getResponse } from 'public/tools/response'

const getCategory = (tag, categories) => {
  return categories ? categories.find(category => Object.values(category).find(value => value.elements.indexOf(tag) > -1)) : 'All'
}

const setCategoryState = (categoryData, storageState) => {
  const categoryName = Object.keys(categoryData)[ 0 ]
  const stateCategories = storageState.get()
  const isCategoryExists = Object.keys(stateCategories).find(category => category === categoryName)
  let newState
  if (isCategoryExists) {
    const mergedElements = lodash.union(stateCategories[ categoryName ].elements, categoryData[ categoryName ].elements)
    newState = stateCategories
    newState[ categoryName ].elements = mergedElements
  } else {
    newState = Object.assign(categoryData, stateCategories)
  }
  storageState.set(newState)
}

addStorage('hubElements', (storage) => {
  const workspaceStorage = getStorage('workspace')
  const notificationsStorage = getStorage('notifications')
  const hubElementsService = getService('hubElements')
  const utils = getService('utils')
  const sharedAssetsStorage = getStorage('sharedAssets')

  storage.on('start', () => {
    storage.state('elements').set(window.VCV_HUB_GET_ELEMENTS ? window.VCV_HUB_GET_ELEMENTS() : {})
    storage.state('categories').set(window.VCV_HUB_GET_CATEGORIES ? window.VCV_HUB_GET_CATEGORIES() : {})
  })

  storage.on('add', (elementData, categoryData, addBundle) => {
    let elements = storage.state('elements').get() || {}
    elements[ elementData.tag ] = elementData
    hubElementsService.add(elementData)
    storage.state('elements').set(elements)
    setCategoryState(categoryData, storage.state('categories'))
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
          let jsonResponse = getResponse(response)
          if (jsonResponse && jsonResponse.status) {
            notificationsStorage.trigger('add', {
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
                const category = getCategory(element.tag, jsonResponse.categories)
                storage.trigger('add', element, category, true)
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
                if (assetData.cssSubsetBundles) {
                  Object.keys(assetData.cssSubsetBundles).forEach((key) => {
                    assetData.cssSubsetBundles[ key ] = jsonResponse.sharedAssetsUrl + assetData.cssSubsetBundles[ key ]
                  })
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
              notificationsStorage.trigger('add', {
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
            notificationsStorage.trigger('add', {
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
          notificationsStorage.trigger('add', {
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
    if (!asset.cssBundle && !asset.cssSubsetBundles) {
      return
    }

    const slugify = (text) => {
      return text.toString().toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/--+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '')
    }

    let add = (bundle) => {
      const id = `${slugify(bundle)}-css`
      const styleElement = document.querySelector(`#vcv\\:assets\\:source\\:style\\:${id}`)

      if (!styleElement) {
        let link = document.createElement('link')
        link.rel = 'stylesheet'
        link.href = bundle
        link.type = 'text/css'
        link.media = 'all'
        link.id = `vcv:assets:source:style:${id}`
        document.head.appendChild(link)
      }
    }
    if (asset.cssBundle) {
      add(asset.cssBundle)
    }
    if (asset.cssSubsetBundles) {
      Object.keys(asset.cssSubsetBundles).forEach((key) => {
        add(asset.cssSubsetBundles[ key ])
      })
    }
  })
})
