/* eslint react/jsx-no-bind: "off" */
import React from 'react'
import classNames from 'classnames'
import _ from 'lodash'
import Textarea from 'react-textarea-autosize'
import $ from 'jquery'
import 'jquery.caret'
import Token from './token'

import '../css/tokenizationList/styles.less'
export default class TokenizationList extends React.Component {
  constructor (props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.handleKeyDown = this.handleKeyDown.bind(this)
    this.handleKeyUp = this.handleKeyUp.bind(this)
    this.handleFocus = this.handleFocus.bind(this)
    this.handleBlur = this.handleBlur.bind(this)
    this.removeToken = this.removeToken.bind(this)
    this.updateValue = this.updateValue.bind(this)
    this.handleTagListClick = this.handleTagListClick.bind(this)
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
    editing: false,
    activeSuggestion: -1,
    suggestedValue: null,
    cursorPosition: null
  }
  stayEditing = false
  componentWillReceiveProps (nextProps) {
    this.setState({value: nextProps.value})
  }
  handleChange (e) {
    this.updateValue(e.target.value)
  }
  updateCursorPosition (el) {
    let offset = $(el).caret('offset')
    this.setState({cursorPosition: {
      top: offset.top + offset.height + 5,
      left: offset.left + 10
    }})
  }
  handleKeyDown (e) {
    let key = e.which || e.keyCode
    if (key === 40) {
      e.preventDefault()
      this.setActiveSuggestion(1)
    } else if (key === 38) {
      e.preventDefault()
      this.setActiveSuggestion(-1)
    } else if (key === 13 && this.state.activeSuggestion > -1) {
      this.updateValue(this.state.suggestedValue)
    } else if (key === 13) {
      e.target.blur()
      this.setState({editing: false})
    }
  }
  handleKeyUp (e) {
    this.state.cursorPosition === null && this.updateCursorPosition(e.target)
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
  handleSuggestionMouseDown (e) {
    let value = this.state.value + e.currentTarget.getAttribute('data-vcv-suggest')
    this.setState({value: value})
    let layoutSplit = this.getLayout(value)
    this.props.onChange(layoutSplit)
    this.stayEditing = true
  }
  handleTagListClick (e) {
    if (e.target === e.currentTarget) {
      this.handleFocus(e)
      e.currentTarget.nextSibling.focus()
    }
  }
  updateValue (value) {
    this.setState({value: value, suggestedValue: null, activeSuggestion: -1, cursorPosition: null})
    let layoutSplit = this.getLayout(value)
    this.props.onChange(layoutSplit)
  }
  setActiveSuggestion (incr) {
    let suggestions = this.getSuggestions()
    let index = this.state.activeSuggestion + incr
    if (suggestions[index] !== undefined) {
      this.setState({activeSuggestion: index, suggestedValue: this.state.value + suggestions[index]})
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
  getSuggestions () {
    return this.state.value.length === 0 || this.state.value.match(/\+\s+$/) ? this.props.suggestions : []
  }
  getSuggestionItems () {
    let suggestions = this.getSuggestions()
    return suggestions.map((item, index) => {
      let isActive = index === this.state.activeSuggestion
      let cssClasses = classNames({
        'vcv-ui-suggest-box-item': true,
        'vcv-selected': isActive
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
  renderTokensList () {
    if (this.state.editing) {
      return null
    }
    let tokens = this.getTokensList()
    return <div className='vcv-ui-tag-list vcv-ui-form-input' onClick={this.handleTagListClick}>
      {tokens}
    </div>
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
      'vcv-ui-suggest-box': true,
      'vcv-ui-form-input': true
    })

    return <div className={cssClasses} style={this.state.cursorPosition}>
      {items}
    </div>
  }
  render () {
    let cssClasses = classNames({
      'vcv-ui-form-input': true,
      'vcv-ui-tag-list-input': true,
      'vcv-ui-tag-list-input-editing-disabled': !this.state.editing
    })
    return <div className='vcv-ui-tag-list-container'>
      {this.renderTokensList()}
      <Textarea
        minRows={1}
        className={cssClasses}
        type='text'
        onChange={this.handleChange}
        onKeyDown={this.handleKeyDown}
        onKeyUp={this.handleKeyUp}
        value={this.state.suggestedValue || this.state.value}
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
        data-vcv-type='vcv-tokenized-input'
      />
      {this.renderSuggestionBox()}
    </div>
  }
}
