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
    storage.state('status').set({ status: 'saving' }, source)
    settingsStorage.state('status').set({ status: 'ready' })
    const documentData = documentManager.all()
    // check this
    storage.trigger('wordpress:beforeSave', {
      pageElements: documentData
    })
    options = Object.assign({}, {
      elements: documentData
    }, options)
    controller.save(id, options, storage.state('status'))
  })

  storage.on('rebuild', (postId) => {
    storage.state('id').set(postId)
    postId && controller.load(postId, {}, storage.state('status'))
  })
  storage.state('status').set({ status: false })
  storage.state('status').onChange((data) => {
    const { status, request } = data
    if (status === 'loadSuccess') {
      const globalAssetsStorage = modernAssetsStorage.getGlobalInstance()
      const customCssState = settingsStorage.state('customCss')
      const globalCssState = settingsStorage.state('globalCss')
      const pageTemplate = settingsStorage.state('pageTemplate')
      const localJsState = settingsStorage.state('localJs')
      const globalJsState = settingsStorage.state('globalJs')
      /**
       * @typedef {Object} responseData parsed data from JSON
       * @property {Array} globalElements list of global elements
       * @property {string} data saved data
       */
      let responseData = JSON.parse(request || '{}')
      const pageTitleData = responseData.pageTitle ? responseData.pageTitle : {}
      const pageTemplateData = window.VCV_PAGE_TEMPLATES ? window.VCV_PAGE_TEMPLATES() : ''
      if (responseData.globalElements && responseData.globalElements.length) {
        let globalElements = JSON.parse(responseData.globalElements || '{}')
        globalElements && globalAssetsStorage.setElements(globalElements)
      }
      if (responseData.data) {
        // Need to call save
        let data = { elements: {} }
        try {
          data = JSON.parse(responseData.data ? decodeURIComponent(responseData.data) : '{}')
        } catch (e) {
          console.warn('Failed to parse page elements', e)
          data = { elements: {} }
          // TODO: Maybe attempt to repair truncated js (like loose but not all?)
        }
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
      if (responseData.jsSettings && responseData.jsSettings.hasOwnProperty('local')) {
        localJsState.set(responseData.jsSettings.local || '')
      }
      if (responseData.jsSettings && responseData.jsSettings.hasOwnProperty('global')) {
        globalJsState.set(responseData.jsSettings.global || '')
      }
      if (pageTitleData.hasOwnProperty('current')) {
        settingsStorage.state('pageTitle').set(pageTitleData.current)
      }
      if (pageTitleData.hasOwnProperty('disabled')) {
        settingsStorage.state('pageTitleDisabled').set(pageTitleData.disabled)
      }
      if (pageTemplateData.current) {
        pageTemplate.set(pageTemplateData.current)
      }
    }
  })
  wordpressBackendWorkspace.state('lastAction').onChange((action) => {
    if (action === 'contentBuilt') {
      storage.trigger('save', storage.state('id').get())
      storage.state('id').set(false)
    }
  })
})
