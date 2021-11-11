import { addStorage, getService } from 'vc-cake'
import { getResponse } from 'public/tools/response'
import innerAPI from 'public/components/api/innerAPI'

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
    const editorType = dataManager.get('editorType')
    if (editorType === 'vcv_tutorials') {
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
    storage.state('agreeHubTerms').set(dataManager.get('agreeHubTerms'))

    innerAPI.addFilter('saveRequestData', (data) => {
      const featuredImageState = storage.state('featuredImage').get()
      // if storage state is empty, need to explicitly send a string, otherwise it won't be sent in a request
      const featuredImageDataValue = featuredImageState && featuredImageState.urls && featuredImageState.urls.length ? featuredImageState : 'empty'
      const customCss = storage.state('customCss').get() || ''
      const globalCss = storage.state('globalCss').get() || ''

      data['vcv-settings-source-local-head-js'] = storage.state('localJsHead').get() || ''
      data['vcv-settings-source-local-footer-js'] = storage.state('localJsFooter').get() || ''
      data['vcv-settings-global-head-js'] = storage.state('globalJsHead').get() || ''
      data['vcv-settings-global-footer-js'] = storage.state('globalJsFooter').get() || ''
      data['vcv-settings-page-design-options'] = encodeURIComponent(JSON.stringify(storage.state('pageDesignOptions').get() || {}))
      data['vcv-settings-parent-page'] = storage.state('parentPage').get() || ''
      data['vcv-settings-tags'] = JSON.stringify(storage.state('tags').get() || '')
      data['vcv-settings-excerpt'] = storage.state('excerpt').get() || ''
      data['vcv-settings-comment-status'] = storage.state('commentStatus').get() || 'closed'
      data['vcv-settings-ping-status'] = storage.state('pingStatus').get() || 'closed'
      data['vcv-settings-author'] = storage.state('author').get() || ''
      data['vcv-settings-categories'] = JSON.stringify(storage.state('categories').get() || '')
      data['vcv-settings-featured-image'] = featuredImageDataValue
      data['vcv-settings-source-custom-css'] = customCss
      data['vcv-settings-global-css'] = globalCss
      data['vcv-page-title'] = storage.state('pageTitle').get() || ''
      data['vcv-page-title-disabled'] = storage.state('pageTitleDisabled').get() || ''
      data['vcv-post-name'] = storage.state('postName').get() || ''
      data['vcv-item-preview-disabled'] = storage.state('itemPreviewDisabled').get() || ''

      if (editorType === 'vcv_layouts') {
        const layoutType = storage.state('layoutType').get()
        data['vcv-layout-type'] = layoutType
      }

      const pageTemplateData = storage.state('pageTemplate').get()
      if (pageTemplateData) {
        if (pageTemplateData.stretchedContent) {
          // Due to browsers converts Boolean TRUE to string "true"
          pageTemplateData.stretchedContent = 1
        } else {
          pageTemplateData.stretchedContent = 0
        }
        data['vcv-page-template'] = pageTemplateData
      }
      return data
    })
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
