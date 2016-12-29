import vcCake from 'vc-cake'
import $ from 'jquery'
let processes = []
const Service = {
  http (url) {
    // A small example of object
    let core = {
      // Method that performs the ajax request
      ajax: function (method, url, args, contentType) {
        // Creating a promise

        let promise = new Promise(function (resolve, reject) {
          // Instantiates the XMLHttpRequest
          let request = new window.XMLHttpRequest()
          request.open(method, url)
          contentType && request.setRequestHeader('Content-type', contentType)
          request.send(args ? $.param(args) : '')

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
      url: url,
      get (args) {
        return this.ajax('GET', args)
      },
      post (args) {
        return this.ajax('POST', args, 'application/x-www-form-urlencoded')
      },
      put (args) {
        return this.ajax('PUT', args, 'application/x-www-form-urlencoded')
      },
      delete (args) {
        return this.ajax('DELETE', args)
      },
      ajax (method, args, contentType) {
        return core.ajax(method, this.url, args, contentType)
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
  loadScript (url, documentBody) {
    return this.http(url).ajax('get', undefined, 'application/javascript').then((data) => {
      let scriptNode = document.createElement('script')
      scriptNode.innerHTML = data
      if (documentBody) {
        documentBody.appendChild(scriptNode)
      } else {
        document.body.appendChild(scriptNode)
      }
    })
  },
  appAllDone () {
    return Promise.all(processes).then(() => {
      processes = []
    })
  }
}
vcCake.addService('dataProcessor', Service)
