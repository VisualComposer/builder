import { addStorage, getStorage, getService, getData } from 'vc-cake'
import SaveController from './lib/saveController'

addStorage('wordpressData', (storage) => {
  const controller = new SaveController()
  const modernAssetsStorage = getService('modernAssetsStorage')
  const elementsStorage = getStorage('elements')
  const workspaceStorage = getStorage('workspace')
  const settingsStorage = getStorage('settings')
  const hubTemplatesStorage = getStorage('hubTemplates')
  const migrationStorage = getStorage('migration')
  const documentManager = getService('document')
  const wordpressDataStorage = getStorage('wordpressData')

  storage.on('start', () => {
    // Here we call data load
    controller.load(window.vcvSourceID, {}, storage.state('status'))
  })

  let lockData = {
    locked: false,
    status: true
  }
  storage.on('save', (data, source = '', options = {}) => {
    if (lockData.locked) { return }
    const next = () => {
      // Reset lockData to default
      lockData = {
        locked: false,
        status: true
      }
      let status = options && typeof options.status !== 'undefined' ? options.status : storage.state('status')
      status && status.set({ status: 'saving' }, source)
      settingsStorage.state('status').set({ status: 'ready' })
      const documentData = documentManager.all()
      storage.trigger('wordpress:beforeSave', {
        pageElements: documentData
      })
      data = Object.assign({}, {
        elements: documentData
      }, data)
      let id = options && options.id ? options.id : window.vcvSourceID
      controller.save(id, data, status, options)
    }
    if (getData('wp-preview') === 'dopreview') {
      next()
      return
    }
    storage.trigger('wordpress:beforeSaveLock', lockData)
    const timeoutCheck = () => {
      if (lockData.locked) {
        window.setTimeout(timeoutCheck, 30)
      } else {
        if (lockData.status) {
          next()
        } else {
          let status = options && typeof options.status !== 'undefined' ? options.status : storage.state('status')
          status && status.set({ status: 'failed' }, source)
        }
      }
    }
    window.setTimeout(timeoutCheck, 5)
  })

  storage.state('status').set('init')
  storage.state('status').onChange((data) => {
    const { status, request } = data
    if (status === 'loadSuccess') {
      // setData('app:dataLoaded', true) // all call of updating data should goes through data state :)
      const globalAssetsStorage = modernAssetsStorage.getGlobalInstance()
      /**
       * @typedef {Object} responseData parsed data from JSON
       * @property {Array} globalElements list of global elements
       * @property {string} data saved data
       */
      let responseData
      try {
        responseData = JSON.parse(request || '{}')
      } catch (e) {
        console.warn(e)
        let jsonString = getJsonFromString(request || '')
        try {
          responseData = JSON.parse(jsonString || '{}')
        } catch (pe) {
          console.warn(pe)
        }
      }
      const pageTitleData = responseData.pageTitle ? responseData.pageTitle : {}
      const pageTemplateData = window.VCV_PAGE_TEMPLATES ? window.VCV_PAGE_TEMPLATES() : ''
      if (responseData.globalElements && responseData.globalElements.length) {
        let globalElements = JSON.parse(responseData.globalElements || '{}')
        globalElements && globalAssetsStorage.setElements(globalElements)
      }
      const initialContent = responseData.post_content
      if ((!responseData.data || !responseData.data.length) && initialContent && initialContent.length) {
        elementsStorage.trigger('reset', {})
        migrationStorage.trigger('migrateContent', {
          _migrated: false,
          content: initialContent
        })
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
        settingsStorage.state('customCss').set(responseData.cssSettings.custom || '')
      }
      if (responseData.cssSettings && responseData.cssSettings.hasOwnProperty('global')) {
        settingsStorage.state('globalCss').set(responseData.cssSettings.global || '')
      }
      // JS Settings local/global @since v11 splitted into two parts
      if (responseData.jsSettings && responseData.jsSettings.hasOwnProperty('localJsHead')) {
        settingsStorage.state('localJsHead').set(responseData.jsSettings.localJsHead || '')
      }
      if (responseData.jsSettings && responseData.jsSettings.hasOwnProperty('localJsFooter')) {
        settingsStorage.state('localJsFooter').set(responseData.jsSettings.localJsFooter || '')
      }
      if (responseData.jsSettings && responseData.jsSettings.hasOwnProperty('globalJsHead')) {
        settingsStorage.state('globalJsHead').set(responseData.jsSettings.globalJsHead || '')
      }
      if (responseData.jsSettings && responseData.jsSettings.hasOwnProperty('globalJsFooter')) {
        settingsStorage.state('globalJsFooter').set(responseData.jsSettings.globalJsFooter || '')
      }
      if (responseData.templates) {
        hubTemplatesStorage.state('templates').set(responseData.templates)
      }
      if (pageTitleData.hasOwnProperty('current')) {
        settingsStorage.state('pageTitle').set(pageTitleData.current)
      }
      if (pageTitleData.hasOwnProperty('disabled')) {
        settingsStorage.state('pageTitleDisabled').set(pageTitleData.disabled)
      }
      if (pageTemplateData && pageTemplateData.current) {
        settingsStorage.state('pageTemplate').set(pageTemplateData.current)
      }
      if (responseData.hasOwnProperty('itemPreviewDisabled')) {
        settingsStorage.state('itemPreviewDisabled').set(!!responseData.itemPreviewDisabled)
      }

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

  const workspaceIFrame = workspaceStorage.state('iframe')
  const workspaceContentState = workspaceStorage.state('content')
  storage.state('status').onChange((data) => {
    const { status } = data
    if (status === 'loadSuccess') {
      onIframeChange()
    }
  })
  settingsStorage.state('pageTitle').onChange(setTitle)
  settingsStorage.state('pageTitleDisabled').onChange(setTitle)
  workspaceIFrame.onChange(onIframeChange)
  let titles = []

  function getJsonFromString (string) {
    let regex = /(\{"\w+".*\})/g
    var result = string.match(regex)
    if (result) {
      return result[0]
    }
    return false
  }

  function onIframeChange (data = {}) {
    let { type = 'loaded' } = data
    if (type === 'loaded') {
      let iframe = document.getElementById('vcv-editor-iframe')
      if (iframe) {
        titles = [].slice.call(iframe.contentDocument.querySelectorAll('vcvtitle'))
        if (!titles.length) {
          titles = [].slice.call(iframe.contentDocument.querySelectorAll('h1.entry-title'))
        }
        if (!titles.length) {
          titles = [].slice.call(iframe.contentDocument.querySelectorAll('h1[class*="title"]'))
        }
        setTitle()
      }
    }
  }

  function setTitle () {
    if (!titles.length) {
      return
    }
    const current = settingsStorage.state('pageTitle').get()
    if (typeof current === 'undefined') {
      return
    }
    const disabled = settingsStorage.state('pageTitleDisabled').get()

    titles.forEach(title => {
      title.innerText = current
      title.style.display = disabled ? 'none' : ''
      title.onclick = () => {
        workspaceContentState.set('settings')
      }
    })
  }

  // postUpdate event
  storage.on('rebuild', (postId) => {
    storage.state('id').set(postId)
    postId && controller.load(postId, {}, storage.state('status'))
  })
})
