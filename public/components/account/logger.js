import { getService } from 'vc-cake'

let errors = []

const logError = (message, details) => {
  const error = new Error()
  errors.push({
    message: message,
    details: details,
    stack: error && error.stack ? error.stack : []
  })
}

const getErrors = () => {
  return errors
}

const getErrorsMessages = () => {
  const messages = []

  errors.forEach((i) => {
    const message = i.message
    const code = i.details && i.details.codeNum ? i.details.codeNum : '#000'
    messages.push(
      message + ' code:' + code
    )
  })

  return messages.join(',')
}

const sendErrors = (e, cb) => {
  const dataManager = getService('dataManager')
  e && e.preventDefault && e.preventDefault()
  window.jQuery.ajax(
    {
      type: 'POST',
      url: dataManager.get('errorReportUrl'),
      data: {
        'vcv-nonce': dataManager.get('nonce'),
        errors: JSON.stringify(getErrors())
      }
    }
  ).always(cb).done((response) => {
    try {
      const jsonResponse = JSON.parse(response)
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
