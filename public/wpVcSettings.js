(() => {
  class CheckVersion {
    getUpdateNotice () {
      const currentUrl = window.location.href
      const search = window.location.search
      const updateUrl = currentUrl.replace(search, '?page=vcv-update')
      return `<div class="notice notice-warning is-dismissible">
        <p>A new version of Visual Composer is available. <a href="${updateUrl}">Update.</a></p>
      </div>`
    }

    ajax () {
      const url = window.vcvAdminAjaxUrl
      const request = new window.XMLHttpRequest()
      const requestData = {
        'vcv-action': 'checkVersion:adminNonce',
        'vcv-data': '',
        'vcv-nonce': window.vcvNonce
      }
      request.onreadystatechange = () => {
        if (request.readyState === 4) {
          const response = JSON.parse(request.response)
          if (response && response.status) {
            this.successCallback(request.response)
          }
        }
      }
      request.open('GET', url, true)
      request.send(requestData)
    }

    successCallback (response) {
      const heading = document.querySelector('.vcv-settings h1')
      const notice = this.getUpdateNotice()
      heading.insertAdjacentHTML('afterend', notice)
    }

    errorCallback (response) {
      console.warn('Request failed: ', response.details)
    }
  }

  const checkVersion = new CheckVersion()
  checkVersion.ajax()
})(window.jQuery)
