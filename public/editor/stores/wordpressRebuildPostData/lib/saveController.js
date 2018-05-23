import vcCake from 'vc-cake'

const dataProcessor = vcCake.getService('dataProcessor')
const elementAssetsLibrary = vcCake.getService('elementAssetsLibrary')
const stylesManager = vcCake.getService('stylesManager')
const modernAssetsStorage = vcCake.getService('modernAssetsStorage')
const utils = vcCake.getService('utils')
const cook = vcCake.getService('cook')
const settingsStorage = vcCake.getStorage('settings')
const assetsStorage = vcCake.getStorage('assetsUpdate')
const renderProcessor = vcCake.getService('renderProcessor')

export default class SaveController {
  ajax (data, successCallback, failureCallback) {
    dataProcessor.appAllDone().then(() => {
      dataProcessor.appAdminServerRequest(data).then(successCallback, failureCallback)
    })
  }

  /**
   * Send data to server
   * @param id
   * @param data
   * @param status
   * @private
   */
  save (id, data, status) {
    let globalStyles = ''
    let pageStyles = ''
    let promises = []
    const globalAssetsStorageInstance = modernAssetsStorage.getGlobalInstance()
    let globalStylesManager = stylesManager.create()
    globalStylesManager.add(globalAssetsStorageInstance.getSiteCssDataNG())
    promises.push(globalStylesManager.compile().then((result) => {
      globalStyles = result
    }))
    const localStylesManager = stylesManager.create()
    localStylesManager.add(globalAssetsStorageInstance.getPageCssDataNG())
    promises.push(localStylesManager.compile().then((result) => {
      pageStyles = result
    }))
    let assetsFiles = {
      jsBundles: [],
      cssBundles: []
    }
    const elementsCss = {}
    Object.keys(data.elements).forEach((key) => {
      assetsStorage.trigger('addElement', key)
      const cookElement = cook.get(data.elements[ key ])
      const tag = cookElement.get('tag')
      elementsCss[ key ] = {
        tag: tag
      }
      let elementAssetsFiles = elementAssetsLibrary.getBackendEditorAssetsFilesByElement(cookElement, { metaPublicJs: true })
      assetsFiles.cssBundles = assetsFiles.cssBundles.concat(elementAssetsFiles.cssBundles)
      assetsFiles.jsBundles = assetsFiles.jsBundles.concat(elementAssetsFiles.jsBundles)
      const elementBaseStyleManager = stylesManager.create()
      const elementAttributesStyleManager = stylesManager.create()
      const elementMixinsStyleManager = stylesManager.create()
      const baseCss = globalAssetsStorageInstance.getCssDataByElement(data.elements[ key ], { attributeMixins: false, cssMixins: false })
      const attributesCss = globalAssetsStorageInstance.getCssDataByElement(data.elements[ key ], { tags: false, cssMixins: false })
      const mixinsCss = globalAssetsStorageInstance.getCssDataByElement(data.elements[ key ], { tags: false, attributeMixins: false })
      promises.push(elementBaseStyleManager.add(baseCss).compile().then((result) => {
        elementsCss[ key ].baseCss = result
      }))
      promises.push(elementAttributesStyleManager.add(attributesCss).compile().then((result) => {
        elementsCss[ key ].attributesCss = result
      }))
      promises.push(elementMixinsStyleManager.add(mixinsCss).compile().then((result) => {
        elementsCss[ key ].mixinsCss = result
      }))
    })
    if (vcCake.env('FT_WAIT_FOR_FINAL_RENDER')) {
      promises.push(renderProcessor.appAllDone())
      promises.push(dataProcessor.appAllDone())
    }
    assetsFiles.cssBundles = [ ...new Set(assetsFiles.cssBundles) ]
    assetsFiles.jsBundles = [ ...new Set(assetsFiles.jsBundles) ]
    Promise.all(promises).then(() => {
      const iframe = document.getElementById('vcv-editor-iframe')
      const contentLayout = iframe ? iframe.contentWindow.document.querySelector('[data-vcv-module="content-layout"]') : false
      let content = contentLayout ? utils.normalizeHtml(contentLayout.innerHTML) : ''
      let requestData = {
        'vcv-action': 'setData:adminNonce',
        'vcv-source-id': id,
        'vcv-ready': '1', // Used for backend editor when post being saved
        'vcv-content': '<!--vcv no format-->' + content + '<!--vcv no format-->',
        'vcv-data': encodeURIComponent(JSON.stringify(data)),
        'vcv-global-elements-css': globalStyles,
        'vcv-elements-css-data': encodeURIComponent(JSON.stringify(elementsCss)),
        'vcv-source-assets-files': encodeURIComponent(JSON.stringify(assetsFiles)),
        'vcv-source-css': pageStyles,
        'vcv-settings-source-custom-css': settingsStorage.state('customCss').get() || '',
        'vcv-settings-global-css': settingsStorage.state('globalCss').get() || '',
        'vcv-settings-source-local-js': settingsStorage.state('localJs').get() || '',
        'vcv-settings-global-js': settingsStorage.state('globalJs').get() || '',
        'vcv-tf': 'noGlobalCss',
        'vcv-be-editor': 'fe',
        'vcv-updatePost': '1'
      }
      let pageTemplateData = settingsStorage.state('pageTemplate').get()
      if (pageTemplateData) {
        requestData[ 'vcv-page-template' ] = pageTemplateData
      }
      requestData[ 'vcv-page-title' ] = settingsStorage.state('pageTitle').get() || ''
      requestData[ 'vcv-page-title-disabled' ] = settingsStorage.state('pageTitleDisabled').get() || ''

      let extraRequestData = settingsStorage.state('saveExtraArgs').get() || {}
      requestData[ 'vcv-extra' ] = extraRequestData

      this.ajax(
        requestData,
        this.saveSuccess.bind(this, status),
        this.saveFailed.bind(this, status)
      )
    })
  }

  saveSuccess (status, responseText) {
    try {
      let data = JSON.parse(responseText || '{}')
      if (data && data.postData) {
        window.vcvPostData = data.postData
      }
      status.set({
        status: 'success',
        request: responseText
      })
    } catch (e) {
      console.warn('save failed', e)
      this.saveFailed(status, responseText)
    }
    // this.props.api.request('wordpress:data:saved', {
    //   status: 'success',
    //   request: responseText
    // })
  }

  saveFailed (status, request) {
    status.set({
      status: 'failed',
      request: request
    })
    // this.props.api.request('wordpress:data:saved', {
    //   status: 'failed',
    //   request: request
    // })
  }

  load = (id, data, status) => {
    this.ajax(
      {
        'vcv-action': 'getData:adminNonce',
        'vcv-source-id': id,
        'vcv-data': encodeURIComponent(JSON.stringify(data))
      },
      this.loadSuccess.bind(this, status),
      this.loadFailed.bind(this, status)
    )
  }

  loadSuccess = (status, request) => {
    status.set({
      status: 'loadSuccess',
      request: request
    })
    // this.props.api.request('wordpress:data:loaded', {
    //   status: 'success',
    //   request: request
    // })
  }

  loadFailed = (status, request) => {
    status.set({
      status: 'loadFailed',
      request: request
    })
    // this.props.api.request('wordpress:data:loaded', {
    // status: 'failed',
    // request: request
    // })
  }
}
