import { getService, addService, env } from 'vc-cake'
import { deflate } from 'pako/lib/deflate'
import base64 from 'base-64'

let processes = []
let id = 1
const Service = {
  http (url) {
    // A small example of object
    const core = {
      // Method that performs the ajax request
      ajax: function (method, url, args, contentType) {
        // Creating a promise

        const promise = new Promise(function (resolve, reject) {
          // Instantiates the XMLHttpRequest
          const request = new window.XMLHttpRequest()
          request.open(method, url)
          contentType && request.setRequestHeader('Content-type', contentType)
          try {
            request.send(args ? window.jQuery.param(args) : '')
          } catch (e) {
            reject(this.statusText)
          }
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
        const key = id
        promise.key = key
        id++
        processes.push(promise)
        // Return the promise
        return promise.catch((rejected) => {
          console.warn('Ajax Request rejected', rejected)
          processes = processes.filter((pr) => { return pr.key !== key }) // Remove self from list
          throw rejected
        })
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
  appServerRequest (args) {
    const dataManager = getService('dataManager')
    const url = dataManager.get('ajaxUrl')
    args = Object.assign({
      'vcv-nonce': dataManager.get('nonce'),
      'vcv-source-id': dataManager.get('sourceID')
    }, args)

    if (env('VCV_JS_SAVE_ZIP')) {
      const binaryString = deflate(JSON.stringify(args), { to: 'string' })
      const encodedString = base64.encode(binaryString)
      args = {
        'vcv-zip': encodedString
      }
    }

    return this.http(url).post(args)
  },
  appAdminServerRequest (args) {
    const dataManager = getService('dataManager')
    const url = dataManager.get('adminAjaxUrl')
    args = Object.assign({
      'vcv-nonce': dataManager.get('nonce'),
      'vcv-source-id': dataManager.get('sourceID')
    }, args)

    if (env('VCV_JS_SAVE_ZIP')) {
      const binaryString = deflate(JSON.stringify(args), { to: 'string' })
      const encodedString = base64.encode(binaryString)
      args = {
        'vcv-zip': encodedString
      }
    }

    return this.http(url).post(args)
  },
  loadScript (url, documentBody) {
    return this.http(url).ajax('get', undefined, 'application/javascript').then((data) => {
      const scriptNode = document.createElement('script')
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
addService('dataProcessor', Service)
