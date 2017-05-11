import {addStorage, getStorage, getService, setData} from 'vc-cake'
import SaveController from './lib/saveController'

addStorage('wordpressData', (storage) => {
  const controller = new SaveController()
  const modernAssetsStorage = getService('modernAssetsStorage')
  const elementsStorage = getStorage('elements')
  const workspaceStorage = getStorage('workspace')
  const settingsStorage = getStorage('settings')
  const documentManager = getService('document')
  const wordpressDataStorage = getStorage('wordpressData')
  const cook = getService('cook')
  storage.on('start', () => {
    // Here we call data load
    controller.load({}, storage.state('status'))
  })
  storage.on('save', (options, source = '') => {
    storage.state('status').set({status: 'saving'}, source)
    settingsStorage.state('status').set({status: 'ready'})
    const documentData = documentManager.all()
    storage.trigger('wordpress:beforeSave', {
      pageElements: documentData
    })
    options = Object.assign({}, {
      elements: documentData
    }, options)
    controller.save(options, storage.state('status'))
  })
  const wrapExistingContent = (content) => {
    let textElement = cook.get({ tag: 'textBlock', output: content })
    if (textElement) {
      elementsStorage.trigger('add', textElement.toJS())
    }
  }
  storage.state('status').set('init')
  storage.state('status').onChange((data) => {
    const { status, request } = data
    if (status === 'loadSuccess') {
      // setData('app:dataLoaded', true) // all call of updating data should goes through data state :)
      const globalAssetsStorage = modernAssetsStorage.getGlobalInstance()
      const customCssState = settingsStorage.state('customCss')
      const globalCssState = settingsStorage.state('globalCss')
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
      const initialContent = responseData.post_content
      if (!responseData.data && initialContent && initialContent.length) {
        wrapExistingContent(initialContent)
      } else
      if (responseData.data) {
        let data = JSON.parse(responseData.data ? decodeURIComponent(responseData.data) : '{}')
        elementsStorage.trigger('reset', data.elements || {})
      } else {
        elementsStorage.trigger('reset', {})
      }
      if (responseData.cssSettings && responseData.cssSettings.hasOwnProperty('custom')) {
        customCssState.set(responseData.cssSettings.custom || '')
      }
      if (responseData.cssSettings && responseData.cssSettings.hasOwnProperty('global')) {
        globalCssState.set(responseData.cssSettings.global || '')
      }
      if (responseData.myTemplates) {
        let templates = JSON.parse(responseData.myTemplates || '{}')
        setData('myTemplates', templates)
      }
      storage.state('status').set({status: 'loaded'})
      settingsStorage.state('status').set({status: 'ready'})
      workspaceStorage.state('app').set('started')
      window.onbeforeunload = () => {
        const isContentChanged = wordpressDataStorage.state('status').get().status === 'changed'
        const isCssChanged = settingsStorage.state('status').get().status === 'changed'
        if (isContentChanged || isCssChanged) {
          return true
        }
      }
    } else if (status === 'loadFailed') {
      storage.state('status').set({status: 'loaded'})
      throw new Error('Failed to load loaded')
    }
  })
})
