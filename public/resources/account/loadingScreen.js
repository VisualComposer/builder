import React from 'react'
import PostUpdater from '../../editor/modules/backendSettings/postUpdate'

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
      postUpdateData: null,
      activeAssetsAction: 0,
      activePostUpdate: 0,
      error: null,
      showSkipPostButton: false,
      assetsActionsDone: false,
      postUpdateDone: false,
      actionsStarted: false
    }

    this.setActions = this.setActions.bind(this)
    this.processActions = this.processActions.bind(this)
    this.doAction = this.doAction.bind(this)
    this.doneActions = this.doneActions.bind(this)
    this.doPostUpdate = this.doPostUpdate.bind(this)
    this.doUpdatePostAction = this.doUpdatePostAction.bind(this)
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
            const postUpdateActions = json.actions.filter(item => item.action === 'updatePosts')

            _this.setState({
              assetsActions: assetsActions,
              postUpdateData: postUpdateActions.length ? postUpdateActions[ 0 ] : null,
              actionsStarted: true,
              assetsActionsDone: !assetsActions.length
            })
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
    const { assetsActions, activeAssetsAction, postUpdateData, activePostUpdate, assetsActionsDone, postUpdateDone, actionsStarted } = this.state

    if (!actionsStarted) {
      return <p className='vcv-activation-loading-text'>{LoadingScreen.texts.downloadingInitialExtensionsText}</p>
    }

    // Show default actions if they are not finished
    if (!assetsActionsDone) {
      const activeActionData = assetsActions[ activeAssetsAction ]
      const loadingText = LoadingScreen.texts.downloadingAssetsText.replace('{i}', activeAssetsAction + 1).replace('{cnt}', assetsActions.length).replace('{name}', activeActionData.name)
      return <p className='vcv-activation-loading-text'>{loadingText}</p>
    }

    // Show default actions if they are not finished
    if (!postUpdateDone) {
      const activePostUpdateData = postUpdateData.data[ activePostUpdate ]
      const loadingText = LoadingScreen.texts.postUpdateText.replace('{i}', activePostUpdate + 1).replace('{cnt}', postUpdateData.data.length).replace('{name}', activePostUpdateData.name || 'No name')
      return <p className='vcv-activation-loading-text'>{loadingText}</p>
    }

    if (assetsActionsDone && postUpdateDone) {
      return <p className='vcv-activation-loading-text'>{LoadingScreen.texts.savingResultsText}</p>
    }
  }

  processActions () {
    let cnt = this.state.assetsActions.length

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
          _this.setState({ assetsActionsDone: true })
          if (_this.state.postUpdateData) {
            _this.doPostUpdate()
          } else {
            _this.doneActions(false)
          }
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

  doPostUpdate () {
    const postUpdater = new PostUpdater(window.VCV_UPDATE_GLOBAL_VARIABLES_URL(), window.VCV_UPDATE_VENDOR_URL(), window.VCV_UPDATE_WP_BUNDLE_URL())

    return this.doUpdatePostAction(postUpdater)
  }

  doUpdatePostAction = async (postUpdater) => {
    const { postUpdateData, activePostUpdate } = this.state
    const postData = postUpdateData.data[ activePostUpdate ]
    const posts = postUpdateData.data

    let ready = false
    const to = window.setTimeout(() => {
      console.log('skip button show')
    }, 60 * 1000)

    try {
      await postUpdater.update(postData)
      ready = true
    } catch (e) {
      console.log('log error')
      console.log('show oops screen')
    }
    window.clearTimeout(to)
    console.log('skip button hide')

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
