import { addStorage, getService } from 'vc-cake'
import { getResponse } from 'public/tools/response'

addStorage('settings', (storage) => {
  const dataManager = getService('dataManager')

  storage.state('globalCss').onChange((data) => {
    // Used in onbeforeunload to show warning
    storage.state('status').set({ status: 'changed' })
  })
  storage.state('customCss').onChange((data) => {
    // Used in onbeforeunload to show warning
    storage.state('status').set({ status: 'changed' })
  })
  storage.on('start', () => {
    let pageTemplate
    if (dataManager.get('editorType') === 'vcv_tutorials') {
      pageTemplate = { type: 'vc', value: 'blank' }
    } else if (dataManager.get('pageTemplatesLayoutsCurrent')) {
      pageTemplate = dataManager.get('pageTemplatesLayoutsCurrent')
    } else {
      pageTemplate = { type: 'theme', value: 'default' }
    }
    !storage.state('pageTemplate').get() && storage.state('pageTemplate').set(pageTemplate)
    if (!storage.state('headerTemplate').get()) {
      const headerTemplates = dataManager.get('headerTemplates')
      storage.state('headerTemplate').set(headerTemplates && headerTemplates.current)
    }
    if (!storage.state('sidebarTemplate').get()) {
      const sidebarTemplates = dataManager.get('sidebarTemplates')
      storage.state('sidebarTemplate').set(sidebarTemplates && sidebarTemplates.current)
    }
    if (!storage.state('footerTemplate').get()) {
      const footerTemplates = dataManager.get('footerTemplates')
      storage.state('footerTemplate').set(footerTemplates && footerTemplates.current)
    }
  })

  const dataProcessor = getService('dataProcessor')
  storage.on('loadDynamicPost', (sourceId, successCallback, failureCallback, isCustomID) => {
    const postData = storage.state('postData').get()
    const postFields = storage.state('postFields').get()
    if (!isCustomID) {
      // Current Post
      if (typeof successCallback === 'function') {
        successCallback(sourceId, postData, postFields)
      }
    } else {
      // Custom Post
      if (typeof postData[sourceId] !== 'undefined') {
        // Already loaded
        if (typeof successCallback === 'function') {
          successCallback(sourceId, postData[sourceId], postFields[sourceId])
        }
      } else {
        dataProcessor.appAllDone().then(() => {
          dataProcessor.appAdminServerRequest({
            'vcv-action': 'getDynamicPost:adminNonce',
            'vcv-source-id': sourceId,
            'vcv-custom-post': isCustomID ? '1' : '0'
          }).then((requestData) => {
            const response = getResponse(requestData)
            postData[sourceId] = response.postData || {}
            postFields[sourceId] = response.postFields || {}
            storage.state('postData').set(postData)
            storage.state('postFields').set(postFields)
            if (typeof successCallback === 'function') {
              successCallback(sourceId, response.postData, response.postFields)
            }
          }, (error) => {
            console.warn('Failed to load dynamic post data', sourceId, error)
            if (typeof failureCallback === 'function') {
              failureCallback(error)
            }
          })
        })
      }
    }
  })
})
