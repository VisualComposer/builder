import vcCake from 'vc-cake'
import $ from 'jquery'
import React from 'react'

const dataProcessor = vcCake.getService('dataProcessor')
const DocumentData = vcCake.getService('document')
const assetsManager = vcCake.getService('assets-manager')
const wipAssetsManager = vcCake.getService('wipAssetsManager')
const wipAssetsStorage = vcCake.getService('wipAssetsStorage')
const wipStylesManager = vcCake.getService('wipStylesManager')

class SaveController {
  constructor (props) {
    this.props = props
    this.props.api.reply('wordpress:save', (options) => {
      this.props.api.request('wordpress:beforeSave', {
        pageElements: DocumentData.all()
      })
      options = $.extend({}, {
        elements: DocumentData.all()
      }, options)
      this.save(options)
    })

    this.props.api.reply('wordpress:load', this.load)
  }

  ajax (data, successCallback, failureCallback) {
    dataProcessor.appAllDone().then(() => {
      dataProcessor.appServerRequest(data).then(successCallback, failureCallback)
    })
  }

  normalizeHtML (data) {
    return data.replace(/&quot;/g, "'")
  }

  save (data) {
    if (vcCake.env('FEATURE_ASSETS_MANAGER')) {
      let content = this.normalizeHtML(document.getElementsByClassName('vcv-layouts-clean-html')[ 0 ].innerHTML)
      let globalStyles = ''
      let designOptions = ''
      let promises = []
      let elements = wipAssetsStorage.getElements()
      let globalStylesManager = wipStylesManager.create()
      globalStylesManager.add(wipAssetsStorage.getSiteCssData())
      promises.push(globalStylesManager.compile().then((result) => {
        globalStyles = result
      }))
      let localStylesManager = wipStylesManager.create()
      localStylesManager.add(wipAssetsStorage.getPageCssData())
      promises.push(localStylesManager.compile().then((result) => {
        designOptions = result
      }))
      Promise.all(promises).then(() => {
        this.ajax(
          {
            'vcv-action': 'setData:adminNonce',
            'vcv-content': content,
            'vcv-data': encodeURIComponent(JSON.stringify(data)),
            'vcv-scripts': wipAssetsManager.getJsFilesByTags(wipAssetsStorage.getElementsTagsList()),
            'vcv-shared-library-styles': wipAssetsManager.getCssFilesByTags(wipAssetsStorage.getElementsTagsList()),
            'vcv-global-styles': globalStyles,
            // 'vcv-styles': styles,
            'vcv-design-options': designOptions,
            'vcv-global-elements': encodeURIComponent(JSON.stringify(elements)),
            'vcv-custom-css': wipAssetsStorage.getCustomCss(),
            'vcv-global-css': wipAssetsStorage.getGlobalCss()
          },
          this.saveSuccess.bind(this),
          this.saveFailed.bind(this)
        )
      })
    } else {
      let content = this.normalizeHtML(document.getElementsByClassName('vcv-layouts-clean-html')[ 0 ].innerHTML)
      let globalStyles = ''
      let designOptions = ''
      let promises = []
      let elements = assetsManager.get()
      promises.push(assetsManager.getCompiledCss().then((data) => {
        globalStyles = data
      }))
      promises.push(assetsManager.getCompiledDesignOptions().then((data) => {
        designOptions = data
      }))
      Promise.all(promises).then(() => {
        this.ajax(
          {
            'vcv-action': 'setData:adminNonce',
            'vcv-content': content,
            'vcv-data': encodeURIComponent(JSON.stringify(data)),
            'vcv-scripts': assetsManager.getJsFiles(), // .map((file) => { return assetsManager.getSourcePath(file) }),
            'vcv-shared-library-styles': assetsManager.getCssFiles(),
            'vcv-global-styles': globalStyles,
            // 'vcv-styles': styles,
            'vcv-design-options': designOptions,
            'vcv-global-elements': encodeURIComponent(JSON.stringify(elements)),
            'vcv-custom-css': assetsManager.getCustomCss(),
            'vcv-global-css': assetsManager.getGlobalCss()
          },
          this.saveSuccess.bind(this),
          this.saveFailed.bind(this)
        )
      })
    }
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
