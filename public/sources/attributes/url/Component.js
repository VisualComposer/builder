/*eslint jsx-quotes: [2, "prefer-double"]*/
import React from 'react'
import lodash from 'lodash'
import Modal from 'simple-react-modal'
import Attribute from '../attribute'
import String from '../string/Component'
import Checkbox from '../checkbox/Component'
import './css/styles.less'
import './css/modal.less'

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
      'onSearchChange',
      'performSearch',
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
    this.shouldRenderExistingPosts = !!window.vcvAjaxUrl

    autobind.forEach((key) => {
      this[ key ] = this[ key ].bind(this)
    })

    this.delayedSearch = lodash.debounce(this.performSearch, 800)
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

  loadPosts (search) {
    let that = this
    this.ajaxPost({
      'vcv-action': 'attribute:linkSelector:getPosts',
      'vcv-search': search,
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

    if (this.shouldRenderExistingPosts && this.state.posts === null) {
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

    // Checkboxes return either ["1"] or []. Cast to boolean.
    if ([ 'targetBlank', 'relNofollow' ].indexOf(fieldKey) !== -1) {
      value = value.length > 0
    }

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

    if (!this.state.posts || !this.state.posts.length) {
      return <div className="vcv-ui-form-no-content">
        There is no content with such term found.
      </div>
    }

    this.state.posts.map((post) => {
      items.push(<li key={'vcv-selectable-post-url-' + post.id} className="vcv-ui-selectable-posts-list-item">
        <a href={post.url} onClick={that.handlePostSelection}>
          {post.title} / {post.type}
        </a>
      </li>
      )
    })

    return (<ul className="vcv-ui-selectable-posts-list-container">
      {items}
    </ul>)
  }

  renderExistingPostsBlock () {
    if (!this.shouldRenderExistingPosts) {
      return
    }

    return (<div className="vcv-ui-form-group">
      <p className="vcv-ui-form-helper">
        Or link to existing content
      </p>
      <input
        type="search"
        className="vcv-ui-form-input"
        onChange={this.onSearchChange}
        placeholder="Search existing content"
      />
      {this.renderExistingPosts()}
    </div>)
  }

  onSearchChange (e) {
    e.persist()
    this.delayedSearch(e)
  }

  performSearch (e) {
    let keyword = e.target.value
    this.loadPosts(keyword)
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
          className="vcv-ui-modal"
          containerClassName="vcv-ui-modal-container"
          onClose={this.cancel}>

          <header>
            <h1>Insert or Edit Link</h1>
            <a className="vcv-ui-modal-close" onClick={this.cancel}>X</a>
          </header>

          <p className="vcv-ui-form-helper">
            Enter the destination URL
          </p>

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
             Title
            </span>
            <String
              fieldKey="title"
              value={this.state.unsavedValue.title}
              updater={this.handleInputChange} />
            <p className="vcv-ui-form-helper">
              Title attribute will be displayed on link hover
            </p>
          </div>

          <div className="vcv-ui-form-group">
            <Checkbox
              fieldKey="targetBlank"
              options={{ values: [{ label: 'Open link in a new tab', value: '1' }] }}
              value={this.state.unsavedValue.targetBlank ? [ '1' ] : []}
              updater={this.handleInputChange} />
          </div>

          <div className="vcv-ui-form-group">
            <Checkbox
              fieldKey="relNofollow"
              options={{ values: [{ label: 'Add nofollow option to link', value: '1' }] }}
              value={this.state.unsavedValue.relNofollow ? [ '1' ] : []}
              updater={this.handleInputChange} />
          </div>

          {this.renderExistingPostsBlock()}

          <footer>
            <button className="vcv-ui-button vcv-ui-button-default" onClick={this.cancel}>Cancel</button>
            <button className="vcv-ui-button vcv-ui-button-action" onClick={this.save}>OK</button>
          </footer>

        </Modal>

      </div>
    )
  }
}
