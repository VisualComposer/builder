import React from 'react'

const $ = window.jQuery

export default class LoadingScreen extends React.Component {
  static actionRequestFailed = false
  static localizations = window.VCV_I18N && window.VCV_I18N()
  static texts = {
    downloadingAssetsText: LoadingScreen.localizations ? LoadingScreen.localizations.downloadingAssets : 'Downloading assets {i} of {cnt}: {name}',
    downloadingInitialExtensionsText: LoadingScreen.localizations ? LoadingScreen.localizations.downloadingInitialExtensions : 'Downloading initial extensions',
    savingResultsText: LoadingScreen.localizations ? LoadingScreen.localizations.savingResults : 'Saving Results',
    postUpdateText: LoadingScreen.localizations ? LoadingScreen.localizations.postUpdateText : 'Update posts {i} in {cnt}: {name}',
    doNotCloseWhileUpdateText: LoadingScreen.localizations ? LoadingScreen.localizations.doNotCloseWhileUpdateText : 'Don\'t close this window while download is in the progress.',
    skipThisPostText: LoadingScreen.localizations ? LoadingScreen.localizations.skipThisPostText : 'Skip this post'
  }

  constructor (props) {
    super(props)

    this.state = {
      assetsActions: [],
      activeAssetsAction: 0,
      activePostUpdate: 0,
      error: null,
      showSkipPostButton: false,
      doneActions: false
    }

    this.setActions = this.setActions.bind(this)
    this.processActions = this.processActions.bind(this)
    this.doAction = this.doAction.bind(this)
    this.doneActions = this.doneActions.bind(this)
  }

  componentDidMount () {
    this.setActions()
  }

  setActions () {
    if (window.vcvActivationRequest !== 1) {
      let _this = this
      $.getJSON(window.VCV_UPDATE_ACTIONS_URL(),
        {
          'vcv-nonce': window.vcvNonce,
          'vcv-time': window.VCV_UPDATE_AJAX_TIME()
        })
        .done(function (json) {
          if (json && json.status && json.actions) {
            const assetsActions = json.actions.filter(item => item.action !== 'updatePosts')
            _this.setState({ assetsActions: assetsActions })
            _this.processActions()
          } else {
            console.log('error')

            if (json.message) {
              try {
                let messageJson = JSON.parse(json.message)
                if (messageJson) {
                  console.log('messageJson', messageJson)
                } else {
                  console.log('activationFailedText')
                }
              } catch (e) {
                console.warn(e, json.message)
              }
            } else {
              console.log('activationFailedText')
            }
            console.log('show first screen')
          }
        })
        .fail(function (jqxhr, textStatus, error) {
          console.log('fail error')
          if (jqxhr.responseJSON) {
            let json = jqxhr.responseJSON
            if (json.message) {
              try {
                let messageJson = JSON.parse(json.message)
                if (messageJson) {
                  console.log('messageJson', messageJson)
                } else {
                  console.log('activationFailedText')
                }
              } catch (e) {
                console.warn(e, json.message)
              }
            } else {
              console.log('activationFailedText')
            }
          } else {
            console.log('activationFailedText')
          }
          console.log('show first screen')
          console.warn(jqxhr.responseText, textStatus, error)
        })
    }
  }

  getDownloadText () {
    const { assetsActions, activeAssetsAction, doneActions } = this.state

    if (doneActions) {
      return <p className='vcv-activation-loading-text'>{LoadingScreen.texts.savingResultsText}</p>
    }

    if (assetsActions.length) {
      const activeActionData = assetsActions[ activeAssetsAction ]
      const loadingText = LoadingScreen.texts.downloadingAssetsText.replace('{i}', activeAssetsAction + 1).replace('{cnt}', assetsActions.length).replace('{name}', activeActionData.name)
      return <p className='vcv-activation-loading-text'>{loadingText}</p>
    } else {
      return <p className='vcv-activation-loading-text'>{LoadingScreen.texts.downloadingInitialExtensionsText}</p>
    }
  }

  processActions () {
    let cnt = this.state.assetsActions.length

    if (!cnt) {
      this.doneActions()
    } else {
      this.doAction()
    }
  }

