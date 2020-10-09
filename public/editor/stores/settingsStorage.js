import { addStorage, getService } from 'vc-cake'
import { getResponse } from 'public/tools/response'

addStorage('settings', (storage) => {
  storage.state('globalCss').onChange((data) => {
    // Used in onbeforeunload to show warning
    storage.state('status').set({ status: 'changed' })
  })
  storage.state('customCss').onChange((data) => {
    // Used in onbeforeunload to show warning
    storage.state('status').set({ status: 'changed' })
  })
  storage.on('start', () => {
    !storage.state('pageTemplate').get() && storage.state('pageTemplate').set(
      (window.VCV_PAGE_TEMPLATES_LAYOUTS_CURRENT && window.VCV_PAGE_TEMPLATES_LAYOUTS_CURRENT()) ||
      { type: 'vc-theme', value: 'header-footer-sidebar-left-layout' }
    )
    !storage.state('headerTemplate').get() && storage.state('headerTemplate').set(
      window.VCV_HEADER_TEMPLATES && window.VCV_HEADER_TEMPLATES() && window.VCV_HEADER_TEMPLATES().current
    )
    !storage.state('sidebarTemplate').get() && storage.state('sidebarTemplate').set(
      window.VCV_SIDEBAR_TEMPLATES && window.VCV_SIDEBAR_TEMPLATES() && window.VCV_SIDEBAR_TEMPLATES().current
    )
    !storage.state('footerTemplate').get() && storage.state('footerTemplate').set(
      window.VCV_FOOTER_TEMPLATES && window.VCV_FOOTER_TEMPLATES() && window.VCV_FOOTER_TEMPLATES().current
    )
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
