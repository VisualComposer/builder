let closeError = ($errorPopup) => {
  $errorPopup.removeClass('vcv-popup-error--active')
}
let errorTimeout
let showError = ($errorPopup, msg, timeout) => {
  if (errorTimeout) {
    window.clearTimeout(errorTimeout)
    errorTimeout = 0
  }
  $errorPopup.text(msg)
  $errorPopup.addClass('vcv-popup-error--active')

  if (timeout) {
    errorTimeout = window.setTimeout(
      () => {
        closeError($errorPopup)
      }, timeout)
  }
}

module.exports = { showError: showError, closeError: closeError }
