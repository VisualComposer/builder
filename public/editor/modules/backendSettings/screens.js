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

module.exports = { showIntroScreen: showIntroScreen, showLoadingScreen: showLoadingScreen, showFirstScreen: showFirstScreen, showLastScreen: showLastScreen }
