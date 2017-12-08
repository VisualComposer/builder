import './sources/less/wpupdates/init.less'
import { default as PostUpdater } from './editor/modules/backendSettings/postUpdate'
import { log as logError, send as sendError, all as getErrors } from './editor/modules/backendSettings/logger'

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
      if (!msg) { return }
      if (errorTimeout) {
        window.clearTimeout(errorTimeout)
        errorTimeout = 0
      }
      $errorPopup.find('.vcv-error-message').text(msg)
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
            'vcv-time': window.vcvAjaxTime
          }
        }
      ).done(function (json) {
        if (json && json.status) {
          redirect()
        } else {
          if (requestFailed) {
            logError('Error in update process', {
              code: 'bundle-update-main-1',
              codeNum: '000016',
              vcvUpdateFinishedUrl: window.vcvUpdateFinishedUrl,
              json: json
            })
            showErrorMessage(json && json.message ? json.message : bundleUpdateFailed, 15000)
            console.warn(json)
          } else {
            // Try again one more time.
            doneActions(true)
          }
        }
      }).fail(function (jqxhr, textStatus, error) {
        if (requestFailed) {
          logError('Error in update process', {
            code: 'bundle-update-main-2',
            codeNum: '000017',
            vcvUpdateFinishedUrl: window.vcvUpdateFinishedUrl,
            jqxhr: jqxhr,
            textStatus: textStatus,
            error: error
          })
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
              logError('Error in update doAction post updater', {
                code: 'bundle-update-main-3',
                codeNum: '000018',
                vcvUpdateFinishedUrl: window.vcvUpdateFinishedUrl,
                error: e,
                action: action
              })
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
              'vcv-hub-action': action,
              'vcv-nonce': window.vcvNonce,
              'vcv-time': window.vcvAjaxTime
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
              logError('Error in update doAction', {
                code: 'bundle-update-main-4',
                codeNum: '000019',
                vcvActionsUrl: window.vcvActionsUrl,
                json: json
              })
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
            logError('Error in update doAction', {
              code: 'bundle-update-main-5',
              codeNum: '000020',
              vcvActionsUrl: window.vcvActionsUrl,
              jqxhr: jqxhr,
              textStatus: textStatus,
              error: error
            })
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
      $(document).on('click', '[data-vcv-send-error-report]', function (e) {
        e && e.preventDefault && e.preventDefault()
        hideRetryButton()
        closeError()
        enableLoader()
        $heading.text('')
        $heading.closest('.vcv-loading-text').hide()

        const localizations = window.VCV_I18N && window.VCV_I18N()

        sendError(e, function (response) {
          try {
            let jsonData = JSON.parse(response)
            if (jsonData.status) {
              window.alert(localizations && localizations.errorReportSubmitted ? localizations.errorReportSubmitted : 'Thanks! Error report has been sent!')
              window.location.href = window.vcvDashboardUrl
            } else {
              let messages = jsonData && jsonData.response && jsonData.response.messages
              showFreshDesk(messages)
            }
          } catch (e) {
            showFreshDesk()
          }
        })

        function getFreshDeskSource (messages) {
          let jsErrors = getErrors()

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
            jsErrors.map(function (error, index) {
              delete error.stack
              descriptionMessage = addMessage(descriptionMessage, `Error${index}`, error)
            })
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
          descriptionMessage = `<br><br><br><br><br> ****************************** <br>${descriptionMessage}`

          return `https://visualcomposer.freshdesk.com/widgets/feedback_widget/new?&screenshot=no&helpdesk_ticket[description]=${descriptionMessage}&helpdesk_ticket[custom_field][url_of_your_page_where_problem_can_be_checked_429987]=${urlMessage}&helpdesk_ticket[custom_field][theme_in_use_name_url_429987]=${themeMessage}&helpdesk_ticket[custom_field][environment_details_429987]=${envDetailsMessage}`
        }

        function showFreshDesk (messages) {
          let ifrm = document.createElement('iframe')
          let iframeLoadTimes = 0

          ifrm.setAttribute('src', getFreshDeskSource(messages))
          ifrm.className = 'vcv-freshdesk-iframe'
          ifrm.addEventListener('load', function () {
            if (iframeLoadTimes > 0) {
              ifrm.style.display = 'none'
              window.alert(localizations && localizations.errorReportSubmitted ? localizations.errorReportSubmitted : 'Thanks! Error report has been sent!')
              window.location.href = window.vcvDashboardUrl
            }
            iframeLoadTimes++
          })
          ifrm.style.display = 'block'
          document.body.appendChild(ifrm)

          $('.vcv-popup-close-button').show()
        }
      })
    } else {
      disableLoader()
    }
  })
})(window.jQuery)
