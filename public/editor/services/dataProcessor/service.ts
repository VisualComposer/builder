import { getService, addService } from 'vc-cake'
import { EditorWindow } from 'public/types/window'

declare const window: EditorWindow
declare const Blob: {
  prototype: Blob
  new (): Blob
}

type ObjectProperty = string|number|boolean|[]

type Argument = ObjectProperty|{
  [item:string]: ObjectProperty
}

interface ArgumentsObject {
  [item:string]: Argument
}

type Arguments = ArgumentsObject|Blob

type AjaxPromise = Promise<string>&{key?:number}

const utils = getService('utils')
let processes:AjaxPromise[] = []
let id = 1
const Service = {
  http (url:string) {
    // A small example of object
    const core = {
      // Method that performs the ajax request
      ajax: function (method:string, url:string, args:Arguments|undefined, contentType:string) {
        // Creating a promise
        const promise:AjaxPromise = new Promise(function (resolve, reject) {
          // Instantiates the XMLHttpRequest
          const request = new window.XMLHttpRequest()
          request.open(method, url)

          let sendArgs:string|Blob = ''
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
            const error = e ? 'Error occurred: ' + e : 'Error occured'
            reject(error)
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
      get (args:Arguments) {
        return this.ajax('GET', args, '')
      },
      post (args:Arguments) {
        return this.ajax('POST', args, 'application/x-www-form-urlencoded')
      },
      put (args:Arguments) {
        return this.ajax('PUT', args, 'application/x-www-form-urlencoded')
      },
      delete (args:Arguments) {
        return this.ajax('DELETE', args, '')
      },
      ajax (method:string, args:Arguments|undefined, contentType:string) {
        return core.ajax(method, this.url, args, contentType)
      }
    }
  },
  appServerRequest (args:Arguments) {
    return this.getServerRequest('ajaxUrl', args)
  },
  appAdminServerRequest (args:Arguments) {
    return this.getServerRequest('adminAjaxUrl', args)
  },
  getServerRequest (type:string, args:Arguments) {
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
  loadScript (url:string, documentBody:HTMLElement) {
    return this.http(url).ajax('get', undefined, 'application/javascript').then((data) => {
      const scriptNode:HTMLElement = document.createElement('script')
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
