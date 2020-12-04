import React from 'react'
import { getStorage, getService } from 'vc-cake'
import Toggle from '../../../../../sources/attributes/toggle/Component'

const dataManager = getService('dataManager')
const localizations = dataManager.get('localizations')
const settingsStorage = getStorage('settings')

export default class Discussion extends React.Component {
  constructor (props) {
    super(props)

    const commentStatus = settingsStorage.state('commentStatus').get() || dataManager.get('commentStatus') || 'closed'
    const pingStatus = settingsStorage.state('pingStatus').get() || dataManager.get('pingStatus') || 'closed'

    this.state = {
      commentStatus: commentStatus,
      pingStatus: pingStatus
    }
    settingsStorage.state('commentStatus').set(commentStatus)
    settingsStorage.state('pingStatus').set(pingStatus)

    this.commentValueChangeHandler = this.commentValueChangeHandler.bind(this)
    this.pingValueChangeHandler = this.pingValueChangeHandler.bind(this)
  }

  commentValueChangeHandler (fieldKey, value) {
    if (value) {
      settingsStorage.state('commentStatus').set('open')
    } else {
      settingsStorage.state('commentStatus').set('closed')
    }
  }

  pingValueChangeHandler (fieldKey, value) {
    if (value) {
      settingsStorage.state('pingStatus').set('open')
    } else {
      settingsStorage.state('pingStatus').set('closed')
    }
  }

  getCommentToggle () {
    if (dataManager.get('commentStatus')) {
      return (
        <div className='vcv-ui-form-group vcv-ui-form-group-style--inline'>
          <Toggle
            fieldKey='discussion-comment-status'
            updater={this.commentValueChangeHandler}
            options={{ labelText: localizations.allowComments || 'Allow comments' }}
            value={this.state.commentStatus === 'open'}
          />
        </div>
      )
    }
  }

  getPingToggle () {
    if (dataManager.get('pingStatus')) {
      return (
        <div className='vcv-ui-form-group vcv-ui-form-group-style--inline'>
          <Toggle
            fieldKey='discussion-ping-status'
            updater={this.pingValueChangeHandler}
            options={{ labelText: localizations.allowPingbacks || 'Allow trackbacks and pingbacks on this page' }}
            value={this.state.pingStatus === 'open'}
          />
        </div>
      )
    }
  }

  render () {
    return (
      <>
        {this.getCommentToggle()}
        {this.getPingToggle()}
      </>
    )
  }
}
