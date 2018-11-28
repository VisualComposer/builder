(() => {
  class CheckVersion {
    ajax () {
      const url = window.ajaxurl
      const request = new window.XMLHttpRequest()
      const requestData = {
        'vcv-action': 'checkVersion:adminNonce',
        'vcv-data': '',
        'vcv-nonce': window.vcvNonce
      }
      request.onreadystatechange = () => {
        if (request.readyState === 4) {
          console.log('request', request)
          this.successCallback(request.response)
        } else {
          this.errorCallback(request.response)
        }
      }
      request.open('GET', url, true)
      request.send(requestData)
    }

    successCallback (response) {
      console.log('success response', response)
    }

    errorCallback (response) {
      console.log('fail response', response)
    }
  }

  const checkVersion = new CheckVersion()
  checkVersion.ajax()
})(window.jQuery)
