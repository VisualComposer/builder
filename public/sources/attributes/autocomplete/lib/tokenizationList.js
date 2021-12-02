/* eslint react/jsx-no-bind: "off" */
import React from 'react'
import PropTypes from 'prop-types'
import vcCake from 'vc-cake'
import classNames from 'classnames'
import { _, debounce } from 'lodash'
import Textarea from 'react-textarea-autosize'

import Token from './token'
import { getResponse } from 'public/tools/response'
import Tooltip from '../../../../components/tooltip/tooltip'

const dataManager = vcCake.getService('dataManager')

export default class TokenizationList extends React.Component {
  static propTypes = {
    validator: PropTypes.func.isRequired,
    validation: PropTypes.bool,
    elementAccessPoint: PropTypes.object.isRequired
  }

  stayEditing = false
  keydownTimeout = 0

  loadSuggestionsAfterStoppedTyping = debounce(
    (value) => {
      this.loadSuggestions(value[value.length - 1])
    },
    400);

  constructor (props) {
    super(props)
    let value = this.props.value
    if (!Array.isArray(value)) {
      value = value ? [value] : []
    }
    this.state = {
      value: value,
      editing: false,
      loading: false,
      validating: !!this.props.validation,
      inputValue: '',
      suggestedItems: [],
      loadTokenLabels: [],
      activeSuggestion: -1,
      suggestedValue: null,
      cursorPosition: null,
      addedSuggested: false
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleFocus = this.handleFocus.bind(this)
    this.handleBlur = this.handleBlur.bind(this)
    this.removeToken = this.removeToken.bind(this)
    this.handleTagListClick = this.handleTagListClick.bind(this)
    this.handleSuggestionMouseDown = this.handleSuggestionMouseDown.bind(this)
    this.handleKeyDown = this.handleKeyDown.bind(this)
    this.updateValue = this.updateValue.bind(this)

    this.loadTokenLabels(this.state.value)
  }

  handleKeyDown (e) {
    const key = e.which || e.keyCode
    let updateBoxPosition = true
    if (key === 40) {
      e.preventDefault()
      this.setActiveSuggestion(1)
      updateBoxPosition = false
    } else if (key === 38) {
      e.preventDefault()
      this.setActiveSuggestion(-1)
      updateBoxPosition = false
    } else if (key === 13 && this.state.activeSuggestion > -1) {
      e.preventDefault()
      this.updateValue(this.state.suggestedValue)
      this.setState({ addedSuggested: true })
    } else if (key === 13) {
      e.target.blur()
      this.setState({ editing: false })
    }
    updateBoxPosition && this.updateBoxPosition(e.target)
  }

  updateBoxPosition (el) {
    this.keydownTimeout = setTimeout(() => {
      const caret = window.jQuery(el).caret('offset')
      const offset = el.getBoundingClientRect()
      this.setState({
        cursorPosition: {
          top: offset.top + offset.height,
          left: caret.left
        }
      })
    }, 10)
  }

  setActiveSuggestion (incr) {
    const suggestions = this.state.suggestedItems
    const index = this.state.activeSuggestion + incr
    if (suggestions[index] !== undefined) {
      let value = this.state.inputValue.split(',')
      if (!this.checkValue(this.state.inputValue)) {
        value.pop()
        if (value.length > 0) {
          value = value + ', '
        }
      }
      this.setState({ activeSuggestion: index, suggestedValue: value + suggestions[index].value + ',' })
    }
  }

  updateValue (value) {
    let loading = true
    if (!value || this.checkValue(value)) {
      loading = false
    }

    this.setState({ inputValue: value, suggestedItems: [], callSuggestionAjax: true, loading: loading, suggestedValue: null, activeSuggestion: -1 })
  }

  handleChange (e) {
    this.updateValue(e.currentTarget.value)
    this.setState({ addedSuggested: false })
  }

  handleFocus (e) {
    let value = this.state.value.join(',')

    if (value.length) {
      value = value.replace(/,+$/, '') + ','
    }

    this.setState({ inputValue: value, editing: true })
  }

  handleBlur (e) {
    if (this.stayEditing === false) {
      this.setState({ editing: false })
    } else {
      e.currentTarget.focus()
      this.stayEditing = false
    }

    let value = this.state.inputValue.replace(/,+$/, '')
    value = value ? value.split(',') : []
    if (this.props.single) {
      value = [value[value.length - 1]]
      this.props.onChange(value[value.length - 1])
    } else {
      this.props.onChange(value)
    }
    this.setState({ value: value, validating: this.props.validation })
    this.loadTokenLabels(value)
  }

  handleTagListClick (e) {
    if (e.target === e.currentTarget) {
      if (!this.state.inputValue || !this.checkValue(this.state.inputValue)) {
        this.setState({ suggestedItems: [], loading: false })
      }
      this.handleFocus({ target: e.currentTarget.previousSibling })
      e.currentTarget.previousSibling.focus()
    }
  }

  checkValue (value) {
    const val = value.split(',')
    if (!val[val.length - 1].replace(/\s/g, '').length) {
      return true
    }
    return false
  }

  handleSuggestionMouseDown (e) {
    let { inputValue } = this.state
    inputValue = inputValue.split(',')
    inputValue.pop()
    inputValue.push(e.target.getAttribute('data-vcv-suggest-value'))

    this.setState({ value: inputValue, inputValue: inputValue.join(','), suggestedValue: null, activeSuggestion: -1, validating: this.props.validation })
    if (this.props.single) {
      this.props.onChange(inputValue[inputValue.length - 1])
    } else {
      this.props.onChange(inputValue)
    }
    this.stayEditing = true
  }

  componentWillUnmount () {
    if (this.serverRequest) {
      this.serverRequest.abort()
    }
    if (this.serverRequestLabels) {
      this.serverRequestLabels.abort()
    }
  }

  componentDidUpdate (prevProps, prevState) {
    this.updateSuggestBoxPosition()
    if (this.state.callSuggestionAjax && this.state.inputValue) {
      const value = this.state.inputValue.split(',')
      if (!this.checkValue(this.state.inputValue)) {
        this.loadSuggestionsAfterStoppedTyping(value)
      } else {
        if (_.size(prevState.suggestedItems) > 0) {
          this.setState({ suggestedItems: [], loading: false })
        }
      }
    }
  }

  updateSuggestBoxPosition () {
    if (this.state.editing === false) {
      return
    }

    const box = this.refs.suggestBox
    const boxRect = box ? box.getBoundingClientRect() : null

    if (boxRect) {
      const windowHeight = window.innerHeight
      const bottomOffset = windowHeight - boxRect.top - boxRect.height

      if (bottomOffset < 0) {
        box.style.left = `${boxRect.left + 10}px`

        if (windowHeight < boxRect.height) {
          box.style.top = '0px'
          box.style.maxHeight = `${windowHeight}px`
        } else {
          box.style.top = `${boxRect.top + bottomOffset - 1}px`
        }
      }
    }
  }

  loadSuggestions (search) {
    const ajax = vcCake.getService('utils').ajax
    if (this.serverRequest) {
      this.serverRequest.abort()
    }

    this.serverRequest = ajax({
      'vcv-action': 'autocomplete:findString:adminNonce',
      'vcv-search': search.trim(),
      'vcv-nonce': dataManager.get('nonce'),
      'vcv-tag': this.props.elementAccessPoint.tag,
      'vcv-param': this.props.fieldKey,
      'vcv-autocomplete-action': this.props.action,
      'vcv-element': this.props.elementAccessPoint.cook().toJS(),
      'vcv-source-id': dataManager.get('sourceID'),
      'vcv-return-value': this.props.returnValue
    }, (request) => {
      const response = getResponse(request.response)
      if (response.status && response.results && response.results.length) {
        this.setState({ suggestedItems: response.results, callSuggestionAjax: false, loading: false })
      }
    })
  }

  removeToken (index) {
    const valueCopy = this.state.value.slice()
    valueCopy.splice(index, 1)
    this.setState({ value: valueCopy, suggestedItems: [], loading: false })
    if (this.props.single) {
      if (valueCopy.length > 0) {
        this.props.onChange(valueCopy[valueCopy.length - 1].trim())
      } else {
        this.props.onChange('')
      }
    } else {
      this.props.onChange(valueCopy)
    }
  }

  getTokensList () {
    const tokens = this.state.value
    const reactTokens = []

    tokens.forEach((token, index) => {
      if (this.props.single && index > 0) {
        return false
      }
      token = token && token.trim()

      if (token && token.length) {
        let title = token
        let valid = false
        if (this.state.loadTokenLabels[token]) {
          title = this.state.loadTokenLabels[token]
          valid = true
        }

        if (!this.props.validation) {
          valid = true
        }

        reactTokens.push(
          <Token
            key={`vcvToken-${token}-${index}`}
            title={title}
            valid={this.props.validator(valid)}
            validating={this.state.validating}
            removeCallback={this.removeToken}
            value={token}
            index={index}
            label={this.props.single ? title : (this.props.tokenLabel === 'title' ? title : token)}
          />
        )
      }
    })

    return reactTokens
  }

  renderTokensList () {
    if (this.state.editing) {
      return null
    }
    const tokens = this.getTokensList()

    return <div className='vcv-ui-tag-list vcv-ui-form-input' onClick={this.handleTagListClick}>{tokens}</div>
  }

  loadTokenLabels (value) {
    const ajax = vcCake.getService('utils').ajax
    if (this.serverRequestLabels) {
      this.serverRequestLabels.abort()
    }
    this.serverRequestLabels = ajax({
      'vcv-action': 'autocomplete:getTokenLabels:adminNonce',
      'vcv-tokens': value,
      'vcv-nonce': dataManager.get('nonce'),
      'vcv-source-id': dataManager.get('sourceID'),
      'vcv-label-action': this.props.labelAction,
      'vcv-return-value': this.props.returnValue,
      'vcv-element': this.props.elementAccessPoint.cook().toJS()
    }, (request) => {
      if (request.response) {
        const labels = getResponse(request.response)
        if (labels) {
          this.setState({ loadTokenLabels: JSON.parse(request.response), validating: false })
        }
      }
    })
  }

  renderSuggestionBox () {
    if (this.state.editing === false) {
      return null
    }
    const items = this.state.suggestedItems
    if (!items || !items.length) {
      return null
    }
    const cssClasses = classNames({
      'vcv-ui-suggest-box': true,
      'vcv-ui-form-input': true,
      'vcv-ui-autocomplete': true
    })
    const reactItems = []
    if (!this.checkValue(this.state.inputValue) && !this.state.addedSuggested) {
      this.state.suggestedItems.forEach((item, index) => {
        const isActive = index === this.state.activeSuggestion
        const cssClasses = classNames({
          'vcv-ui-suggest-box-item': true,
          'vcv-selected': isActive
        })
        reactItems.push(
          <span
            key={'vcvSuggestBoxItem' + item.value}
            className={cssClasses}
            onMouseDown={this.handleSuggestionMouseDown}
            data-vcv-suggest={item.label}
            data-vcv-suggest-value={item.value}
          >
            {item.label}
          </span>
        )
      })

      return <div className={cssClasses} style={this.state.cursorPosition} ref='suggestBox'>{reactItems}</div>
    }
  }

  getLoading () {
    if (this.state.loading) {
      return <span className='vcv-ui-icon vcv-ui-wp-spinner' />
    }
  }

  render () {
    const cssClasses = classNames({
      'vcv-ui-form-input': true,
      'vcv-ui-tag-list-input': true,
      'vcv-ui-tag-list-input-editing-disabled': !this.state.editing
    })
    const containerClasses = classNames({
      'vcv-ui-tag-list-container': true
    }, this.props.extraClass)

    let description = ''
    if (this.props.description) {
      description = (
        <Tooltip
          relativeElementSelector='.vcv-ui-modal-content'
        >
          {this.props.description}
        </Tooltip>
      )
    }

    return (
      <>
        <div className={containerClasses}>
          <Textarea
            minRows={1}
            className={cssClasses}
            type='text'
            onChange={this.handleChange}
            value={this.state.inputValue}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
            data-vcv-type='vcv-tokenized-input'
            onKeyDown={this.handleKeyDown}
          />
          {this.renderSuggestionBox()}
          {this.renderTokensList()}
          {this.getLoading()}
        </div>
        {description}
      </>
    )
  }
}
