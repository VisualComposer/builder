/* global less */
var vcCake = require('vc-cake')
var assetManager = vcCake.getService('asset-manager')
var $ = require('jquery')

var defaultContent = {
  responseText: JSON.stringify(
    { 'd18d1ab9': { 'name': 'Text block', 'output': '<h2><strong>BUILD ELEMENTS FROM TEMPLATES</strong></h2>', 'id': 'd18d1ab9', 'parent': '06d32eb8', 'order': 0 }, 'd97eeddd': { 'name': 'Text block', 'output': '<p>Try the new options for building Visual Composer content elements by using editing tool on the go or uploading your content elements directly into your editor.</p>', 'id': 'd97eeddd', 'parent': '8c0873c0', 'order': 1 }, '6cb94003': { 'name': 'Text block', 'output': '<h1><strong>THE NEW WAY TO BUILD ELEMENTS</strong></h1>', 'id': '6cb94003', 'parent': '8c0873c0', 'order': 0 }, '45dda6c3': { 'name': 'Text block', 'output': '<h2><strong>GETTING STARTED GUIDES AND TUTORIALS</strong></h2>', 'id': '45dda6c3', 'parent': 'e8df3956', 'order': 0 }, 'd3518cc5': { 'name': 'Column', 'background': '', 'size': '1-12', 'type': 'container', 'id': 'd3518cc5', 'parent': 'a53be680', 'order': 0.2 }, 'b2997584': { 'name': 'Text block', 'output': '<p>A step by step guides and tutorials will allow you creating or adapting elements for new Visual Composer. Become a rising star of the new WordPress era.</p>', 'id': 'b2997584', 'parent': 'e8df3956', 'order': 1 }, 'cc355805': { 'name': 'Column', 'background': '', 'size': 'auto', 'type': 'container', 'id': 'cc355805', 'parent': 'a53be680', 'order': 0 }, 'a53be680': { 'name': 'Row', 'background': '', 'type': 'container', 'id': 'a53be680', 'parent': false, 'order': 0 }, '5bc6edf5': { 'name': 'Row', 'background': '', 'type': 'container', 'id': '5bc6edf5', 'parent': false, 'order': 1 }, 'de05a60e': { 'name': 'Text block', 'output': '<p>You don&rsquo;t have to create your elements from scratch. Use already available root elements as a basis to quickly create your own elements or learn on the go.</p>', 'id': 'de05a60e', 'parent': '06d32eb8', 'order': 0.5 }, '23f9b57d': { 'name': 'Column', 'background': '', 'size': 'auto', 'type': 'container', 'id': '23f9b57d', 'parent': '5bc6edf5', 'order': 0.30000000000000004 }, '1325288b': { 'name': 'Text block', 'output': '<h2><strong>ONLINE EDITOR AND UPLOAD OPTIONS</strong></h2>', 'id': '1325288b', 'parent': '23f9b57d', 'order': 0 }, '8b9720a3': { 'name': 'Single Image', 'image': { 'ids': [], 'urls': [] }, 'id': '8b9720a3', 'parent': 'cc355805', 'order': 0 }, 'e8c8c797': { 'name': 'Text block', 'output': '<p>Use Visual Composer Online Editor to create elements within our environment and instantly see preview. Or simply upload your content elements via smart element uploader.</p>', 'id': 'e8c8c797', 'parent': '23f9b57d', 'order': 1 }, '8c0873c0': { 'name': 'Column', 'background': '', 'size': 'auto', 'type': 'container', 'id': '8c0873c0', 'parent': 'a53be680', 'order': 1.2 }, 'e8df3956': { 'name': 'Column', 'background': '', 'size': 'auto', 'type': 'container', 'id': 'e8df3956', 'parent': '5bc6edf5', 'order': 0.7000000000000001 }, '06d32eb8': { 'name': 'Column', 'background': '', 'size': 'auto', 'type': 'container', 'id': '06d32eb8', 'parent': '5bc6edf5', 'order': 0 } }
  )
}
var wordpressStorage = {
  dataKey: 'vcData',
  getItem: function (callback) {
    callback(defaultContent)
    // FEATURE TOOGLE.
    if (false === true) {
      this.ajaxPost({
        'vcv-action': 'getData:adminNonce',
        'vcv-nonce': window.vcvNonce,
        'vcv-source-id': window.vcvSourceID
      }, callback.bind(this))
    }
  },
  ajaxPost: function (data, successCallback, failureCallback) {
    var request = new window.XMLHttpRequest()
    request.open('POST', window.vcvAjaxUrl, true)
    request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
    request.onload = function () {
      if (request.status >= 200 && request.status < 400) {
        successCallback(request)
      } else {
        if (typeof failureCallback === 'function') {
          failureCallback(request)
        }
      }
    }
    request.send($.param(data))
  },
  update: function (data) {
    if (true === false) {
      return false
    }
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
      'vcv-data': data,
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
      if (response) {
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
        if (response) {
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
