/* eslint react/jsx-no-bind: "off" */
import React from 'react'
import ReactDOM from 'react-dom'
import classNames from 'classnames'
import _ from 'lodash'
import Textarea from 'react-textarea-autosize'

import Token from './token'

import '../css/tokenizationList/styles.less'
export default class TokenizationList extends React.Component {
  constructor (props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.handleKeyDown = this.handleKeyDown.bind(this)
    this.handleFocus = this.handleFocus.bind(this)
    this.handleBlur = this.handleBlur.bind(this)
    this.removeToken = this.removeToken.bind(this)
    this.updateValue = this.updateValue.bind(this)
    this.handleBodyClick = this.handleBodyClick.bind(this)
    this.handleSuggestionMouseDown = this.handleSuggestionMouseDown.bind(this)
  }
  static propTypes = {
    onChange: React.PropTypes.func.isRequired,
    value: React.PropTypes.string.isRequired,
    validator: React.PropTypes.func.isRequired,
    layouts: React.PropTypes.array.isRequired,
    suggestions: React.PropTypes.array.isRequired
  }
  state = {
    value: this.props.value,
    editing: false
  }
  stayEditing = false
  componentWillReceiveProps (nextProps) {
    this.setState({value: nextProps.value})
  }
  handleChange (e) {
    this.updateValue(e.target.value)
  }
  handleKeyDown (e) {
    let key = e.which || e.keyCode
    if (key === 13) {
      e.target.blur()
      this.setState({editing: false})
    }
  }
  updateValue (value) {
    this.setState({value: value})
    let layoutSplit = this.getLayout(value)
    this.props.onChange(layoutSplit)
  }
  handleFocus (e) {
    this.setState({editing: true})
  }
  handleBlur (e) {
    if (this.stayEditing === false) {
      this.setState({editing: false})
    } else {
      e.currentTarget.focus()
      this.stayEditing = false
    }
  }
  handleBodyClick (e) {
    if (e.target.getAttribute('data-vcv-type') !== 'vcv-tokenized-input' && !e.target.getAttribute('data-vcv-suggest')) {
      this.setState({editing: false})
      document.body.removeEventListener('click', this.handleBodyClick)
    }
  }
  getLayout (layout) {
    layout = layout.match(/\+$/) ? layout.replace(/\s+\+$/, '') : layout
    if (layout.match(/^[\s+\+]/)) {
      layout = layout.replace(/^[\s+\+]+/, '')
    }
    return layout.split(/[\s,\+;]+/)
  }
  removeToken (index) {
    let tokens = this.getLayout(this.state.value)
    let removedToken = tokens.splice(index, 1)
    removedToken && this.updateValue(tokens.join(' + '))
  }
  getTokensList () {
    let tokens = _.compact(this.getLayout(this.state.value))
    return tokens.map((token, index) => {
      return <Token key={'layoutToken' + index} title={token} removeCallback={this.removeToken} valid={this.props.validator(token)} index={index} />
    })
  }
  handleSuggestionMouseDown (e) {
    let value = this.state.value + e.currentTarget.getAttribute('data-vcv-suggest')
    this.setState({value: value})
    let layoutSplit = this.getLayout(value)
    this.props.onChange(layoutSplit)
    this.stayEditing = true
  }
  getSuggestions () {
    return this.state.value.length === 0 || this.state.value.match(/\+\s+$/) ? this.props.suggestions : []
  }
  getSuggestionItems () {
    let suggestions = this.getSuggestions()
    return suggestions.map((item, index) => {
      let cssClasses = classNames({
        'vcv-ui-suggest-box-item': true,
        'vcv-selected': false
      })
      return <span key={'vcvSuggestBoxItem' + index}
        className={cssClasses}
        onMouseDown={this.handleSuggestionMouseDown}
        data-vcv-suggest={item}
      >
        {item}
      </span>
    })
  }
  renderSuggestionBox () {
    if (this.state.editing === false) {
      return null
    }
    let items = this.getSuggestionItems()
    if (!items.length) {
      return null
    }
    let cssClasses = classNames({
      'vcv-ui-suggest-box': true
    })
    return <div className={cssClasses}>
      {items}
    </div>
  }
  render () {
    let tokens = this.state.editing ? null : this.getTokensList()
    let cssClasses = classNames({
      'vcv-ui-form-input': true,
      'vcv-ui-tag-list-input': true,
      'vcv-ui-tag-list-input-editing-disabled': !this.state.editing
    })
    return <div className='vcv-ui-tag-list-container'>
      <div className='vcv-ui-tag-list'>
        {tokens}
      </div>
      <Textarea
        minRows={1}
        className={cssClasses}
        type='text'
        onChange={this.handleChange}
        onKeyDown={this.handleKeyDown}
        value={this.state.value}
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
        data-vcv-type='vcv-tokenized-input'
      />
      {this.renderSuggestionBox()}
    </div>
  }
}
