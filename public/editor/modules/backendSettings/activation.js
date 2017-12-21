import { showError, closeError } from './errors'
import { send as sendError, messages as getErrorsMessages } from './logger'
import {
  showIntroScreen,
  showLoadingScreen,
  showFirstScreen,
  showLastScreen,
  showGoPremiumScreen,
  showLastGoPremiumScreen,
  showThankYouScreen
} from './screens'
import { loadSlider } from './slider'
import { showDownloadScreen, showDownloadWithLicenseScreen } from './download-screens'

(($) => {
  $(() => {
    let $popup = $('.vcv-popup-container')
    const localizations = window.VCV_I18N && window.VCV_I18N()
    const readAndAgreeTermsText = localizations ? localizations.readAndAgreeTerms : 'Please make sure to read and agree to our terms of service in order to activate and use Visual Composer Website Builder.'
    const incorrectEmailFormatText = localizations ? localizations.incorrectEmailFormat : 'Activation request failed. Invalid e-mail. Please check your e-mail and try again.'
    const mustAgreeToActivateText = localizations ? localizations.mustAgreeToActivate : 'To activate and use Visual Composer Website Builder, you must read and agree to the terms of service.'
    const activationFailedText = localizations ? localizations.activationFailed : 'Your activation request failed. Please try again.'
    const provideCorrectEmailText = localizations ? localizations.provideCorrectEmail : 'Please provide valid e-mail address'
    const savingResultsText = localizations ? localizations.savingResults : 'Saving Results'
    const downloadingInitialExtensionsText = localizations ? localizations.downloadingInitialExtensions : 'Downloading initial extensions'
    const downloadingAssetsText = localizations ? localizations.downloadingAssets : 'Downloading assets {i} of {cnt}'
    let ready = false
    if ($popup.length) {
      let $errorPopup = $('.vcv-popup-error')
      let $zoomContainer = $('.vcv-popup-loading-zoom')
      let $popupInner = $('.vcv-popup')
      let $inputEmail = $('#vcv-account-login-form-email')
      let $selectCategory = $('#vcv-account-login-form-category')
      let $selectPremiumCategory = $('#vcv-account-premium-form-category')
      let $agreementCheckbox = $('#vcv-account-activation-agreement')
      let $agreementPremiumCheckbox = $('#vcv-account-activation-premium-agreement')

      let loadAnimation = () => {
        let popupWidth = $popupInner[ 0 ].getBoundingClientRect().width
        let popupHeight = $popupInner[ 0 ].getBoundingClientRect().height

        let isWidthBigger = popupWidth > popupHeight
        let width = isWidthBigger ? popupWidth : popupHeight
        let circleWidth = width + width / 2

        $zoomContainer[ 0 ].style.width = circleWidth + 'px'
        $zoomContainer[ 0 ].style.height = circleWidth + 'px'

        let topPosition = isWidthBigger ? (popupWidth - popupHeight + width / 2) / 2 : (width / 4)
        let leftPosition = isWidthBigger ? (width / 4) : (popupHeight - popupWidth + width / 2) / 2
        $zoomContainer[ 0 ].style.top = -topPosition + 'px'
        $zoomContainer[ 0 ].style.left = -leftPosition + 'px'
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
          let category = $selectCategory.val()
          if (window.vcvActivationType === 'standalone') {
            email = 'standalone'
          }
          if (email) {
            showDownloadScreen($popup, $heading, downloadingInitialExtensionsText, email, $agreementCheckbox.val(), downloadingAssetsText, $errorPopup, activationFailedText, savingResultsText, loadAnimation, incorrectEmailFormatText, mustAgreeToActivateText, category)
          } else {
            // error shows\
            showError($errorPopup, provideCorrectEmailText)
          }
        }
      })

      $('#vcv-premium-activation-form').on('submit', (e) => {
        e.preventDefault()
        let checkboxStatus = $agreementPremiumCheckbox.is(':checked')
        let categoryVal = $selectPremiumCategory.val()
        let location = $('#vcv-activate-premium-button').attr('data-href')
        let category = encodeURIComponent(categoryVal)

        if (location) {
          if (location.indexOf('?') > -1) {
            location = `${location}&agreement=${checkboxStatus}?category=${category}`
          } else {
            location = `${location}?agreement=${checkboxStatus}&category=${category}`
          }
          window.location.href = location
        }
      })

      if (window.vcvActivationType !== 'standalone') {
        $('body').on('click', '.vcv-first-screen--active .vcv-popup-back-button, .vcv-go-premium-screen--active .vcv-popup-back-button', () => {
          showIntroScreen($popup)
        })
      }
      $('.vcv-popup-close-button').on('click', () => {
        window.location.href = 'index.php'
      })
      $('.vcv-popup-form-select').on('change', (e) => {
        var $el = $(e.currentTarget)
        $el.removeClass('vcv-select-light')
        if ($el.children('option:first-child').is(':selected')) {
          $el.addClass('vcv-select-light')
        }
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
      let url = src.match(/\((.*?)\)/)[ 1 ].replace(/('|")/g, '')

      let img = new window.Image()
      img.onload = () => {
        ready = true
        $popup.removeClass('vcv-popup-container--hidden')
        if (window.vcvActivationActivePage === 'last') {
          loadSlider()
          showLastScreen($popup)
        } else if (window.vcvActivationActivePage === 'last-go-premium') {
          loadSlider()
          showLastGoPremiumScreen($popup)
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

      $(document).on('click', '[data-vcv-send-error-report]', (e) => {
        e && e.preventDefault && e.preventDefault()
        $popup.find('.vcv-loading-text').hide()
        const localizations = window.VCV_I18N && window.VCV_I18N()
        const thankYouText = localizations && localizations.errorReportSubmitted ? localizations.errorReportSubmitted : 'We would like to acknowledge that we have received your request and a ticket has been created. A support representative will be reviewing your request and will send you a personal response.'

        sendError(e, function (response) {
          try {
            let jsonData = JSON.parse(response)
            if (jsonData.status) {
              showThankYouScreen($popup, thankYouText, function () {
                window.location.href = window.vcvDashboardUrl
              })
            } else {
              let messages = jsonData && jsonData.response && jsonData.response.messages ? jsonData.response.messages : window.vcvErrorReportDetails
              showFreshDesk(messages)
            }
          } catch (e) {
            showFreshDesk(window.vcvErrorReportDetails)
          }
        })

        function getFreshDeskSource (messages) {
          let jsErrors = getErrorsMessages()

          if (!messages && !jsErrors.length) {
            return 'https://visualcomposer.freshdesk.com/widgets/feedback_widget/new'
          }

          let descriptionMessage = ''
          let urlMessage = ''
          let themeMessage = ''
          let envDetailsMessage = ''

          function addMessage (message, key, value) {
            let messageToAdd = ''
            if (value instanceof Object) {
              messageToAdd = key ? `${key}: ${JSON.stringify(value)}` : JSON.stringify(value)
            } else {
              messageToAdd = key ? `${key}: ${value}` : value
            }
            messageToAdd = message === '' ? messageToAdd : `, ${messageToAdd}`
            return message + messageToAdd
          }

          if (jsErrors.length) {
            descriptionMessage = addMessage(descriptionMessage, `jsErrors`, jsErrors)
          }

          if (messages) {
            for (let key in messages) {
              if (messages.hasOwnProperty(key) && key !== 'request') {
                switch (key) {
                  case 'url':
                    urlMessage = addMessage(urlMessage, null, messages[ key ])
                    break
                  case 'active-theme':
                    themeMessage = addMessage(themeMessage, null, messages[ key ])
                    break
                  case 'version':
                    envDetailsMessage = addMessage(envDetailsMessage, key, messages[ key ])
                    break
                  case 'wp-version':
                    envDetailsMessage = addMessage(envDetailsMessage, key, messages[ key ])
                    break
                  default:
                    descriptionMessage = addMessage(descriptionMessage, key, messages[ key ])
                }
              }
            }
          }

          urlMessage = urlMessage.substring(0, 110)
          themeMessage = themeMessage.substring(0, 130)
          envDetailsMessage = envDetailsMessage.substring(0, 130)
          descriptionMessage = descriptionMessage.substring(0, 7000)

          return `https://visualcomposer.freshdesk.com/widgets/feedback_widget/new?&screenshot=no&helpdesk_ticket[custom_field][cf_stack_429987]=${descriptionMessage}&helpdesk_ticket[custom_field][url_of_your_page_where_problem_can_be_checked_429987]=${urlMessage}&helpdesk_ticket[custom_field][theme_in_use_name_url_429987]=${themeMessage}&helpdesk_ticket[custom_field][environment_details_429987]=${envDetailsMessage}`
        }

        function showFreshDesk (messages) {
          let ifrm = document.createElement('iframe')
          let iframeLoadTimes = 0

          ifrm.setAttribute('src', getFreshDeskSource(messages))
          ifrm.className = 'vcv-freshdesk-iframe'
          ifrm.addEventListener('load', function () {
            if (iframeLoadTimes > 0) {
              ifrm.style.display = 'none'
              showThankYouScreen($popup, thankYouText, function () {
                window.location.href = window.vcvDashboardUrl
              })
            }
            iframeLoadTimes++
          })
          ifrm.style.display = 'block'
          document.body.appendChild(ifrm)

          $('.vcv-popup-close-button').show()
        }

        closeError($errorPopup)
        showLoadingScreen($popup)
      })
    }
  })
})(window.jQuery)
