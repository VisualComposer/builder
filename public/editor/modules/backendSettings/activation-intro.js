import $ from 'jquery'
import { showFirstScreen } from './screens'

$(() => {
  let $popup = $('.vcv-popup-container')

  if ($popup.length) {
    $('.vcv-intro-button-lite').on('click', () => {
      showFirstScreen($popup)
      return false
    })
  }
})
