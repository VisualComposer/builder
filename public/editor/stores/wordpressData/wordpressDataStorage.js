import { addStorage, getStorage, getService, env } from 'vc-cake'
import SaveController from './lib/saveController'

addStorage('wordpressData', (storage) => {
  const controller = new SaveController()
  const modernAssetsStorage = getService('modernAssetsStorage')
  const elementsStorage = getStorage('elements')
  const workspaceStorage = getStorage('workspace')
  const settingsStorage = getStorage('settings')
  const documentManager = getService('document')
  const wordpressDataStorage = getStorage('wordpressData')
  const utils = getService('utils')
  const cook = getService('cook')
  storage.on('start', () => {
    // Here we call data load
    controller.load({}, storage.state('status'))
  })
  storage.on('save', (options, source = '') => {
    storage.state('status').set({ status: 'saving' }, source)
    settingsStorage.state('status').set({ status: 'ready' })
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
    let textElement = cook.get({ tag: 'textBlock', output: utils.wpAutoP(content, '__VCVID__') })
    if (textElement) {
      elementsStorage.trigger('add', textElement.toJS())
    }
  }
  storage.state('status').set('init')
  storage.state('status').onChange((data) => {
    const { status, request } = data
    let pageTitleData = ''
    let pageTemplateData = ''
    if (env('PAGE_TITLE_FE')) {
      pageTitleData = window.VCV_PAGE_TITLE ? window.VCV_PAGE_TITLE() : ''
    }
    if (env('PAGE_TEMPLATES_FE')) {
      pageTemplateData = window.VCV_PAGE_TEMPLATES ? window.VCV_PAGE_TEMPLATES() : ''
    }
    if (status === 'loadSuccess') {
      // setData('app:dataLoaded', true) // all call of updating data should goes through data state :)
      const globalAssetsStorage = modernAssetsStorage.getGlobalInstance()
      const customCssState = settingsStorage.state('customCss')
      const globalCssState = settingsStorage.state('globalCss')
      const pageTitle = settingsStorage.state('pageTitle')
      const pageTitleDisabled = settingsStorage.state('pageTitleDisabled')
      const pageTemplate = settingsStorage.state('pageTemplate')
      const localJsState = settingsStorage.state('localJs')
      const globalJsState = settingsStorage.state('globalJs')
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
      if ((!responseData.data || !responseData.data.length) && initialContent && initialContent.length) {
        elementsStorage.trigger('reset', {})
        wrapExistingContent(initialContent)
      } else if (responseData.data) {
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
      if (env('CUSTOM_JS')) {
        if (responseData.jsSettings && responseData.jsSettings.hasOwnProperty('local')) {
          localJsState.set(responseData.jsSettings.local || '')
        }
        if (responseData.jsSettings && responseData.jsSettings.hasOwnProperty('global')) {
          globalJsState.set(responseData.jsSettings.global || '')
        }
      }
      if (env('PAGE_TITLE_FE')) {
        if (pageTitleData.current) {
          pageTitle.set(pageTitleData.current)
        }
        if (pageTitleData.hasOwnProperty('disabled')) {
          pageTitleDisabled.set(pageTitleData.disabled)
        }
      }
      if (env('PAGE_TEMPLATES_FE')) {
        if (pageTemplateData.current) {
          pageTemplate.set(pageTemplateData.current)
        }
      }
      // if (responseData.myTemplates) {
      //   let templates = JSON.parse(responseData.myTemplates || '{}')
      //   setData('myTemplates', templates)
      // }
      storage.state('status').set({ status: 'loaded' })
      settingsStorage.state('status').set({ status: 'ready' })
      workspaceStorage.state('app').set('started')
      window.onbeforeunload = () => {
        const isContentChanged = wordpressDataStorage.state('status').get().status === 'changed'
        const settingsStorageStateGet = settingsStorage.state('status').get()
        const isCssChanged = settingsStorageStateGet &&
          settingsStorageStateGet.status &&
          settingsStorageStateGet.status === 'changed'
        if (isContentChanged || isCssChanged) {
          return 'Changes that you made may not be saved.'
        }
      }
    } else if (status === 'loadFailed') {
      storage.state('status').set({ status: 'loaded' })
      throw new Error('Failed to load loaded')
    }
  })
})
