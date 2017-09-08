import $ from 'jquery'
import { closeError } from './errors'
import { loadSlider } from './slider'

let showIntroScreen = ($popup) => {
  $popup.removeClass('vcv-loading-screen--active vcv-first-screen--active vcv-last-screen--active vcv-intro-screen--active').addClass('vcv-intro-screen--active')
}
let showLoadingScreen = ($popup) => {
  $popup.removeClass('vcv-first-screen--active vcv-last-screen--active vcv-intro-screen--active').addClass('vcv-loading-screen--active')
}
let showFirstScreen = ($popup) => {
  $popup.removeClass('vcv-loading-screen--active vcv-last-screen--active vcv-intro-screen--active').addClass('vcv-first-screen--active')
}
let showLastScreen = ($popup) => {
  $popup.removeClass('vcv-loading-screen--active vcv-first-screen--active vcv-intro-screen--active').addClass('vcv-last-screen--active')
}

let loadLastScreen = ($errorPopup, loadAnimation, $popup) => {
  closeError($errorPopup)
  loadAnimation()
  $popup.addClass('vcv-form-loaded')

  function whichTransitionEvent () {
    let t
    let el = document.createElement('fakeelement')
    let transitions = {
      'transition': 'transitionend',
      'OTransition': 'oTransitionEnd',
      'MozTransition': 'transitionend',
      'WebkitTransition': 'webkitTransitionEnd'
    }

    for (t in transitions) {
      if (el.style[ t ] !== undefined) {
        return transitions[ t ]
      }
    }
  }

  let transitionEvent = whichTransitionEvent()

  $('.vcv-popup-loading-zoom').one(transitionEvent, (event) => {
    // last screen shows
    showLastScreen($popup)
    loadSlider()
  })
}

module.exports = { showIntroScreen: showIntroScreen, showLoadingScreen: showLoadingScreen, showFirstScreen: showFirstScreen, showLastScreen: showLastScreen, loadLastScreen: loadLastScreen }
