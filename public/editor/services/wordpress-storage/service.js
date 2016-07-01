/*eslint no-extra-bind: "off"*/
/* global less */
var vcCake = require('vc-cake')
var assetManager = vcCake.getService('asset-manager')
var $ = require('jquery')

var wordpressStorage = {
  dataKey: 'vcData',
  getItem: function (callback) {
    // callback(defaultContent)
    this.ajaxPost({
      'vcv-action': 'getData:adminNonce',
      'vcv-nonce': window.vcvNonce,
      'vcv-source-id': window.vcvSourceID
    }, callback.bind(this))
  },
  ajaxPost: function (data, successCallback, failureCallback) {
    var request = new window.XMLHttpRequest()
    request.open('POST', window.vcvAjaxUrl, true)
    request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
    request.onload = function () {
      if (request.status >= 200 && request.status < 400) {
        successCallback.call(this, request)
      } else {
        if (typeof failureCallback === 'function') {
          failureCallback.call(this, request)
        }
      }
    }.bind(this)
    request.send($.param(data))
  },
  update: function (data) {
    var content = document.getElementsByClassName('vc-v-layouts-clean-html')[ 0 ].innerHTML.replace(
      /\s+data\-reactid="[^"]+"/,
      '')
    var scripts = assetManager.getAssets('scripts')
    var styles = assetManager.getAssets('styles')
    var stylesStringified = JSON.stringify(styles)
    var recompileStyles = window.vcvPostStyles !== stylesStringified
    window.vcvPostStyles = stylesStringified

    this.ajaxPost({
      'vcv-action': 'setData:adminNonce',
      'vcv-nonce': window.vcvNonce,
      'vcv-source-id': window.vcvSourceID,
      'vcv-content': content,
      'vcv-data': encodeURIComponent(JSON.stringify(data)),
      'vcv-scripts': scripts,
      'vcv-styles': styles
    }, function (request) {
      console && console.log('Data saved.')

      if (!recompileStyles) {
        return
      }

      console && console.log('Recompiling less...')
      /**
       * @var {data: {styleBundles: {string[]}}} response check
       */
      var response = JSON.parse(request.response || '{}')
      var contents = ''
      if (response && response.status) {
        for (let i = response.data.styleBundles.length - 1; i >= 0; i--) {
          var bundle = response.data.styleBundles[ i ]
          less.render(bundle.contents, { filename: bundle.filename, compress: true }, function (e, output) {
            contents += output.css + '\\n'
          })
        }
      }
      this.ajaxPost({
        'vcv-action': 'saveCssBundle:adminNonce',
        'vcv-nonce': window.vcvNonce,
        'vcv-contents': contents
      }, function (request) {
        var response = JSON.parse(request.response || '{}')
        if (response && response.status) {
          console && console.log('CSS bundle saved to', response.data.filename)
        } else {
          console && console.error('css bundle not saved')
        }
      })
    })
  }
}

var service = {
  save: function (data) {
    wordpressStorage.update(data)
  },
  get: function (callback) {
    wordpressStorage.getItem(callback)
  }
}

vcCake.addService('wordpress-storage', service)
