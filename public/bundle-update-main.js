import $ from 'jquery'
import './sources/less/wpupdates/init.less'

$(() => {
  const localizations = window.VCV_I18N && window.VCV_I18N()
  const bundleUpdateFailed = localizations ? localizations.bundleUpdateFailed : 'Bundle update failed... Please try again.'

  let $popup = $('.vcv-popup-container')
  let $errorPopup = $('.vcv-popup-error')
  let $retryButton = $('[data-vcv-retry]')
  let closeError = (cb) => {
    $errorPopup.removeClass('vcv-popup-error--active')
    if (cb && typeof cb === 'function') {
      cb()
    }
  }
  let errorTimeout
  let showError = (msg, timeout, cb) => {
    if (errorTimeout) {
      window.clearTimeout(errorTimeout)
      errorTimeout = 0
    }
    $errorPopup.text(msg)
    $errorPopup.addClass('vcv-popup-error--active')

    if (timeout) {
      errorTimeout = window.setTimeout(cb ? closeError.bind(this, cb) : closeError, timeout)
    }
  }

  let redirect = () => {
    if (window.vcvPageBack && window.vcvPageBack.length) {
      window.location.href = window.vcvPageBack
    } else {
      window.location.reload()
    }
  }

  let enableLoader = () => {
    $popup.addClass('vcv-loading-screen--active')
  }

  let disableLoader = () => {
    $popup.removeClass('vcv-loading-screen--active')
  }

  let showRetryButton = () => {
    $retryButton.removeClass('vcv-popup-button--hidden')
  }
  let hideRetryButton = () => {
    $retryButton.addClass('vcv-popup-button--hidden')
  }

  let showErrorMessage = () => {
    showError(bundleUpdateFailed)
    showRetryButton()
    disableLoader()
  }

  let serverRequest = () => {
    hideRetryButton()
    closeError()
    enableLoader()
    $.post(window.vcvAccountUrl, {
      'vcv-nonce': window.vcvNonce
    }, redirect).fail(showErrorMessage)
  }

  serverRequest()
  $(document).on('click', '[data-vcv-retry]', serverRequest)
})
