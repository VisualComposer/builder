import { showError } from './errors'
import { showFirstScreen, loadLastScreen, showLoadingScreen, showOopsScreen } from './screens'
import { default as PostUpdater } from './postUpdate'

(($) => {
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
          'vcv-nonce': window.vcvNonce,
          time: window.vcvAjaxTime
        }
      }
    ).done(function (json) {
      if (json && json.status) {
        loadLastScreen($errorPopup, loadAnimation, $popup)
      } else {
        if (requestFailed) {
          console.warn(json)
          try {
            let messageJson = JSON.parse(json && json.message ? json.message : '""')
            if (window.vcvActivationType !== 'premium') {
              showError($errorPopup, messageJson || activationFailedText, 15000)
              showFirstScreen($popup)
            } else {
              showOopsScreen($popup, messageJson || activationFailedText, premiumErrorCallback)
            }
          } catch (e) {
            console.warn(e)
            showOopsScreen($popup, activationFailedText, premiumErrorCallback)
          }
        } else {
          // Try again one more time.
          doneActions(true, $heading, downloadingInitialExtensionsText, savingResultsText, $errorPopup, activationFailedText, $popup)
        }
      }
    }).fail(function (jqxhr, textStatus, error) {
      if (requestFailed) {
        console.warn(jqxhr.responseText, textStatus, error || activationFailedText)
        if (window.vcvActivationType !== 'premium') {
          showError($errorPopup, activationFailedText, 15000)
          showFirstScreen($popup)
        } else {
          showOopsScreen($popup, activationFailedText, premiumErrorCallback)
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
      let action = actions[ i ]
      if (action.action && action.action === 'updatePosts') {
        const postUpdater = new PostUpdater(window.vcvElementsGlobalsUrl, window.vcvVendorUrl, window.vcvUpdaterUrl, $errorPopup, $popup)
        const localizations = window.VCV_I18N && window.VCV_I18N()
        const postUpdateText = localizations ? localizations.postUpdateText : 'Update posts {i} in {cnt}: {name}'
        const doUpdatePostAction = async (posts, postsIndex, finishCb) => {
          const postData = posts[ postsIndex ]
          $heading.text(postUpdateText.replace('{i}', postsIndex + 1).replace('{cnt}', posts.length).replace('{name}', postData.name || 'No name'))
          let ready = false
          try {
            await postUpdater.update(postData)
            ready = true
          } catch (e) {
            showOopsScreen($popup, e, premiumErrorCallback)
          }
          if (ready === false) {
            return
          }
          if (postsIndex + 1 < posts.length) {
            return doUpdatePostAction(posts, postsIndex + 1, finishCb)
          } else {
            finishCb()
          }
        }
        return doUpdatePostAction(action.data, 0, finishCb)
      }
      let name = action.name
      $heading.text(downloadingAssetsText.replace('{i}', i + 1).replace('{cnt}', cnt).replace('{name}', name))
      $.ajax(window.vcvActionsUrl,
        {
          dataType: 'json',
          data: {
            action: action,
            'vcv-nonce': window.vcvNonce,
            time: window.vcvAjaxTime
          }
        }
      ).done(function (json) {
        if (json && json.status) {
          requestFailed = false
          if (i === cnt - 1) {
            finishCb()
          } else {
            doAction(i + 1, finishCb)
          }
        } else {
          if (requestFailed) {
            console.warn(json)
            try {
              let messageJson = JSON.parse(json && json.message ? json.message : '""')
              if (window.vcvActivationType !== 'premium') {
                showError($errorPopup, messageJson || activationFailedText, 15000)
                showFirstScreen($popup)
              } else {
                showOopsScreen($popup, messageJson || activationFailedText, premiumErrorCallback)
              }
            } catch (e) {
              console.warn(e)
              showOopsScreen($popup, activationFailedText, premiumErrorCallback)
            }
          } else {
            // Try again one more time.
            requestFailed = true
            doAction(i, finishCb)
          }
        }
      }).fail(function (jqxhr, textStatus, error) {
        if (requestFailed) {
          console.warn(jqxhr.responseText, textStatus, error || activationFailedText)
          if (window.vcvActivationType !== 'premium') {
            showError($errorPopup, activationFailedText, 15000)
            showFirstScreen($popup)
          } else {
            showOopsScreen($popup, activationFailedText, premiumErrorCallback)
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

  module.exports = { doneActions: doneActions, processActions: processActions }
})(window.jQuery)
