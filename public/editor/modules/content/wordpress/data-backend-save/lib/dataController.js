import vcCake from 'vc-cake'
import $ from 'jquery'
import React from 'react'

const dataProcessor = vcCake.getService('dataProcessor')
const DocumentData = vcCake.getService('document')
const assetsManager = vcCake.getService('assetsManager')
const assetsStorage = vcCake.getService('assetsStorage')
const wipStylesManager = vcCake.getService('wipStylesManager')
const myTemplates = vcCake.getService('myTemplates')
const utils = vcCake.getService('utils')
class SaveController {
  constructor (props) {
    this.props = props
    this.props.api.reply('data:reset', (options) => {
      window.setTimeout(() => {
        this.props.api.request('wordpress:beforeSave', {
          pageElements: DocumentData.all()
        })
        options = $.extend({}, {
          elements: DocumentData.all()
        }, options)
        this.save(options)
        this.props.api.request('wordpress:data:saved', {
          status: 'success',
          request: ''
        })
      }, 1)
    })
    this.props.api.reply('data:editor:render', (options) => {
      window.setTimeout(() => {
        this.props.api.request('wordpress:beforeSave', {
          pageElements: DocumentData.all()
        })
        options = $.extend({}, {
          elements: DocumentData.all()
        }, options)
        this.save(options)
      }, 1)
    })
    this.props.api.reply('layout:rendered', (options) => {
      window.setTimeout(() => {
        this.props.api.request('wordpress:beforeSave', {
          pageElements: DocumentData.all()
        })
        options = $.extend({}, {
          elements: DocumentData.all()
        }, options)
        this.save(options)
      }, 1)
    })
    $('#post').on('submit', (event) => {
      this.props.api.request('wordpress:data:saved', {
        status: 'success',
        request: ''
      })
    })

    this.props.api.reply('wordpress:load', this.load)
  }

  ajax (data, successCallback, failureCallback) {
    dataProcessor.appAllDone().then(() => {
      dataProcessor.appServerRequest(data).then(successCallback, failureCallback)
    })
  }

  save (data) {
    const iframe = document.getElementById('vcv-editor-iframe')
    const contentLayout = iframe ? iframe.contentWindow.document.querySelector('[data-vcv-module="content-layout"]') : false
    let content = contentLayout ? utils.normalizeHtml(contentLayout.innerHTML) : ''
    let globalStyles = ''
    let designOptions = ''
    let promises = []
    let elements = assetsStorage.getElements()
    let globalStylesManager = wipStylesManager.create()
    globalStylesManager.add(assetsStorage.getSiteCssData())
    promises.push(globalStylesManager.compile().then((result) => {
      globalStyles = result
    }))

    let localStylesManager = wipStylesManager.create()
    localStylesManager.add(assetsStorage.getPageCssData())
    promises.push(localStylesManager.compile().then((result) => {
      designOptions = result
    }))
    Promise.all(promises).then(() => {
      if (window.switchEditors && window.tinymce) {
        window.switchEditors.go('content', 'html')
      }
      document.getElementById('content').value = content
      document.getElementById('vcv-action').value = 'setData:adminNonce'
      document.getElementById('vcv-data').value = encodeURIComponent(JSON.stringify(data))
      document.getElementById('vcv-scripts').value = JSON.stringify(assetsManager.getJsFilesByTags(assetsStorage.getElementsTagsList()))
      document.getElementById('vcv-shared-library-styles').value = JSON.stringify(assetsManager.getCssFilesByTags(assetsStorage.getElementsTagsList()))
      document.getElementById('vcv-global-styles').value = globalStyles
      document.getElementById('vcv-design-options').value = designOptions
      document.getElementById('vcv-global-elements').value = encodeURIComponent(JSON.stringify(elements))
      document.getElementById('vcv-custom-css').value = assetsStorage.getCustomCss()
      document.getElementById('vcv-global-css').value = assetsStorage.getGlobalCss()
      document.getElementById('vcv-google-fonts').value = JSON.stringify(assetsStorage.getGoogleFontsData())
      document.getElementById('vcv-my-templates').value = JSON.stringify(myTemplates.all())
    })
  }

  saveSuccess (responseText) {
    let data = JSON.parse(responseText || '{}')
    if (data.postData) {
      window.vcvPostData = data.postData
    }

    this.props.api.request('wordpress:data:saved', {
      status: 'success',
      request: responseText
    })
  }

  saveFailed (request) {
    this.props.api.request('wordpress:data:saved', {
      status: 'failed',
      request: request
    })
  }

  load = (data) => {
    this.ajax(
      {
        'vcv-action': 'getData:adminNonce',
        'vcv-data': encodeURIComponent(JSON.stringify(data))
      },
      this.loadSuccess.bind(this),
      this.loadFailed.bind(this)
    )
  }

  loadSuccess = (request) => {
    this.props.api.request('wordpress:data:loaded', {
      status: 'success',
      request: request
    })
  }

  loadFailed = (request) => {
    this.props.api.request('wordpress:data:loaded', {
      status: 'failed',
      request: request
    })
  }
}
SaveController.propTypes = {
  api: React.PropTypes.object.isRequired
}

export default SaveController
