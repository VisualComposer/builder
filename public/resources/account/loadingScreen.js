import React from 'react'
// import { processActions } from './actions'

const $ = window.jQuery

export default class LoadingScreen extends React.Component {
  static actionRequestFailed = false

  constructor (props) {
    super(props)

    this.state = {
      actions: [],
      activeAction: 0,
      error: null
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
            _this.setState({ actions: json.actions })
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
    if (this.state.actions.length) {
      const activeActionData = this.state.actions[ this.state.activeAction ]
      return <p className='vcv-activation-loading-text'>Downloading bundle {this.state.activeAction + 1} of {this.state.actions.length}: {activeActionData.name}</p>
    } else {
      return <p className='vcv-activation-loading-text'>Downloading initial something</p>
    }
  }

  processActions () {
    let cnt = this.state.actions.length

    if (!cnt) {
      this.doneActions()
    } else {
      this.doAction()
    }
  }

  doAction () {
    let cnt = this.state.actions.length
    let action = this.state.actions[ this.state.activeAction ]

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

        if (_this.state.activeAction === cnt - 1) {
          _this.doneActions(false)
        } else {
          _this.setState({ activeAction: _this.state.activeAction + 1 })
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
      console.log('done')
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

  render () {
    return (
      <div className='vcv-activation-loading-screen'>
        <div className='vcv-loading-dots-container'>
          <div className='vcv-loading-dot vcv-loading-dot-1' />
          <div className='vcv-loading-dot vcv-loading-dot-2' />
        </div>
        {this.getDownloadText()}
        <p className='vcv-activation-loading-helper-text'>
          Don't close this window while download is in the progress.
        </p>
      </div>
    )
  }
}
