import {showError} from './errors'
import {showFirstScreen, loadLastScreen, showLoadingScreen, showOopsScreen} from './screens'
import $ from 'jquery'

let doneActions = (requestFailed, $heading, downloadingInitialExtensionsText, savingResultsText, $errorPopup, activationFailedText, $popup, loadAnimation) => {
  $heading.text(savingResultsText)
  let premiumErrorCallback = () => {
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
    doneActions(requestFailed, $heading, savingResultsText, $errorPopup, activationFailedText, $popup, loadAnimation)
  }
  $.ajax(window.vcvActivationFinishedUrl,
    {
      dataType: 'json',
      data: {
        'vcv-nonce': window.vcvAdminNonce,
        time: window.vcvAjaxTime
      }
    }
  ).done(function (json) {
    if (json.status) {
      loadLastScreen($errorPopup, loadAnimation, $popup)
    } else {
      if (requestFailed) {
        console.warn(json)
        if (window.vcvActivationType !== 'premium') {
          showError($errorPopup, json.message ? json.message : activationFailedText, 15000)
          showFirstScreen($popup)
        } else {
          showOopsScreen($popup, json.message ? json.message : activationFailedText, premiumErrorCallback)
        }
      } else {
        // Try again one more time.
        doneActions(true, $heading, downloadingInitialExtensionsText, savingResultsText, $errorPopup, activationFailedText, $popup)
      }
    }
  }).fail(function (jqxhr, textStatus, error) {
    if (requestFailed) {
      console.warn(textStatus, error || activationFailedText)
      if (window.vcvActivationType !== 'premium') {
        showError($errorPopup, error || activationFailedText, 15000)
        showFirstScreen($popup)
      } else {
        showOopsScreen($popup, error || activationFailedText, premiumErrorCallback)
      }
    } else {
      // Try again one more time.
      doneActions(true, $heading, downloadingInitialExtensionsText, savingResultsText, $errorPopup, activationFailedText, $popup)
    }
  })
}

let processActions = (actions, $heading, downloadingInitialExtensionsText, downloadingAssetsText, $errorPopup, activationFailedText, $popup, savingResultsText, loadAnimation) => {
  let cnt = actions.length
  let i = 0
  let requestFailed = false
  let premiumErrorCallback = () => {
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
    processActions(actions, $heading, downloadingInitialExtensionsText, downloadingAssetsText, $errorPopup, activationFailedText, $popup, savingResultsText, loadAnimation)
  }

  function doAction (i, finishCb) {
    let action = actions[i]
    let name = action.name
    $heading.text(downloadingAssetsText.replace('{i}', i + 1).replace('{cnt}', cnt).replace('{name}', name))
    $.ajax(window.vcvActionsUrl,
      {
        dataType: 'json',
        data: {
          action: action,
          'vcv-nonce': window.vcvAdminNonce,
          time: window.vcvAjaxTime
        }
      }
    ).done(function (json) {
      if (json.status) {
        requestFailed = false
        if (i === cnt - 1) {
          finishCb()
        } else {
          doAction(i + 1, finishCb)
        }
      } else {
        if (requestFailed) {
          console.warn(json)
          if (window.vcvActivationType !== 'premium') {
            showError($errorPopup, json.message ? json.message : activationFailedText, 15000)
            showFirstScreen($popup)
          } else {
            showOopsScreen($popup, json.message ? json.message : activationFailedText, premiumErrorCallback)
          }
        } else {
          // Try again one more time.
          requestFailed = true
          doAction(i, finishCb)
        }
      }
    }).fail(function (jqxhr, textStatus, error) {
      if (requestFailed) {
        console.warn(textStatus, error || activationFailedText)
        if (window.vcvActivationType !== 'premium') {
          showError($errorPopup, error || activationFailedText, 15000)
          showFirstScreen($popup)
        } else {
          showOopsScreen($popup, error || activationFailedText, premiumErrorCallback)
        }
      } else {
        // Try again one more time.
        requestFailed = true
        doAction(i, finishCb)
      }
    })
  }

  if (!cnt) {
    doneActions(false, $heading, downloadingInitialExtensionsText, savingResultsText, $errorPopup, activationFailedText, $popup, loadAnimation)
  } else {
    doAction(i,
      doneActions.bind(this, false, $heading, downloadingInitialExtensionsText, savingResultsText, $errorPopup, activationFailedText, $popup, loadAnimation)
    )
  }
}

module.exports = {doneActions: doneActions, processActions: processActions}
