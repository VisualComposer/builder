let errors = []

let logError = (message, details) => {
  errors.push({
    message: message,
    details: details,
    stack: console.trace ? console.trace() : []
  })
}

let getErrors = () => {
  return errors
}

let sendErrors = () => {
  window.jQuery.ajax(
    {
      type: 'POST',
      url: window.vcvErrorReportUrl,
      data: {
        'vcv-nonce': window.vcvNonce,
        errors: JSON.stringify(getErrors())
      }
    }
  )
  // reset list of errors
  errors = []
}

module.exports = { log: logError, all: getErrors, send: sendErrors }
