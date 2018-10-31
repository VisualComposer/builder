import React from 'react'
import LoadingScreen from './loadingScreen'
import FinalScreen from './finalScreen'
import InitialScreen from './initialScreen'
import PostUpdater from './postUpdate'
import OopsScreen from './oopsScreen'

const $ = window.jQuery
const ActivationSectionContext = React.createContext()

export default class ActivationSectionProvider extends React.Component {
  static actionRequestFailed = false
  static activePage = window.VCV_SLUG && window.VCV_SLUG()
  static shouldDoUpdate = ActivationSectionProvider.activePage === 'vcv-update' || ActivationSectionProvider.activePage === 'vcv-upgrade' || ActivationSectionProvider.activePage === 'vcv-update-fe'

  constructor (props) {
    super(props)

    this.state = {
      assetsActions: [],
      postUpdateData: null,
      activeAssetsAction: 0,
      activePostUpdate: 0,
      error: null,
      showSkipPostButton: false,
      assetsActionsDone: false,
      postUpdateDone: false,
      actionsStarted: false,
      isLoadingFinished: false
    }

    this.setActions = this.setActions.bind(this)
    this.processActions = this.processActions.bind(this)
    this.doAction = this.doAction.bind(this)
    this.doneActions = this.doneActions.bind(this)
    this.doPostUpdate = this.doPostUpdate.bind(this)
    this.doUpdatePostAction = this.doUpdatePostAction.bind(this)
    this.setError = this.setError.bind(this)
    this.retryErrorAction = this.retryErrorAction.bind(this)
    this.setError = this.setError.bind(this)
    this.sendErrorReport = this.sendErrorReport.bind(this)
  }

  componentDidMount () {
    const { shouldDoUpdate } = ActivationSectionProvider
    if (shouldDoUpdate) {
      this.setActions()
    }
  }

  setActions () {
    this.setState({ error: null })
    if (window.vcvActivationRequest !== 1) {
      $.getJSON(window.VCV_UPDATE_ACTIONS_URL(),
        {
          'vcv-nonce': window.vcvNonce,
          'vcv-time': window.VCV_UPDATE_AJAX_TIME()
        })
        .done((json) => {
          if (json && json.status && json.actions) {
            const assetsActions = json.actions.filter(item => item.action !== 'updatePosts')
            const postUpdateActions = json.actions.filter(item => item.action === 'updatePosts')

            this.setState({
              assetsActions: assetsActions,
              postUpdateData: postUpdateActions.length ? postUpdateActions[ 0 ] : null,
              actionsStarted: true,
              assetsActionsDone: !assetsActions.length,
              postUpdateDone: !postUpdateActions.length
            })
            this.processActions()
          } else {
            console.log('log error')

            if (json.message) {
              try {
                let messageJson = JSON.parse(json.message)
                if (messageJson) {
                  this.setError({
                    message: messageJson,
                    errorAction: this.setActions,
                    errorReportAction: this.sendErrorReport
                  })
                } else {
                  this.setError({
                    errorAction: this.setActions,
                    errorReportAction: this.sendErrorReport
                  })
                }
              } catch (e) {
                console.warn(e, json.message)
                this.setError({
                  errorAction: this.setActions,
                  errorReportAction: this.sendErrorReport
                })
              }
            } else {
              this.setError({
                errorAction: this.setActions,
                errorReportAction: this.sendErrorReport
              })
            }
          }
        })
        .fail((jqxhr, textStatus, error) => {
          if (jqxhr.responseJSON) {
            let json = jqxhr.responseJSON
            if (json.message) {
              try {
                let messageJson = JSON.parse(json.message)
                if (messageJson) {
                  this.setError({
                    message: messageJson,
                    errorAction: this.setActions,
                    errorReportAction: this.sendErrorReport
                  })
                } else {
                  this.setError({
                    errorAction: this.setActions,
                    errorReportAction: this.sendErrorReport
                  })
                }
              } catch (e) {
                console.warn(e, json.message)
                this.setError({
                  errorAction: this.setActions,
                  errorReportAction: this.sendErrorReport
                })
              }
            } else {
              this.setError({
                errorAction: this.setActions,
                errorReportAction: this.sendErrorReport
              })
            }
          } else {
            this.setError({
              errorAction: this.setActions,
              errorReportAction: this.sendErrorReport
            })
          }
          console.warn(jqxhr.responseText, textStatus, error)
        })
    }
  }

  processActions () {
    const cnt = this.state.assetsActions.length

    if (!cnt) {
      if (this.state.postUpdateData) {
        this.doPostUpdate()
      } else {
        this.doneActions(false)
      }
    } else {
      this.doAction()
    }
  }

