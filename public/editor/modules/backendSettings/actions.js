import { showError } from './errors'
import { showFirstScreen, loadLastScreen } from './screens'
import $ from 'jquery'

let doneActions = (requestFailed, $heading, savingResultsText, $errorPopup, activationFailedText, $popup, loadAnimation) => {
  $heading.text(savingResultsText)
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
        showError($errorPopup, json.message ? json.message : activationFailedText, 15000)
        console.warn(json)
        showFirstScreen($popup)
      } else {
        // Try again one more time.
        doneActions(true, $heading, savingResultsText, $errorPopup, activationFailedText, $popup)
      }
    }
  }).fail(function (jqxhr, textStatus, error) {
    if (requestFailed) {
      showError($errorPopup, error, 15000)
      console.warn(textStatus, error)
      showFirstScreen($popup)
    } else {
      // Try again one more time.
      doneActions(true, $heading, savingResultsText, $errorPopup, activationFailedText, $popup)
    }
  })
}

let processActions = (actions, $heading, downloadingAssetsText, $errorPopup, activationFailedText, $popup, savingResultsText, loadAnimation) => {
  let cnt = actions.length
  let i = 0
  let requestFailed = false

  function doAction (i, finishCb) {
    let action = actions[ i ]
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
          showError($errorPopup, json.message ? json.message : activationFailedText, 15000)
          console.warn(json)
          showFirstScreen($popup)
        } else {
          // Try again one more time.
          requestFailed = true
          doAction(i, finishCb)
        }
      }
    }).fail(function (jqxhr, textStatus, error) {
      if (requestFailed) {
        showError($errorPopup, error, 15000)
        console.warn(textStatus, error)
        showFirstScreen($popup)
      } else {
        // Try again one more time.
        requestFailed = true
        doAction(i, finishCb)
      }
    })
  }

  if (!cnt) {
    doneActions(false, $heading, savingResultsText, $errorPopup, activationFailedText, $popup, loadAnimation)
  } else {
    doAction(i,
      doneActions.bind(this, false, $heading, savingResultsText, $errorPopup, activationFailedText, $popup, loadAnimation)
    )
  }
}

module.exports = { doneActions: doneActions, processActions: processActions }
