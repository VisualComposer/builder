import vcCake from 'vc-cake'
import $ from 'jquery'
let processes = []
const Service = {
  http (url) {
    // A small example of object
    let core = {
      // Method that performs the ajax request
      ajax: function (method, url, args) {
        // Creating a promise

        let promise = new Promise(function (resolve, reject) {
          // Instantiates the XMLHttpRequest
          let request = new window.XMLHttpRequest()
          request.open(method, url)
          if (method === 'POST' || method === 'PUT') {
            request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
          }
          request.send($.param(args))

          request.onload = function () {
            if (this.status >= 200 && this.status < 300) {
              // Performs the function "resolve" when this.status is equal to 2xx
              resolve(this.response)
            } else {
              // Performs the function "reject" when this.status is different than 2xx
              reject(this.statusText)
            }
          }
          request.onerror = function () {
            reject(this.statusText)
          }
        })
        processes.push(promise)
        // Return the promise
        return promise
      }
    }

    // Adapter pattern
    return {
      get (args) {
        return core.ajax('GET', url, args)
      },
      post (args) {
        return core.ajax('POST', url, args)
      },
      put (args) {
        return core.ajax('PUT', url, args)
      },
      delete (args) {
        return core.ajax('DELETE', url, args)
      }
    }
  },
  appAdminServerRequest (args) {
    let url = window.ajaxurl
    args = Object.assign({
      'action': 'vcv:ajax',
      'vcv-nonce': window.vcvNonce,
      'vcv-source-id': window.vcvSourceID
    }, args)
    return this.http(url).post(args)
  },
  appServerRequest (args) {
    let url = window.vcvAjaxUrl
    args = Object.assign({
      'vcv-nonce': window.vcvNonce,
      'vcv-source-id': window.vcvSourceID
    }, args)
    return this.http(url).post(args)
  },
  appAllDone () {
    return Promise.all(processes).then(() => {
      processes = []
    })
  }
}
vcCake.addService('dataProcessor', Service)