  doAction () {
    const cnt = this.state.assetsActions.length
    const action = this.state.assetsActions[ this.state.activeAssetsAction ]
    this.setState({ error: null })

    $.ajax(window.VCV_UPDATE_PROCESS_ACTION_URL(),
      {
        dataType: 'json',
        data: {
          'vcv-hub-action': action,
          'vcv-nonce': window.vcvNonce,
          'vcv-time': window.VCV_UPDATE_AJAX_TIME()
        }
      }
    ).done((json) => {
      if (json && json.status) {
        ActivationSectionProvider.actionRequestFailed = false

        if (this.state.activeAssetsAction === cnt - 1) {
          this.setState({ assetsActionsDone: true })
          if (this.state.postUpdateData) {
            this.doPostUpdate()
          } else {
            this.doneActions(false)
          }
        } else {
          this.setState({ activeAssetsAction: this.state.activeAssetsAction + 1 })
          this.doAction()
        }
      } else {
        if (ActivationSectionProvider.actionRequestFailed) {
          try {
            let messageJson = JSON.parse(json && json.message ? json.message : '""')
            this.setError({
              message: messageJson,
              errorAction: this.doAction,
              errorReportAction: this.sendErrorReport
            })
          } catch (e) {
            this.setError({
              errorAction: this.doAction,
              errorReportAction: this.sendErrorReport
            })
            console.warn(e)
          }
        } else {
          ActivationSectionProvider.actionRequestFailed = true
          this.doAction()
        }
      }
    }).fail((jqxhr, textStatus, error) => {
      if (ActivationSectionProvider.actionRequestFailed) {
        console.log('log error')
        try {
          let responseJson = JSON.parse(jqxhr.responseText ? jqxhr.responseText : '""')
          let messageJson = JSON.parse(responseJson && responseJson.message ? responseJson.message : '""')
          this.setError({
            message: messageJson,
            errorAction: this.doAction,
            errorReportAction: this.sendErrorReport
          })
        } catch (e) {
          this.setError({
            errorAction: this.doAction,
            errorReportAction: this.sendErrorReport
          })
          console.warn(e)
        }
      } else {
        // Try again one more time.
        ActivationSectionProvider.actionRequestFailed = true
        this.doAction()
      }
    })
  }

  doPostUpdate () {
    const postUpdater = new PostUpdater(window.VCV_UPDATE_GLOBAL_VARIABLES_URL(), window.VCV_UPDATE_VENDOR_URL(), window.VCV_UPDATE_WP_BUNDLE_URL())
    this.setState({ error: null })
    return this.doUpdatePostAction(postUpdater)
  }

  doUpdatePostAction = async (postUpdater) => {
    const { postUpdateData, activePostUpdate } = this.state
    const postData = postUpdateData.data[ activePostUpdate ]
    const posts = postUpdateData.data

    let ready = false
    const to = window.setTimeout(() => {
      this.setState({ showSkipPostButton: true })
    }, 60 * 1000)

    try {
      await postUpdater.update(postData)
      ready = true
    } catch (e) {
      console.log('log error')
      this.setError({
        errorAction: this.doPostUpdate,
        errorReportAction: this.sendErrorReport
      })
      console.warn(e)
    }
    window.clearTimeout(to)
    this.setState({ showSkipPostButton: false })

    if (ready === false) {
      return
    }

    if (activePostUpdate + 1 < posts.length) {
      this.setState({ activePostUpdate: activePostUpdate + 1 })
      return this.doUpdatePostAction(postUpdater)
    } else {
      this.doneActions(false)
    }
  }

  doneActions (requestFailed) {
    this.setState({ postUpdateDone: true })
    $.ajax(window.VCV_UPDATE_FINISH_URL(),
      {
        dataType: 'json',
        data: {
          'vcv-nonce': window.vcvNonce,
          'vcv-time': window.VCV_UPDATE_AJAX_TIME()
        }
      }
    ).done((json) => {
      if (json && json.status) {
        this.setState({ isLoadingFinished: true })
      } else {
        if (requestFailed) {
          console.warn(json)

          try {
            let messageJson = JSON.parse(json && json.message ? json.message : '""')
            this.setError({
              message: messageJson,
              errorAction: this.doneActions.bind(this, true),
              errorReportAction: this.sendErrorReport
            })
          } catch (e) {
            this.setError({
              errorAction: this.doneActions.bind(this, true),
              errorReportAction: this.sendErrorReport
            })
            console.warn(e)
          }
        } else {
          // Try again one more time.
          this.doneActions(true)
        }
      }
    }).fail((jqxhr, textStatus, error) => {
      if (requestFailed) {
        console.log('log error')
        this.setError({
          errorAction: this.doneActions.bind(this, true),
          errorReportAction: this.sendErrorReport
        })
        console.warn(jqxhr.responseText, textStatus, error)
      } else {
        // Try again one more time.
        this.doneActions(true)
      }
    })
  }

  redirect () {
    if (window.vcvPageBack && window.vcvPageBack.length) {
      window.location.href = window.vcvPageBack
    } else {
      window.location.reload()
    }
  }

  getActiveScreen () {
    const { activePage, shouldDoUpdate } = ActivationSectionProvider

    if (this.state.error) {
      return <OopsScreen />
    }

    if (shouldDoUpdate) {
      if (this.state.isLoadingFinished) {
        if (activePage === 'vcv-update-fe') { // Redirect to frontend editor after update is finished
          this.redirect()
        } else { // Show final screen if backend update
          return <FinalScreen />
        }
      } else {
        return <LoadingScreen />
      }
    } else if (activePage === 'vcv-about') {
      return <FinalScreen />
    } else if (activePage === 'vcv-go-premium') {
      return <InitialScreen />
    }
  }

  sendErrorReport () {
    console.log('send error report')
  }

  retryErrorAction () {
    console.log('retry action')
  }

  setError (errorData) { // message, errorAction, errorReportAction
    this.setState({ error: errorData })
  }

  render () {
    return (
      <ActivationSectionContext.Provider
        value={{
          ...this.state
        }}
      >
        <div className='vcv-activation-section'>
          {this.getActiveScreen()}
        </div>
      </ActivationSectionContext.Provider>
    )
  }
}

export const ActivationSectionConsumer = ActivationSectionContext.Consumer
