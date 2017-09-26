import {processActions} from './actions'
import {showLoadingScreen, showFirstScreen, showOopsScreen} from './screens'
import {showError} from './errors'

(($) => {
  let showDownloadScreen = ($popup, $heading, downloadingInitialExtensionsText, email, $agreementCheckbox, downloadingAssetsText, $errorPopup, activationFailedText, savingResultsText, loadAnimation, incorrectEmailFormatText, mustAgreeToActivateText, category) => {
    // third / loading screen shows, loading starts here
    showLoadingScreen($popup)
    // loading ends / loaded
    // Assign handlers immediately after making the request,
    // and remember the jqxhr object for this request
    // #1. request for activation start
    // #2. get required actions.
    // #2.x. trigger required action loop
    // #2.x+1. if last action trigger end.
    $heading.text(downloadingInitialExtensionsText)
    $.getJSON(window.vcvActivationUrl,
      {
        email: email,
        category: category,
        agreement: $agreementCheckbox.val(),
        'vcv-nonce': window.vcvAdminNonce,
        time: window.vcvAjaxTime
      })
      .done(function (json) {
        // process actions.
        if (json && json.status && json.actions) {
          processActions(json.actions, $heading, downloadingInitialExtensionsText, downloadingAssetsText, $errorPopup, activationFailedText, $popup, savingResultsText, loadAnimation)
        } else {
          if (json.message) {
            try {
              let messageJson = JSON.parse(json.message)
              if (messageJson && messageJson.email) {
                showError($errorPopup, incorrectEmailFormatText, 15000)
              } else if (messageJson && messageJson.agreement) {
                showError($errorPopup, mustAgreeToActivateText, 15000)
              } else if (messageJson) {
                showError($errorPopup, messageJson, 15000)
              } else {
                showError($errorPopup, activationFailedText, 15000)
              }
            } catch (e) {
              showError($errorPopup, activationFailedText, 15000)
              console.warn(e, json.message)
            }
          } else {
            showError($errorPopup, activationFailedText, 15000)
          }
          showFirstScreen($popup)
        }
      })
      .fail(function (jqxhr, textStatus, error) {
        if (jqxhr.responseJSON) {
          let json = jqxhr.responseJSON
          if (json.message) {
            try {
              let messageJson = JSON.parse(json.message)
              if (messageJson && messageJson.email) {
                showError($errorPopup, incorrectEmailFormatText, 15000)
              } else if (messageJson && messageJson.agreement) {
                showError($errorPopup, mustAgreeToActivateText, 15000)
              } else if (messageJson) {
                showError($errorPopup, messageJson, 15000)
              } else {
                showError($errorPopup, activationFailedText, 15000)
              }
            } catch (e) {
              showError($errorPopup, activationFailedText, 15000)
              console.warn(e, json.message)
            }
          } else {
            showError($errorPopup, activationFailedText, 15000)
          }
        } else {
          showError($errorPopup, activationFailedText, 15000)
        }
        showFirstScreen($popup)
        console.warn(jqxhr.responseText, textStatus, error)
      })
  }

  let showDownloadWithLicenseScreen = ($popup, $heading, downloadingInitialExtensionsText, downloadingAssetsText, $errorPopup, activationFailedText, savingResultsText, loadAnimation) => {
    showLoadingScreen($popup)
    let errorCallback = () => {
      showDownloadWithLicenseScreen($popup, $heading, downloadingInitialExtensionsText, downloadingAssetsText, $errorPopup, activationFailedText, savingResultsText, loadAnimation)
    }
    $heading.text(downloadingInitialExtensionsText)
    $.getJSON(window.vcvActivationUrl,
      {
        'vcv-nonce': window.vcvAdminNonce,
        time: window.vcvAjaxTime
      })
      .done(function (json) {
        // process actions.
        if (json && json.status && json.actions) {
          processActions(json.actions, $heading, downloadingInitialExtensionsText, downloadingAssetsText, $errorPopup, activationFailedText, $popup, savingResultsText, loadAnimation)
        } else {
          if (json.message) {
            try {
              let messageJson = JSON.parse(json.message)
              if (messageJson) {
                showOopsScreen($popup, messageJson, errorCallback)
              } else {
                showOopsScreen($popup, activationFailedText, errorCallback)
              }
            } catch (e) {
              showOopsScreen($popup, activationFailedText, errorCallback)
              console.warn(e, json.message)
            }
          } else {
            showOopsScreen($popup, activationFailedText, errorCallback)
          }
        }
      })
      .fail(function (jqxhr, textStatus, error) {
        if (jqxhr.responseJSON) {
          let json = jqxhr.responseJSON
          if (json.message) {
            try {
              let messageJson = JSON.parse(json.message)
              if (messageJson) {
                showOopsScreen($popup, messageJson, errorCallback)
              } else {
                showOopsScreen($popup, activationFailedText, errorCallback)
              }
            } catch (e) {
              showOopsScreen($popup, activationFailedText, errorCallback)
              console.warn(e, json.message)
            }
          } else {
            showOopsScreen($popup, activationFailedText, errorCallback)
          }
        } else {
          showOopsScreen($popup, activationFailedText, errorCallback)
        }
        console.warn(jqxhr.responseText, textStatus, error)
      })
  }

  module.exports = { showDownloadScreen: showDownloadScreen, showDownloadWithLicenseScreen: showDownloadWithLicenseScreen }
})(window.jQuery)
