import './sources/less/wpupdates/init.less'
import { default as PostUpdater } from './editor/modules/backendSettings/postUpdate'

(($) => {
  $(() => {
    const localizations = window.VCV_I18N && window.VCV_I18N()
    const bundleUpdateFailed = localizations ? localizations.bundleUpdateFailed : 'Bundle update failed... Please try again.'
    const downloadingAssetsText = localizations ? localizations.downloadingAssets : 'Downloading assets {i} of {cnt}'
    const savingResultsText = localizations ? localizations.savingResults : 'Saving Results'
    const postUpdateText = localizations ? localizations.postUpdateText : 'Update posts {i} in {cnt}: {name}'

    let $loader = $('[data-vcv-loader]')
    let $errorPopup = $('.vcv-popup-error')
    let $retryButton = $('[data-vcv-error-description]')
    let $lockUpdate = $('[data-vcv-error-lock]')
    let $heading = $('.vcv-loading-text-main')

    let closeError = (cb) => {
      $errorPopup.removeClass('vcv-popup-error--active')
      if (cb && typeof cb === 'function') {
        cb()
      }
    }
    let errorTimeout
    let showError = (msg, timeout, cb) => {
      if (errorTimeout) {
        window.clearTimeout(errorTimeout)
        errorTimeout = 0
      }
      $errorPopup.text(msg)
      $errorPopup.addClass('vcv-popup-error--active')

      if (timeout) {
        errorTimeout = window.setTimeout(cb ? closeError.bind(this, cb) : closeError, timeout)
      }
    }

    let redirect = () => {
      if (window.vcvPageBack && window.vcvPageBack.length) {
        window.location.href = window.vcvPageBack
      } else {
        window.location.reload()
      }
    }

    let enableLoader = () => {
      $loader.removeClass('vcv-popup--hidden')
    }
    let disableLoader = () => {
      $loader.addClass('vcv-popup--hidden')
    }

    let showRetryButton = () => {
      $retryButton.removeClass('vcv-popup--hidden')
    }
    let hideRetryButton = () => {
      $retryButton.addClass('vcv-popup--hidden')
    }

    let showErrorMessage = (message, time) => {
      if (typeof message !== 'undefined') {
        showError(message, time)
      } else {
        showError(bundleUpdateFailed, time)
      }
      showRetryButton()
      disableLoader()
    }

    let doneActions = (requestFailed) => {
      $heading.text(savingResultsText)
      $.ajax(window.vcvUpdateFinishedUrl,
        {
          dataType: 'json',
          data: {
            'vcv-nonce': window.vcvNonce,
            time: window.vcvAjaxTime
          }
        }
      ).done(function (json) {
        if (json && json.status) {
          redirect()
        } else {
          if (requestFailed) {
            showErrorMessage(json && json.message ? json.message : bundleUpdateFailed, 15000)
            console.warn(json)
          } else {
            // Try again one more time.
            doneActions(true)
          }
        }
      }).fail(function (jqxhr, textStatus, error) {
        if (requestFailed) {
          showErrorMessage(error, 15000)
          console.warn(textStatus, error)
        } else {
          // Try again one more time.
          doneActions(true)
        }
      })
    }

    let processActions = (actions) => {
      let cnt = actions.length
      let i = 0
      let requestFailed = false

      function doAction (i, finishCb) {
        let action = actions[ i ]
        if (action.action && action.action === 'updatePosts') {
          const postUpdater = new PostUpdater(window.vcvElementsGlobalsUrl, window.vcvVendorUrl, window.vcvUpdaterUrl)
          const doUpdatePostAction = async (posts, postsIndex, finishCb) => {
            const postData = posts[ postsIndex ]
            $heading.text(postUpdateText.replace('{i}', postsIndex + 1).replace('{cnt}', posts.length).replace('{name}', postData.name || 'No name'))
            let ready = false
            try {
              await postUpdater.update(postData)
              ready = true
            } catch (e) {
              showErrorMessage(e)
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
              showErrorMessage(json && json.message ? json.message : bundleUpdateFailed, 15000)
              console.warn(json)
            } else {
              // Try again one more time.
              requestFailed = true
              doAction(i, finishCb)
            }
          }
        }).fail(function (jqxhr, textStatus, error) {
          if (requestFailed) {
            showErrorMessage(error, 15000)
            console.warn(textStatus, error)
          } else {
            // Try again one more time.
            requestFailed = true
            doAction(i, finishCb)
          }
        })
      }

      if (!cnt) {
        doneActions()
      } else {
        doAction(i, doneActions)
      }
    }

    let serverRequest = () => {
      hideRetryButton()
      closeError()
      enableLoader()
      processActions(window.vcvUpdateActions)
    }

    if (!$lockUpdate.length) {
      serverRequest()
      $(document).on('click', '[data-vcv-retry]', serverRequest)
    } else {
      disableLoader()
    }
  })
})(window.jQuery)
