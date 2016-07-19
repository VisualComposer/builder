/*eslint jsx-quotes: [2, "prefer-double"]*/
import React from 'react'
import lodash from 'lodash'
import Modal, {closeStyle} from 'simple-react-modal'
import Attribute from '../attribute'
import String from '../string/Component'
import Toggle from '../toggle/Component'
import './css/styles.less'

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
      'handleInputChange',
      'cancel',
      'open',
      'save'
    ]
    console.log('props.value', props.value)
    if (!lodash.isObject(props.value)) {
      this.state.value = { url: '', title: '', targetBlank: false, relNofollow: false }
    }

    this.unsavedStateValue = {}
    Object.assign(this.unsavedStateValue, this.state.value)

    this.state.isWindowOpen = false

    autobind.forEach((key) => {
      this[ key ] = this[ key ].bind(this)
    })
  }

  open () {
    Object.assign(this.unsavedStateValue, this.state.value)
    this.setState({ isWindowOpen: true })
  }

  hide () {
    this.unsavedStateValue = {}
    this.setState({ isWindowOpen: false })
  }

  cancel () {
    this.hide()
  }

  save () {
    this.setFieldValue(this.unsavedStateValue)
    this.hide()
  }

  handleInputChange (fieldKey, value) {
    this.unsavedStateValue[ fieldKey ] = value
  }

  render () {
    return (
      <div>
        <button onClick={this.open}>
          Select URL
        </button>

        <b>URL:</b> {this.state.value.url}
        &nbsp;
        <b>Title:</b> {this.state.value.title}

        <Modal
          show={this.state.isWindowOpen}
          onClose={this.cancel}>

          <a style={closeStyle} onClick={this.cancel}>X</a>

          <div className="vc_ui-form-group">
            <span className="vc_ui-form-group-heading">
             URL
            </span>
            <String
              fieldKey="url"
              value={this.state.value.url}
              updater={this.handleInputChange} />
          </div>

          <div className="vc_ui-form-group">
            <span className="vc_ui-form-group-heading">
             Link text
            </span>
            <String
              fieldKey="title"
              value={this.state.value.title}
              updater={this.handleInputChange} />
          </div>

          <div className="vc_ui-form-group">
            <span className="vc_ui-form-group-heading">
             Open link in a new tab
            </span>
            <Toggle
              fieldKey="targetBlank"
              value={this.state.value.targetBlank}
              updater={this.handleInputChange} />
          </div>

          <div className="vc_ui-form-group">
            <span className="vc_ui-form-group-heading">
             Add nofollow option to link
            </span>
            <Toggle
              fieldKey="relNofollow"
              value={this.state.value.relNofollow}
              updater={this.handleInputChange} />
          </div>

          <button onClick={this.cancel}>Cancel</button>
          <button onClick={this.save}>OK</button>

        </Modal>

      </div>
    )
  }
}
