import vcCake from 'vc-cake'

const dataProcessor = vcCake.getService('dataProcessor')
const elementAssetsLibrary = vcCake.getService('elementAssetsLibrary')
const stylesManager = vcCake.getService('stylesManager')
const modernAssetsStorage = vcCake.getService('modernAssetsStorage')
const utils = vcCake.getService('utils')

export default class SaveController {
  ajax (data, successCallback, failureCallback) {
    dataProcessor.appAllDone().then(() => {
      dataProcessor.appServerRequest(data).then(successCallback, failureCallback)
    })
  }

  save (data, status) {
    const iframe = document.getElementById('vcv-editor-iframe')
    const contentLayout = iframe ? iframe.contentWindow.document.querySelector('[data-vcv-module="content-layout"]') : false
    let content = contentLayout ? utils.normalizeHtml(contentLayout.innerHTML) : ''
    let globalStyles = ''
    let pageStyles = ''
    let promises = []
    const globalAssetsStorageInstance = modernAssetsStorage.getGlobalInstance()
    let globalElements = globalAssetsStorageInstance.getElements()
    let elementsTagsList = globalAssetsStorageInstance.getElementsTagsList()
    let globalStylesManager = stylesManager.create()
    globalStylesManager.add(globalAssetsStorageInstance.getSiteCssData())
    promises.push(globalStylesManager.compile().then((result) => {
      globalStyles = result
    }))
    let localStylesManager = stylesManager.create()
    localStylesManager.add(globalAssetsStorageInstance.getPageCssData())
    promises.push(localStylesManager.compile().then((result) => {
      pageStyles = result
    }))
    let assetsFiles = elementAssetsLibrary.getAssetsFilesByTags(elementsTagsList)
    Promise.all(promises).then(() => {
      this.ajax(
        {
          'vcv-action': 'setData:adminNonce',
          'vcv-ready': '1', // Used for backend editor when post being saved
          'vcv-content': content,
          'vcv-data': encodeURIComponent(JSON.stringify(data)),
          'vcv-assets': encodeURIComponent(JSON.stringify(assetsFiles)),
          'vcv-global-elements-css': globalStyles,
          'vcv-global-elements': encodeURIComponent(JSON.stringify(globalElements)),
          'vcv-page-css': pageStyles,
          'vcv-settings-page-custom-css': globalAssetsStorageInstance.getCustomCss(),
          'vcv-settings-global-css': globalAssetsStorageInstance.getGlobalCss()
        },
        this.saveSuccess.bind(this, status),
        this.saveFailed.bind(this, status)
      )
    })
  }

  saveSuccess (status, responseText) {
    let data = JSON.parse(responseText || '{}')
    if (data.postData) {
      window.vcvPostData = data.postData
    }
    status.set({
      status: 'success',
      request: responseText
    })
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

  load = (data, status) => {
    this.ajax(
      {
        'vcv-action': 'getData:adminNonce',
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
