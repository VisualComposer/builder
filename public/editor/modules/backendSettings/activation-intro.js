import { showFirstScreen, showAboutScreen } from './screens'

(($) => {
  $(() => {
    let $popup = $('.vcv-popup-container')

    if ($popup.length) {
      $('.vcv-intro-button-lite').on('click', () => {
        showFirstScreen($popup)
        return false
      })
    }
    if ($popup.length) {
      $('.vcv-intro-button-premium').on('click', () => {
        showAboutScreen($popup)
        return false
      })
    }
  })
})(window.jQuery)