  doAction () {
    let cnt = this.state.assetsActions.length
    let action = this.state.assetsActions[ this.state.activeAssetsAction ]

    if (action.action && action.action === 'updatePosts') {
      console.log('updatePosts')
    }

    const _this = this

    $.ajax(window.VCV_UPDATE_PROCESS_ACTION_URL(),
      {
        dataType: 'json',
        data: {
          'vcv-hub-action': action,
          'vcv-nonce': window.vcvNonce,
          'vcv-time': window.VCV_UPDATE_AJAX_TIME()
        }
      }
    ).done(function (json) {
      if (json && json.status) {
        LoadingScreen.actionRequestFailed = false

        if (_this.state.activeAssetsAction === cnt - 1) {
          _this.doneActions(false)
        } else {
          _this.setState({ activeAssetsAction: _this.state.activeAssetsAction + 1 })
          _this.doAction()
        }
      } else {
        if (LoadingScreen.actionRequestFailed) {
          try {
            // let messageJson = JSON.parse(json && json.message ? json.message : '""')
            if (window.vcvActivationType !== 'premium') {
              console.log('show error and first screen')
            } else {
              console.log('show oops screen')
            }
          } catch (e) {
            console.warn(e)
            console.log('show oops screen')
          }
        } else {
          LoadingScreen.actionRequestFailed = true
          _this.doAction()
        }
      }
    }).fail(function (jqxhr, textStatus, error) {
      console.log('error')
      if (LoadingScreen.actionRequestFailed) {
        console.log('log error')
        try {
          // let responseJson = JSON.parse(jqxhr.responseText ? jqxhr.responseText : '""')
          // let messageJson = JSON.parse(responseJson && responseJson.message ? responseJson.message : '""')
          if (window.vcvActivationType !== 'premium') {
            console.log('show error and first screen')
          } else {
            console.log('show oops screen')
          }
        } catch (e) {
          console.warn(e)
          console.log('show oops screen')
        }
      } else {
        // Try again one more time.
        LoadingScreen.actionRequestFailed = true
        _this.doAction()
      }
    })
  }

  doneActions (requestFailed) {
    this.setState({ doneActions: true })
    const _this = this
    $.ajax(window.VCV_UPDATE_FINISH_URL(),
      {
        dataType: 'json',
        data: {
          'vcv-nonce': window.vcvNonce,
          'vcv-time': window.VCV_UPDATE_AJAX_TIME()
        }
      }
    ).done(function (json) {
      if (json && json.status) {
        _this.props.setActiveScreen('finalScreen')
      } else {
        if (requestFailed) {
          console.warn(json)

          try {
            // let messageJson = JSON.parse(json && json.message ? json.message : '""')
            if (window.vcvActivationType !== 'premium') {
              console.log('show error and first screen')
            } else {
              console.log('show oops screen')
            }
          } catch (e) {
            console.warn(e)
            console.log('show oops screen')
          }
        } else {
          // Try again one more time.
          _this.doneActions()
        }
      }
    }).fail(function (jqxhr, textStatus, error) {
      console.log('fail')
      if (requestFailed) {
        console.warn(jqxhr.responseText, textStatus, error)
        if (window.vcvActivationType !== 'premium') {
          console.log('show error and first screen')
        } else {
          console.log('show oops screen')
        }
      } else {
        // Try again one more time.
        _this.doneActions()
      }
    })
  }

  skipPostUpdate () {
    console.log('skip post update')
  }

  render () {
    return (
      <div className='vcv-activation-loading-screen'>
        <div className='vcv-loading-dots-container'>
          <div className='vcv-loading-dot vcv-loading-dot-1' />
          <div className='vcv-loading-dot vcv-loading-dot-2' />
        </div>
        {this.getDownloadText()}
        <p className='vcv-activation-loading-helper-text'>
          {LoadingScreen.texts.doNotCloseWhileUpdateText}
        </p>
        {this.state.showSkipPostButton && (
          <div className='vcv-activation-button-container'>
            <button onClick={this.skipPostUpdate} className='vcv-activation-button'>Skip this post</button>
          </div>
        )}
      </div>
    )
  }
}
