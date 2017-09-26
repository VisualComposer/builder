import {showFirstScreen, showGoPremiumScreen} from './screens'

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
        showGoPremiumScreen($popup)
        return false
      })
    }
  })
})(window.jQuery)
