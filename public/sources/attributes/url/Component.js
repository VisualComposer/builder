/*eslint jsx-quotes: [2, "prefer-double"]*/
import React from 'react'
import lodash from 'lodash'
import Modal, {closeStyle} from 'simple-react-modal'
import Attribute from '../attribute'
import String from '../string/Component'
import Toggle from '../toggle/Component'
import './css/styles.less'

var $ = require('jquery')

if (typeof Object.assign !== 'function') {
  Object.assign = function (target) {
    'use strict'
    if (target == null) {
      throw new TypeError('Cannot convert undefined or null to object')
    }

    target = Object(target)
    for (var index = 1; index < arguments.length; index++) {
      var source = arguments[ index ]
      if (source != null) {
        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[ key ] = source[ key ]
          }
        }
      }
    }
    return target
  }
}

export default class Component extends Attribute {

  constructor (props) {
    super(props)

    let autobind = [
      'renderExistingPosts',
      'handlePostSelection',
      'handleInputChange',
      'cancel',
      'open',
      'save'
    ]

    if (!lodash.isObject(props.value)) {
      this.state.value = { url: '', title: '', targetBlank: false, relNofollow: false }
    }

    this.state.unsavedValue = this.state.value
    this.state.isWindowOpen = false
    this.state.posts = null

    autobind.forEach((key) => {
      this[ key ] = this[ key ].bind(this)
    })
  }

  ajaxPost (data, successCallback, failureCallback) {
    var request = new window.XMLHttpRequest()
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
    request.send($.param(data))
  }

  loadPosts () {
    console.log('load posts')
    let that = this
    this.ajaxPost({
      'vcv-action': 'attribute:linkSelector:getPosts',
      'vcv-nonce': window.vcvNonce
    }, function (request) {
      let posts = JSON.parse(request.response || '{}')
      that.setState({ posts: posts })
    })
  }

  open () {
    let unsavedValue = {}
    Object.assign(unsavedValue, this.state.value)

    this.setState({
      unsavedValue: unsavedValue,
      isWindowOpen: true
    })

    if (this.state.posts === null) {
      this.loadPosts()
    }
  }

  hide () {
    this.setState({
      isWindowOpen: false,
      unsavedValue: {}
    })
  }

  cancel () {
    this.hide()
  }

  save () {
    this.setFieldValue(this.state.unsavedValue)
    this.hide()
  }

  handleInputChange (fieldKey, value) {
    let state = this.state.unsavedValue
    state[ fieldKey ] = value

    this.setState({ unsavedValue: state })
  }

  handlePostSelection (e) {
    e.preventDefault()

    this.urlInput.setFieldValue(e.target.href)
  }

  renderExistingPosts () {
    let that = this
    let items = []

    if (!this.state.posts) {
      return
    }

    this.state.posts.map((post) => {
      items.push(<li key={'vcv-selectable-post-url-' + post.id} className="vcv-ui-selectable-posts-list-item">
        <a href={post.url} onClick={that.handlePostSelection}>
          {post.title}
        </a>
      </li>
      )
    })

    return (<ul className="vcv-ui-selectable-posts-list-container">
      {items}
    </ul>)
  }

  render () {
    return (
      <div>

        <div className="vcv-ui-form-link">
          <button className="vcv-ui-button vcv-ui-form-link-button" onClick={this.open}>
            <i className="vcv-ui-icon vcv-ui-icon-link"></i>
            Select URL
          </button>
          <div className="vcv-ui-form-link-data">
            <span
              className="vcv-ui-form-link-title"
              data-vc-link-title="Title: "
              title={this.state.value.title}>
              {this.state.value.title}
            </span>
            <span
              className="vcv-ui-form-link-title"
              data-vc-link-title="Url: "
              title={this.state.value.url}>
              {this.state.value.url}
            </span>
          </div>
        </div>

        <Modal
          show={this.state.isWindowOpen}
          onClose={this.cancel}>

          <a style={closeStyle} onClick={this.cancel}>X</a>

          <div className="vcv-ui-form-group">
            <span className="vcv-ui-form-group-heading">
             URL
            </span>
            <String
              fieldKey="url"
              ref={(c) => { this.urlInput = c }}
              value={this.state.unsavedValue.url}
              updater={this.handleInputChange} />
          </div>

          <div className="vcv-ui-form-group">
            <span className="vcv-ui-form-group-heading">
             Link text
            </span>
            <String
              fieldKey="title"
              value={this.state.unsavedValue.title}
              updater={this.handleInputChange} />
          </div>

          <div className="vcv-ui-form-group">
            <span className="vcv-ui-form-group-heading">
             Open link in a new tab
            </span>
            <Toggle
              fieldKey="targetBlank"
              value={this.state.unsavedValue.targetBlank}
              updater={this.handleInputChange} />
          </div>

          <div className="vcv-ui-form-group">
            <span className="vcv-ui-form-group-heading">
             Add nofollow option to link
            </span>
            <Toggle
              fieldKey="relNofollow"
              value={this.state.unsavedValue.relNofollow}
              updater={this.handleInputChange} />
          </div>

          <div className="vcv-ui-form-group">
            <span className="vcv-ui-form-group-heading">
              Link to existing content
            </span>
            {this.renderExistingPosts()}
          </div>

          <button className="vcv-ui-button vcv-ui-button-default" onClick={this.cancel}>Cancel</button>
          <button className="vcv-ui-button vcv-ui-button-action" onClick={this.save}>OK</button>

        </Modal>

      </div>
    )
  }
}
