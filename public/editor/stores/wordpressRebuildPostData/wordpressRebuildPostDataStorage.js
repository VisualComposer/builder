import { addStorage, getStorage, getService } from 'vc-cake'
import SaveController from './lib/saveController'

addStorage('wordpressRebuildPostData', (storage) => {
  const controller = new SaveController()

  const elementsStorage = getStorage('elements')
  const settingsStorage = getStorage('settings')
  const wordpressBackendWorkspace = getStorage('wordpressBackendWorkspace')
  const documentManager = getService('document')
  const modernAssetsStorage = getService('modernAssetsStorage')

  storage.on('save', (id, options, source = '') => {
    storage.state('status').set({status: 'saving'}, source)
    settingsStorage.state('status').set({status: 'ready'})
    const documentData = documentManager.all()
    storage.trigger('wordpress:beforeSave', {
      pageElements: documentData
    })
    options = Object.assign({}, {
      elements: documentData
    }, options)
    controller.save(options, storage.state('status'), id)
  })

  storage.on('rebuild', (postId) => {
    storage.state('id').set(postId)
    postId && controller.load(postId, {}, storage.state('status'))
  })
  storage.state('status').set({status: false})
  storage.state('status').onChange((data) => {
    const {status, request} = data
    if (status === 'loadSuccess') {
      const globalAssetsStorage = modernAssetsStorage.getGlobalInstance()
      /**
       * @typedef {Object} responseData parsed data from JSON
       * @property {Array} globalElements list of global elements
       * @property {string} data saved data
       */
      let responseData = JSON.parse(request || '{}')
      if (responseData.globalElements && responseData.globalElements.length) {
        let globalElements = JSON.parse(responseData.globalElements || '{}')
        globalElements && globalAssetsStorage.setElements(globalElements)
      }
      if (responseData.data) {
        // Need to call save
        let data = JSON.parse(responseData.data ? decodeURIComponent(responseData.data) : '{}')
        elementsStorage.trigger('reset', data.elements || {})
      }
    }
  })
  wordpressBackendWorkspace.state('lastAction').onChange((action) => {
    if (action === 'contentBuilt') {
      storage.trigger('saveRebuild', storage.state('id').get())
      storage.state('id').set(false)
    }
  })
})
