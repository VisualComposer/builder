import { getService } from 'vc-cake'
import { getResponse } from 'public/tools/response'

const dataManager = getService('dataManager')

const generateRandomString = (length) => {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'
  let randomString = ''
  for (let i = 0; i < length; i++) {
    const num = Math.floor(Math.random() * chars.length)
    randomString += chars.substring(num, num + 1)
  }
  return randomString
}

const generateFakeData = () => {
  const data = {}
  for (let i = 0; i < 10; i++) {
    const randomKey1 = generateRandomString(Math.floor(Math.random() * 91 + 10))
    data[randomKey1] = {}
    for (let k = 0; k < 10; k++) {
      const randomKey2 = generateRandomString(Math.floor(Math.random() * 91 + 10))
      data[randomKey1][randomKey2] = {}
      for (let l = 0; l < 10; l++) {
        const randomKey3 = generateRandomString(Math.floor(Math.random() * 91 + 10))
        data[randomKey1][randomKey2][randomKey3] = generateRandomString(Math.floor(Math.random() * 91 + 10))
      }
    }
  }
  data.toTest = {
    toTest2: {
      toTest3: 1
    }
  }
  return data
}

const setStatus = (status, id) => {
  const systemStatusElement = document.getElementById(id)

  if (status === 'success') {
    systemStatusElement.classList.add('good')
    systemStatusElement.classList.remove('bad')
    systemStatusElement.classList.remove('vcv-ui-wp-spinner')
    systemStatusElement.innerHTML = 'Success'
  } else {
    systemStatusElement.classList.add('bad')
    systemStatusElement.classList.remove('good')
    systemStatusElement.classList.remove('vcv-ui-wp-spinner')
    systemStatusElement.innerHTML = 'Failed'
  }
}

export const checkStatus = () => {
  const dataProcessor = getService('dataProcessor')
  dataProcessor.appAdminServerRequest({
    'vcv-action': 'settings:systemStatus:checkPayloadProcessing:adminNonce',
    'vcv-nonce': dataManager.get('nonce'),
    'vcv-check-payload': generateFakeData()
  }).then((responseData) => {
    const json = getResponse(responseData)

    if (json.status) {
      setStatus('success', 'vcv-large-content-status')
    } else {
      setStatus('fail', 'vcv-large-content-status')
    }
  }, () => {
    setStatus('fail', 'vcv-large-content-status')
  })

  dataProcessor.appAdminServerRequest({
    'vcv-action': 'settings:systemStatus:checkAwsConnection:adminNonce',
    'vcv-nonce': dataManager.get('nonce'),
  }).then((responseData) => {
    const json = getResponse(responseData)

    if (json.status) {
      setStatus('success', 'vcv-aws-status')
    } else {
      setStatus('fail', 'vcv-aws-status')
    }
  }, () => {
    setStatus('fail', 'vcv-aws-status')
  })

  dataProcessor.appAdminServerRequest({
    'vcv-action': 'settings:systemStatus:checkAccountConnection:adminNonce',
    'vcv-nonce': dataManager.get('nonce'),
  }).then((responseData) => {
    const json = getResponse(responseData)

    if (json.status) {
      setStatus('success', 'vcv-account-status')
    } else {
      setStatus('fail', 'vcv-account-status')
    }
  }, () => {
    setStatus('fail', 'vcv-account-status')
  })
}
