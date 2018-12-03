import './sources/less/wpsettings-update/init.less'
import { deflate } from 'pako/lib/deflate'
import base64 from 'base-64'

(($) => {
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
    let data = {}
    for (let i = 0; i < 10; i++) {
      let randomKey1 = generateRandomString(Math.floor(Math.random() * 91 + 10))
      data[ randomKey1 ] = {}
      for (let k = 0; k < 10; k++) {
        let randomKey2 = generateRandomString(Math.floor(Math.random() * 91 + 10))
        data[ randomKey1 ][ randomKey2 ] = {}
        for (let l = 0; l < 10; l++) {
          let randomKey3 = generateRandomString(Math.floor(Math.random() * 91 + 10))
          data[ randomKey1 ][ randomKey2 ][ randomKey3 ] = generateRandomString(Math.floor(Math.random() * 91 + 10))
        }
      }
    }
    data[ 'toTest' ] = {
      'toTest2': {
        'toTest3': 1
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

  const checkStatus = () => {
    const binaryString = deflate(JSON.stringify({
      'vcv-action': 'checkPayloadProcessing:adminNonce',
      'vcv-nonce': window.vcvNonce,
      'vcv-check-payload': generateFakeData()
    }), { to: 'string' })

    const encodedString = base64.encode(binaryString)
    const data = {
      'vcv-zip': encodedString
    }

    $.ajax(window.vcvAdminAjaxUrl, {
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
        let responseJson = JSON.parse(jqxhr.responseText ? jqxhr.responseText : '""')
        if (responseJson && responseJson.message) {
          console.warn(responseJson.message)
        }
      } catch (e) {
        console.warn(e)
      }
    })
  }

  checkStatus()

  const hoverTooltip = () => {
    const $tooltipIcon = $('.vcv-help-tooltip-icon')

    $tooltipIcon.mouseover((e) => {
      const $currentTarget = $(e.currentTarget)
      const container = $currentTarget.closest('.vcv-help')
      const tooltip = $currentTarget.next('.vcv-help-tooltip')

      container.addClass('vcv-help-tooltip--active')

      if (!elementInViewport(tooltip[ 0 ])) {
        tooltip.addClass('vcv-help-tooltip-position--top')
      }
    })

    $tooltipIcon.mouseleave((e) => {
      const $currentTarget = $(e.currentTarget)
      const container = $currentTarget.closest('.vcv-help')
      const tooltip = $currentTarget.next('.vcv-help-tooltip')

      container.removeClass('vcv-help-tooltip--active')

      tooltip.removeClass('vcv-help-tooltip-position--top')
    })

    const elementInViewport = (el) => {
      const rect = el.getBoundingClientRect()
      return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
      )
    }
  }

  hoverTooltip()
})(window.jQuery)
