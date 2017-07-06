/* eslint react/jsx-no-bind: "off" */
import React from 'react'
import vcCake from 'vc-cake'
import classNames from 'classnames'
import _ from 'lodash'
import Textarea from 'react-textarea-autosize'
import 'jquery.caret'

import Token from './token'

export default class TokenizationList extends React.Component {

  static propTypes = {}

  stayEditing = false
  keydownTimeout = 0

  constructor (props) {
    super(props)
    let value = this.props.value
    if (!Array.isArray(value)) {
      value = value ? [ value ] : []
    }
    this.state = {
      value: value,
      editing: false,
      inputValue: '',
      suggestedItems: [],
      loadTokenLabels: []
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleFocus = this.handleFocus.bind(this)
    this.handleBlur = this.handleBlur.bind(this)
    this.removeToken = this.removeToken.bind(this)
    this.handleTagListClick = this.handleTagListClick.bind(this)
    this.handleSuggestionMouseDown = this.handleSuggestionMouseDown.bind(this)
  }

  handleChange (e) {
    this.setState({ inputValue: e.currentTarget.value, callSuggestionAjax: true })
  }

  handleFocus (e) {
    this.setState({ inputValue: this.state.value.join(', '), editing: true })
  }

  handleBlur (e) {
    let value = this.state.inputValue.split(',').map((i, index) => {
      return parseInt(i).toString()
    }).filter((i) => { return !isNaN(i) })

    this.setState({ editing: false, value: value })
    this.props.onChange(value)
    this.loadTokenLabels(value)
  }

  handleTagListClick (e) {
    if (e.target === e.currentTarget) {
      if (!this.state.inputValue || !this.checkValue(this.state.inputValue)) {
        this.setState({ suggestedItems: [] })
      }
      this.handleFocus({ target: e.currentTarget.previousSibling })
      e.currentTarget.previousSibling.focus()
    }
  }

  checkValue (value) {
    let val = value.split(',')
    if (!val[ val.length - 1 ].replace(/\s/g, '').length) {
      return true
    }
    return false
  }

  handleSuggestionMouseDown (e) {
    let { value } = this.state
    value.push(e.target.getAttribute('data-vcv-suggest-value'))//  label: e.target.getAttribute('data-vcv-suggest') }

    this.setState({ value: value, inputValue: value.join(', ') })
    this.props.onChange(value)
  }

  componentWillMount () {
    this.loadTokenLabels(this.state.value)
  }

  componentWillUpdate (nextProps, nextState) {
    if (nextState.callSuggestionAjax && nextState.inputValue) {
      let value = nextState.inputValue.split(',')
      if (!this.checkValue(nextState.inputValue)) {
        this.loadSuggestions(value[ value.length - 1 ])
      } else {
        if (_.size(this.state.suggestedItems) > 0) {
          this.setState({ suggestedItems: [] })
        }
      }
    }
  }

  loadSuggestions (search) {
    let ajax = vcCake.getService('utils').ajax
    if (this.serverRequest) {
      this.serverRequest.abort()
    }
    this.serverRequest = ajax({
      'vcv-action': 'autoComplete:findString:adminNonce',
      'vcv-search': search.trim(),
      'vcv-nonce': window.vcvNonce,
      'vcv-tag': this.props.element,
      'vcv-param': this.props.fieldKey,
      'vcv-source-id': window.vcvSourceID
    }, (request) => {
      if (request.response) {
        this.setState({ suggestedItems: JSON.parse(request.response), callSuggestionAjax: false }) // [{label:'',value:''}]
      }
    })
  }

  removeToken (index) {
    this.state.value.splice(index, 1)
    this.setState({ value: this.state.value, suggestedItems: [] })
    this.props.onChange(this.state.value)
  }

  getTokensList () {
    let tokens = this.state.value
    let reactTokens = []
    tokens.forEach((token, index) => {
      let title = token
      if (this.state.loadTokenLabels[ token ]) {
        title = this.state.loadTokenLabels[ token ]
      }
      reactTokens.push(<Token
        key={`vcvToken-${token}-${index}`}
        title={title}
        removeCallback={this.removeToken}
        value={token}
        index={index}
      />)
    })

    return reactTokens
  }

  renderTokensList () {
    if (this.state.editing) {
      return null
    }
    let tokens = this.getTokensList()
    return <div className='vcv-ui-tag-list vcv-ui-form-input' onClick={this.handleTagListClick}>
      {tokens}
    </div>
  }

  loadTokenLabels (value) {
    let ajax = vcCake.getService('utils').ajax
    if (this.serverRequestLabels) {
      this.serverRequestLabels.abort()
    }
    this.serverRequestLabels = ajax({
      'vcv-action': 'autoComplete:getTokenLabels:adminNonce',
      'vcv-tokens': value,
      'vcv-nonce': window.vcvNonce,
      'vcv-source-id': window.vcvSourceID
    }, (request) => {
      if (request.response) {
        this.setState({ loadTokenLabels: JSON.parse(request.response) })
      }
    })
  }

  renderSuggestionBox () {
    if (this.state.editing === false) {
      return null
    }
    let items = this.state.suggestedItems
    if (!items || !items.length) {
      return null
    }
    let cssClasses = classNames({
      'vcv-ui-suggest-box': true,
      'vcv-ui-form-input': true,
      'vcv-ui-autocomplete': true
    })
    let reactItems = []

    if (!this.checkValue(this.state.inputValue)) {
      this.state.suggestedItems.forEach((item) => {
        // let isActive = item.value === this.state.activeSuggestion
        let cssClasses = classNames({
          'vcv-ui-suggest-box-item': true
        })
        reactItems.push(<span key={'vcvSuggestBoxItem' + item.value}
          className={cssClasses}
          onMouseDown={this.handleSuggestionMouseDown}
          data-vcv-suggest={item.label}
          data-vcv-suggest-value={item.value}
        >
          {item.label}
        </span>)
      })

      return <div className={cssClasses} style={this.state.cursorPosition}>
        {reactItems}
      </div>
    }
  }

  render () {
    let cssClasses = classNames({
      'vcv-ui-form-input': true,
      'vcv-ui-tag-list-input': true,
      'vcv-ui-tag-list-input-editing-disabled': !this.state.editing
    })
    return <div className='vcv-ui-tag-list-container'>
      <Textarea
        minRows={1}
        className={cssClasses}
        type='text'
        onChange={this.handleChange}
        value={this.state.inputValue}
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
        data-vcv-type='vcv-tokenized-input'
      />
      {this.renderSuggestionBox()}
      {this.renderTokensList()}
    </div>
  }
}
