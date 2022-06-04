import { getService, addService } from 'vc-cake'
const utils = getService('utils')
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

          let sendArgs = ''
          const dataManager = getService('dataManager')
          if (dataManager.get('isEnvJsSaveZip')) {
            if (args instanceof Blob) {
              request.setRequestHeader('Content-type', 'application/octet-stream')
              request.setRequestHeader('Content-Transfer-Encoding', 'binary')
            } else {
              request.setRequestHeader('Content-type', contentType)
            }

            if (args) {
              if (args instanceof Blob) {
                sendArgs = args
              } else {
                sendArgs = window.jQuery.param(args)
              }
            }
          } else {
            request.setRequestHeader('Content-type', contentType)

            if (args) {
              sendArgs = window.jQuery.param(args)
            }
          }

          try {
            request.send(sendArgs)
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
    return this.getServerRequest('ajaxUrl', args)
  },
  appAdminServerRequest (args) {
    return this.getServerRequest('adminAjaxUrl', args)
  },
  getServerRequest (type, args) {
    const dataManager = getService('dataManager')
    const url = dataManager.get(type)
    args = Object.assign({
      'vcv-nonce': dataManager.get('nonce'),
      'vcv-source-id': dataManager.get('sourceID')
    }, args)

    if (dataManager.get('isEnvJsSaveZip')) {
      const compressData = utils.compressData(args)

      if (compressData instanceof Blob) {
        args = compressData
      } else {
        args = {
          'vcv-zip': compressData
        }
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
