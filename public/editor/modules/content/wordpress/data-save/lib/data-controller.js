import vcCake from 'vc-cake'
import $ from 'jquery'
import React from 'react'

// const assetManager = vcCake.getService('assets-manager')
const DocumentData = vcCake.getService('document')
const assetsManager = vcCake.getService('assets-manager')

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
    data = $.extend({}, {
      'vcv-nonce': window.vcvNonce,
      'vcv-source-id': window.vcvSourceID
    }, data)

    let request = new window.XMLHttpRequest()
    request.open('POST', window.vcvAjaxUrl, true)
    request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
    request.onload = () => {
      if (request.status >= 200 && request.status < 400) {
        successCallback.call(this, request)
      } else {
        if (typeof failureCallback === 'function') {
          failureCallback.call(this, request)
        }
      }
    }

    request.send($.param(data))
  }
  normalizeHtML (data) {
    return data.replace(/&quot;/g, "'")
  }
  save (data) {
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

  saveSuccess (request) {
    let data = JSON.parse(request.responseText || '{}')
    if (data.postData) {
      window.vcvPostData = data.postData
    }

    this.props.api.request('wordpress:data:saved', {
      status: 'success',
      request: request
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
      this.loadSuccess,
      this.loadFailed
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
