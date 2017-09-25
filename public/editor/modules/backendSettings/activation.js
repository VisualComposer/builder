import $ from 'jquery'
import {showError} from './errors'
import {showIntroScreen, showLoadingScreen, showFirstScreen, showLastScreen, showGoPremiumScreen} from './screens'
import {loadSlider} from './slider'
import {showDownloadScreen, showDownloadWithLicenseScreen} from './download-screens'

$(() => {
  let $popup = $('.vcv-popup-container')
  const localizations = window.VCV_I18N && window.VCV_I18N()
  const readAndAgreeTermsText = localizations ? localizations.readAndAgreeTerms : 'Please make sure to read and agree to our terms of service in order to activate and use Visual Composer Website Builder.'
  const incorrectEmailFormatText = localizations ? localizations.incorrectEmailFormat : 'Your activation request failed due to the e-mail address format. Please check your e-mail address and try again.'
  const mustAgreeToActivateText = localizations ? localizations.mustAgreeToActivate : 'To activate and use Visual Composer Website Builder, you must read and agree to the terms of service.'
  const activationFailedText = localizations ? localizations.activationFailed : 'Your activation request failed. Please try again.'
  const provideCorrectEmailText = localizations ? localizations.provideCorrectEmail : 'Please provide correct E-Mail'
  const savingResultsText = localizations ? localizations.savingResults : 'Saving Results'
  const downloadingInitialExtensionsText = localizations ? localizations.downloadingInitialExtensions : 'Downloading initial extensions'
  const downloadingAssetsText = localizations ? localizations.downloadingAssets : 'Downloading assets {i} of {cnt}'
  let ready = false
  if ($popup.length) {
    let $errorPopup = $('.vcv-popup-error')
    let $zoomContainer = $('.vcv-popup-loading-zoom')
    let $popupInner = $('.vcv-popup')
    let $inputEmail = $('#vcv-account-login-form-email')
    let $agreementCheckbox = $('#vcv-account-activation-agreement')

    let loadAnimation = () => {
      let popupWidth = $popupInner[0].getBoundingClientRect().width
      let popupHeight = $popupInner[0].getBoundingClientRect().height

      let isWidthBigger = popupWidth > popupHeight
      let width = isWidthBigger ? popupWidth : popupHeight
      let circleWidth = width + width / 2

      $zoomContainer[0].style.width = circleWidth + 'px'
      $zoomContainer[0].style.height = circleWidth + 'px'

      let topPosition = isWidthBigger ? (popupWidth - popupHeight + width / 2) / 2 : (width / 4)
      let leftPosition = isWidthBigger ? (width / 4) : (popupHeight - popupWidth + width / 2) / 2
      $zoomContainer[0].style.top = -topPosition + 'px'
      $zoomContainer[0].style.left = -leftPosition + 'px'
    }

    let $heading = $('.vcv-popup-loading-screen .vcv-popup-loading-heading')

    $('#vcv-account-login-form').on('submit', (e) => {
      e.preventDefault()

      let checkbox = $agreementCheckbox.is(':checked')
      if (!checkbox) {
        showError(readAndAgreeTermsText)
        return
      }

      if (window.vcvActivationType !== 'download') {
        let email = $inputEmail.val()
        if (window.vcvActivationType === 'standalone') {
          email = 'standalone'
        }
        if (email) {
          showDownloadScreen($popup, $heading, downloadingInitialExtensionsText, email, $agreementCheckbox, downloadingAssetsText, $errorPopup, activationFailedText, savingResultsText, loadAnimation, incorrectEmailFormatText, mustAgreeToActivateText)
        } else {
          // error shows\
          showError($errorPopup, provideCorrectEmailText)
        }
      }
    })

    let back = true
    if (window.vcvActivationType !== 'standalone' && back) {
      $('body').on('click', '.vcv-first-screen--active .vcv-popup-back-button, .vcv-go-premium-screen--active .vcv-popup-back-button', () => {
        showIntroScreen($popup)
      })
    } else {
      $('.vcv-popup-back-button').hide()
    }
    $('.vcv-popup-close-button').on('click', () => {
      window.location.href = 'index.php'
    })

    $(document.body).on('click', function (e) {
      if (ready) {
        var $el = $(e.target)
        if ($el.closest('.vcv-loading-screen--active').length || $el.is('.vcv-loading-screen--active') || $el.closest('.vcv-popup').length || $el.is('.vcv-popup')) {
          return
        } else {
          window.location.href = 'index.php'
        }
      }
    })

    let src = $popupInner.css('background-image')
    let url = src.match(/\((.*?)\)/)[1].replace(/('|")/g, '')

    let img = new window.Image()
    img.onload = () => {
      ready = true
      $popup.removeClass('vcv-popup-container--hidden')
      if (window.vcvActivationActivePage === 'last') {
        loadSlider()
        showLastScreen($popup)
      } else {
        showLoadingScreen($popup)
        if (window.vcvActivationActivePage === 'first' || window.vcvActivationType === 'standalone') {
          setTimeout(() => {
            showFirstScreen($popup)
          }, 300)
        } else if (window.vcvActivationActivePage === 'download') {
          setTimeout(() => {
            showDownloadWithLicenseScreen($popup, $heading, downloadingInitialExtensionsText, downloadingAssetsText, $errorPopup, activationFailedText, savingResultsText, loadAnimation)
          }, 300)
        } else if (window.vcvActivationActivePage === 'intro') {
          setTimeout(() => {
            showIntroScreen($popup)
          }, 300)
        } else if (window.vcvActivationActivePage === 'go-premium') {
          setTimeout(() => {
            showGoPremiumScreen($popup)
          }, 300)
        }
      }
    }
    img.src = url
  }
})
