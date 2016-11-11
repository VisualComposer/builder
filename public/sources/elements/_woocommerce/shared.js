let innerAjax

innerAjax = function (data, successCallback, failureCallback) {
  let request
  request = new window.XMLHttpRequest()
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
  request.send(window.$.param(data))

  return request
}

module.exports = innerAjax
