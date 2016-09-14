/* eslint react/jsx-no-bind: "off" */
import React from 'react'
import classNames from 'classnames'
import _ from 'lodash'
import Textarea from 'react-textarea-autosize'

import Token from './token'
import SuggestBox from './suggestBox'

import '../css/tokenizationList/styles.less'

export default class TokenizationList extends React.Component {
  constructor (props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.handleKeyPress = this.handleKeyPress.bind(this)
    this.handleFocus = this.handleFocus.bind(this)
    this.removeToken = this.removeToken.bind(this)
    this.updateValue = this.updateValue.bind(this)
    this.handleBodyClick = this.handleBodyClick.bind(this)
    this.updateFromSuggestion = this.updateFromSuggestion.bind(this)
  }
  static propTypes = {
    onChange: React.PropTypes.func.isRequired,
    value: React.PropTypes.string.isRequired,
    validator: React.PropTypes.func.isRequired,
    layouts: React.PropTypes.array.isRequired
  }
  state = {
    value: this.props.value,
    editing: false,
    suggestionActivated: false
  }
  componentWillReceiveProps (nextProps) {
    this.setState({value: nextProps.value})
  }
  handleChange (e) {
    this.updateValue(e.target.value)
  }
  handleKeyPress (e) {
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
  updateFromSuggestion (value) {
    this.setState({value: value, editing: false})
    let layoutSplit = this.getLayout(value)
    this.props.onChange(layoutSplit)
    document.body.removeEventListener('click', this.handleBodyClick)
  }
  handleFocus () {
    this.setState({editing: true})
    document.body.addEventListener('click', this.handleBodyClick)
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
  convertLayouts () {
    return this.props.layouts.map((columns) => {
      return columns.join(' + ')
    })
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
        onKeyPress={this.handleKeyPress}
        value={this.state.value}
        onFocus={this.handleFocus}
        onBlur={this.handleFocus}
        data-vcv-type='vcv-tokenized-input'
      />
      <SuggestBox
        value={this.state.value}
        suggestions={this.convertLayouts()}
        updateCallback={this.updateFromSuggestion}
        show={this.state.editing}
        activated={this.state.suggestionActivated}
      />
    </div>
  }
}
