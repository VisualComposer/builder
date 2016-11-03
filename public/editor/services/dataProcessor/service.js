import vcCake from 'vc-cake'
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
          let client = new window.XMLHttpRequest()
          let uri = url

          if (args && (method === 'POST' || method === 'PUT')) {
            uri += '?'
            let argCount = 0
            for (let key in args) {
              if (args.hasOwnProperty(key)) {
                if (argCount++) {
                  uri += '&'
                }
                uri += encodeURIComponent(key) + '=' + encodeURIComponent(args[ key ])
              }
            }
          }

          client.open(method, uri)
          client.send()

          client.onload = function () {
            if (this.status >= 200 && this.status < 300) {
              // Performs the function "resolve" when this.status is equal to 2xx
              resolve(this.response)
            } else {
              // Performs the function "reject" when this.status is different than 2xx
              reject(this.statusText)
            }
          }
          client.onerror = function () {
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
      'get': function (args) {
        return core.ajax('GET', url, args)
      },
      'post': function (args) {
        return core.ajax('POST', url, args)
      },
      'put': function (args) {
        return core.ajax('PUT', url, args)
      },
      'delete': function (args) {
        return core.ajax('DELETE', url, args)
      }
    }
  },
  appServerRequest (args) {
    let url = window.vcvAjaxUrl
    args = Object.assign({
      'vcv-nonce': window.vcvNonce,
      'vcv-source-id': window.vcvSourceID
    }, args)
    return this.http(url).post(args)
  },
  allDone () {
    return Promise.all(processes).then(() => {
      processes = []
    })
  }
}
vcCake.addService('dataProcessor', Service)
