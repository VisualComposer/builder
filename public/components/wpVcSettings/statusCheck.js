import { deflate } from 'pako/lib/deflate'
import base64 from 'base-64'
import { getService } from 'vc-cake'

const dataManager = getService('dataManager')
const $ = window.jQuery
const $checkContainer = $('#vcv-large-content-status')

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

const setStatus = (status) => {
  if (status === 'success') {
    $checkContainer.addClass('good').removeClass('bad vcv-ui-wp-spinner').text('Success')
  } else {
    $checkContainer.addClass('bad').removeClass('good vcv-ui-wp-spinner').text('Failed')
  }
}

export const checkStatus = () => {
  if (!$checkContainer.length) {
    return
  }

  const binaryString = deflate(JSON.stringify({
    'vcv-action': 'settings:systemStatus:checkPayloadProcessing:adminNonce',
    'vcv-nonce': dataManager.get('nonce'),
    'vcv-check-payload': generateFakeData()
  }), { to: 'string' })

  const encodedString = base64.encode(binaryString)
  const data = {
    'vcv-zip': encodedString
  }

  const adminAjaxUrl = dataManager.get('adminAjaxUrl')
  $.ajax(adminAjaxUrl, {
    type: 'POST',
    dataType: 'json',
    async: true,
    data: data
  }).done((json) => {
    if (json && json.status) {
      setStatus('success')
    } else {
      setStatus('fail')
    }
  }).fail((jqxhr, textStatus, error) => {
    setStatus('fail')
    try {
      const responseJson = JSON.parse(jqxhr.responseText ? jqxhr.responseText : '""')
      if (responseJson && responseJson.message) {
        console.warn(responseJson.message)
      }
    } catch (e) {
      console.warn(e)
    }
  })
}
