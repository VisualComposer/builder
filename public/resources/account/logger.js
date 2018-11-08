let errors = []

let logError = (message, details) => {
  let error = new Error()
  errors.push({
    message: message,
    details: details,
    stack: error && error.stack ? error.stack : []
  })
}

let getErrors = () => {
  return errors
}

let getErrorsMessages = () => {
  let messages = []

  errors.forEach((i) => {
    let message = i.message
    let code = i.details && i.details.codeNum ? i.details.codeNum : '#000'
    messages.push(
      message + ' code:' + code
    )
  })

  return messages.join(',')
}

let sendErrors = (e, cb) => {
  e && e.preventDefault && e.preventDefault()
  window.jQuery.ajax(
    {
      type: 'POST',
      url: window.VCV_ERROR_REPORT_URL(),
      data: {
        'vcv-nonce': window.vcvNonce,
        errors: JSON.stringify(getErrors())
      }
    }
  ).always(cb).done((response) => {
    try {
      let jsonResponse = JSON.parse(response)
      if (jsonResponse && jsonResponse.status) {
        // reset list of errors
        errors = []
      }
    } catch (e) {
      console.warn(e)
    }
  })
}

module.exports = { log: logError, all: getErrors, messages: getErrorsMessages, send: sendErrors }
