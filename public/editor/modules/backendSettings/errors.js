let closeError = ($errorPopup) => {
  $errorPopup.removeClass('vcv-popup-error--active')
}
let errorTimeout
let showError = ($errorPopup, msg, timeout) => {
  if (!msg) { return }
  if (errorTimeout) {
    window.clearTimeout(errorTimeout)
    errorTimeout = 0
  }
  $errorPopup.find('.vcv-error-message').text(msg)
  $errorPopup.addClass('vcv-popup-error--active')

  if (timeout) {
    errorTimeout = window.setTimeout(closeError.bind(this, $errorPopup), timeout)
  }
}

module.exports = { showError: showError, closeError: closeError }
