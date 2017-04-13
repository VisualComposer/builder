import { addStorage, getStorage, getService, setData } from 'vc-cake'
import lodash from 'lodash'
import $ from 'jquery'
import SaveController from './lib/saveController'

addStorage('wordpressData', (storage) => {
  const controller = new SaveController()
  const modernAssetsStorage = getService('modernAssetsStorage')
  const elementsStorage = getStorage('elements')
  const workspaceStorage = getStorage('workspace')
  const settingsStorage = getStorage('settings')
  const documentManager = getService('document')
  storage.on('start', () => {
    // Here we call data load
    controller.load({}, storage.state('status'))
  })
  storage.on('save', (options, source = '', callback) => {
    storage.state('status').set({ status: 'saving' }, source)
    const documentData = documentManager.all()
    storage.trigger('wordpress:beforeSave', {
      pageElements: documentData
    })
    options = lodash.defaultsDeep({}, {
      elements: documentData
    }, options)
    controller.save(options, storage.state('status'), callback)
  })
  storage.state('saveReady').set(false)
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
      if (responseData.data) {
        let data = JSON.parse(responseData.data ? decodeURIComponent(responseData.data) : '{}')
        elementsStorage.trigger('reset', data.elements || {})
      } else {
        elementsStorage.trigger('reset', {})
      }
      if (responseData.cssSettings && responseData.cssSettings.custom) {
        customCssState.set(responseData.cssSettings.custom || '')
      }
      if (responseData.cssSettings && responseData.cssSettings.global) {
        globalCssState.set(responseData.cssSettings.global || '')
      }
      if (responseData.myTemplates) {
        let templates = JSON.parse(responseData.myTemplates || '{}')
        setData('myTemplates', templates)
      }
      storage.state('status').set({ status: 'loaded' })
      workspaceStorage.state('app').set('started')
    } else if (status === 'loadFailed') {
      storage.state('status').set({ status: 'loaded' })
      throw new Error('Failed to load loaded')
    }
  })
  let $post = $('#post')
  let $document = $(document)
  let $submitpost = $('#submitpost')
  $post.on('submit', (event) => {
    if (!storage.state('saveReady').get()) {
      event.preventDefault()
      $document.trigger('autosave-disable-buttons')
      $submitpost.find('#major-publishing-actions .spinner').addClass('is-active')
      window.setTimeout(() => {
        storage.trigger('save', {}, '', () => {
          storage.state('saveReady').set(true)
          $('#post').trigger('submit')
        })
      }, 1)
    } else {
      $document.trigger('autosave-enable-buttons')
    }
  })
})
