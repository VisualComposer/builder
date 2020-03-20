import React from 'react'
import { getStorage } from 'vc-cake'
import { getResponse } from 'public/tools/response'

const settingsStorage = getStorage('settings')

export default class Popup extends React.Component {
  constructor (props) {
    super(props)
    const settingsPopup = settingsStorage.state('settingsPopup').get() || {}
    this.state = {
      isRequestInProcess: false,
      popupOnPageLoad: settingsPopup.popupOnPageLoad || { delay: 0 },
      popupOnExitIntent: settingsPopup.popupOnExitIntent || {},
      popupOnElementId: settingsPopup.popupOnElementId || { delay: 0, elementIdSelector: '' }
    }

    this.popupPosts = settingsStorage.state('popupPosts').get() || []

    if (this.popupPosts < 1) {
      this.loadPosts()
      this.state.isRequestInProcess = true
    }
  }

  componentWillUnmount () {
    if (this.postRequest) {
      this.postRequest.abort()
    }
  }

  ajaxPost (data, successCallback, failureCallback) {
    if (this.postRequest) {
      this.postRequest.abort()
    }
    const request = new window.XMLHttpRequest()
    request.open('POST', window.vcvAjaxUrl, true)
    request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
    request.onload = function () {
      if (request.status >= 200 && request.status < 400) {
        successCallback.call(this, request)
      } else {
        if (typeof failureCallback === 'function') {
          failureCallback.call(this, request)
        }
      }
    }.bind(this)
    request.send(window.jQuery.param(data))
    this.postRequest = request
  }

  loadPosts () {
    this.ajaxPost({
      'vcv-action': 'attribute:linkSelector:getPopups:adminNonce',
      'vcv-nonce': window.vcvNonce,
      'vcv-source-id': window.vcvSourceID
    }, (request) => {
      const posts = getResponse(request.response)
      this.postRequest = null
      if (posts) {
        this.popupPosts = posts
        settingsStorage.state('popupPosts').set(posts)
        this.setState({
          isRequestInProcess: false
        })
      }
    }, () => {
      this.postRequest = null
      this.setState({
        isRequestInProcess: false
      })
    })
  }

  handleInputChange (type, key, e) {
    const value = e.target.value
    const newState = this.state[type]
    newState[key] = value
    this.setState({
      [type]: newState
    })

    const popupData = settingsStorage.state('settingsPopup').get() || {}

    if (!popupData[type]) {
      popupData[type] = {}
    }

    popupData[type][key] = value
    settingsStorage.state('settingsPopup').set(popupData)
  }

  handleSelectChange (type, e) {
    const id = e.target.value
    const newState = this.state[type]
    newState.id = id
    this.setState({
      [type]: newState
    })

    const popupData = settingsStorage.state('settingsPopup').get() || {}

    if (!popupData[type]) {
      popupData[type] = {}
    }

    if (id) {
      popupData[type].id = id
    } else {
      delete popupData[type]
    }
    settingsStorage.state('settingsPopup').set(popupData)
  }

  renderExistingPosts (type) {
    const none = this.localizations ? this.localizations.none : 'None'
    const items = []

    this.popupPosts.forEach((post) => {
      const postTitle = post.title || post.id
      items.push(
        <option
          key={'vcv-selectable-post-url-' + post.id}
          value={post.id}
        >
          {postTitle}
        </option>
      )
    })

    return (
      <select
        className='vcv-ui-form-dropdown'
        value={this.state[type].id}
        onChange={this.handleSelectChange.bind(this, type)}
      >
        <option value=''>{none}</option>
        {items}
      </select>
    )
  }

  getDelayHtml (type) {
    return (
      <div className='vcv-ui-form-group'>
        <span className='vcv-ui-form-group-heading'>
          Delay (in seconds)
        </span>
        <input
          className='vcv-ui-form-input'
          value={this.state[type].delay}
          onChange={this.handleInputChange.bind(this, type, 'delay')}
          type='number'
        />
      </div>
    )
  }

  render () {
    let popupSelect = null
    let elementIdSelectorHtml = null

    if (this.state.popupOnElementId.id) {
      elementIdSelectorHtml = (
        <>
          <div className='vcv-ui-form-group'>
            <span className='vcv-ui-form-group-heading'>
              Element ID
            </span>
            <input
              className='vcv-ui-form-input'
              value={this.state.popupOnElementId.elementIdSelector}
              onChange={this.handleInputChange.bind(this, 'popupOnElementId', 'elementIdSelector')}
            />
          </div>
        </>
      )
    }

    if (this.state.isRequestInProcess) {
      popupSelect = (
        <span className='vcv-ui-wp-spinner' />
      )
    } else {
      popupSelect = (
        <div>
          <div className='vcv-ui-form-group'>
            <span className='vcv-ui-form-group-heading'>
              On page load
            </span>
            {this.renderExistingPosts('popupOnPageLoad')}
          </div>

          {this.state.popupOnPageLoad && this.state.popupOnPageLoad.id ? this.getDelayHtml('popupOnPageLoad') : null}

          <div className='vcv-ui-form-group'>
            <span className='vcv-ui-form-group-heading'>
              On exit intent
            </span>
            {this.renderExistingPosts('popupOnExitIntent')}
          </div>

          <div className='vcv-ui-form-group'>
            <span className='vcv-ui-form-group-heading'>
              On Element ID
            </span>
            {this.renderExistingPosts('popupOnElementId')}
          </div>

          {elementIdSelectorHtml}
          {this.state.popupOnElementId && this.state.popupOnElementId.id ? this.getDelayHtml('popupOnElementId') : null}

        </div>
      )
    }

    return (
      <div>
        {popupSelect}
      </div>
    )
  }
}
