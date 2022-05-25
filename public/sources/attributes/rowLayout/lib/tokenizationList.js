/* eslint react/jsx-no-bind: "off" */
import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import _ from 'lodash'
import Textarea from 'react-textarea-autosize'

import Token from './token'

export default class TokenizationList extends React.Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired,
    validator: PropTypes.func.isRequired,
    layouts: PropTypes.array.isRequired,
    suggestions: PropTypes.array.isRequired,
    responsiveness: PropTypes.bool,
    device: PropTypes.string,
    index: PropTypes.number,
    onColumnHover: PropTypes.func.isRequired,
    activeColumn: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.bool
    ]),
    activeToken: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.bool
    ]),
    title: PropTypes.string
  }

  stayEditing = false
  keydownTimeout = 0

  constructor (props) {
    super(props)
    this.suggestBoxRef = React.createRef()
    this.state = {
      value: this.props.value,
      editing: false,
      activeSuggestion: -1,
      suggestedValue: null,
      cursorPosition: null,
      // DnD
      isPressed: false,
      lastPressed: 0,
      delta: 0,
      mouse: 0
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleKeyDown = this.handleKeyDown.bind(this)
    this.handleFocus = this.handleFocus.bind(this)
    this.handleBlur = this.handleBlur.bind(this)
    this.removeToken = this.removeToken.bind(this)
    this.updateValue = this.updateValue.bind(this)
    this.handleTagListClick = this.handleTagListClick.bind(this)
    this.handleSuggestionMouseDown = this.handleSuggestionMouseDown.bind(this)
    this.handleMouseOver = this.handleMouseOver.bind(this)
    this.handleMouseOut = this.handleMouseOut.bind(this)
  }

  componentWillUnmount () {
    if (this.keydownTimeout) {
      window.clearTimeout(this.keydownTimeout)
      this.keydownTimeout = 0
    }
  }

  componentDidUpdate (prevProps) {
    if (!_.isEqual(prevProps.value, this.props.value)) {
      this.setState({ value: this.props.value })
    }
    this.updateSuggestBoxPosition()
  }

  updateSuggestBoxPosition () {
    if (this.state.editing === false) {
      return
    }

    const box = this.suggestBoxRef.current
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

  handleChange (e) {
    this.setState({ value: e.target.value, suggestedValue: null, activeSuggestion: -1 })
  }

  updateCursorPosition (el) {
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

  handleKeyDown (e) {
    const key = e.which || e.keyCode
    let updateCursorPosition = true
    if (key === 40) {
      e.preventDefault()
      this.setActiveSuggestion(1)
      updateCursorPosition = false
    } else if (key === 38) {
      e.preventDefault()
      this.setActiveSuggestion(-1)
      updateCursorPosition = false
    } else if (key === 13 && this.state.activeSuggestion > -1) {
      this.updateValue(this.state.suggestedValue)
    } else if (key === 13) {
      e.target.blur()
      this.setState({ editing: false })
    }
    updateCursorPosition && this.updateCursorPosition(e.target)
  }

  handleFocus (e) {
    this.setState({ editing: true })
    this.updateCursorPosition(e.target)
  }

  handleBlur (e) {
    if (this.stayEditing === false) {
      this.setState({ editing: false })
    } else {
      e.currentTarget.focus()
      this.stayEditing = false
    }
    if (this.state.suggestedValue && (this.state.value !== this.state.suggestedValue)) {
      this.updateValue(this.state.suggestedValue)
    }
    // set default value to auto if the field is empty
    const value = e.target.value ? e.target.value : 'auto'
    this.updateValue(value)
  }

  handleSuggestionMouseDown (e) {
    const value = this.state.value + e.currentTarget.getAttribute('data-vcv-suggest')
    this.setState({ value: value, suggestedValue: null, activeSuggestion: -1 })
    const layoutSplit = this.props.device ? value : this.getLayout(value)
    const options = this.props.device ? {
      device: this.props.device,
      index: this.props.index
    } : false
    this.props.onChange(layoutSplit, options)
    this.stayEditing = true
  }

  handleTagListClick (e) {
    if (e.target === e.currentTarget) {
      this.handleFocus({ target: e.currentTarget.previousSibling })
      e.currentTarget.previousSibling.focus()
    }
  }

  handleHover (mouseOver) {
    if (this.props.device) {
      const options = {
        index: this.props.index,
        over: mouseOver,
        type: 'activeToken'
      }
      if (this.props.value !== this.state.value) {
        this.updateValue(this.state.value)
      }
      this.props.onColumnHover(options)
    }
  }

  handleMouseOver () {
    this.handleHover(true)
  }

  handleMouseOut () {
    this.handleHover(false)
  }

  updateValue (value) {
    const layoutSplit = this.props.device ? value : this.getLayout(value)
    const options = this.props.device ? {
      device: this.props.device,
      index: this.props.index
    } : false
    this.props.onChange(layoutSplit, options)
  }

  setActiveSuggestion (incr) {
    const suggestions = this.getSuggestions()
    const index = this.state.activeSuggestion + incr
    if (suggestions[index] !== undefined) {
      this.setState({ activeSuggestion: index, suggestedValue: this.state.value + suggestions[index].name })
    }
  }

  getLayout (layout) {
    layout = layout.match(/\+$/) ? layout.replace(/\s+\+$/, '') : layout
    if (layout.match(/^[\s++]/)) {
      layout = layout.replace(/^[\s++]+/, '')
    }
    const columns = layout.split(/[\s+;]+/)
    // TODO: consider removing auto fractioning as it breaks layout and is non-intuitive,
    //  return columns
    return _.flatten(columns.map((column, index) => {
      if (index < columns.length - 1) {
        const size = column.match(/^\d+$/) ? parseInt(column) : 0
        if (size > 0 && size <= 10) {
          const size = parseInt(column)
          column = []
          for (let i = 1; i <= size; i++) {
            column.push(`1/${size}`)
          }
        }
      }
      return column
    }))
  }

  removeToken (index) {
    const tokens = this.getLayout(this.state.value)
    const removedToken = tokens.splice(index, 1)
    removedToken && this.updateValue(tokens.join(' + '))
  }

  getTokensList () {
    const tokens = _.compact(this.getLayout(this.state.value))

    return tokens.map((token, index) => {
      return (
        <Token
          key={'vcvToken' + index}
          title={token}
          removeCallback={this.removeToken}
          valid={this.props.validator(token)}
          index={index}
          onColumnHover={this.props.onColumnHover}
          activeToken={this.props.activeToken}
        />
      )
    })
  }

  getSuggestions () {
    const isSpaceAtTheEnd = this.state.value.match(/\s$/)
    const isPlusSignAtTheEnd = this.state.value.match(/\+\s+$/)
    return (this.state.value.length === 0 || isPlusSignAtTheEnd || isSpaceAtTheEnd) ? this.props.suggestions : []
  }

  getSuggestionItems () {
    const suggestions = this.getSuggestions()
    return suggestions.map((item, index) => {
      const isActive = index === this.state.activeSuggestion
      const cssClasses = classNames({
        'vcv-ui-suggest-box-item': true,
        'vcv-selected': isActive
      })
      return (
        <span
          key={'vcvSuggestBoxItem' + index}
          className={cssClasses}
          onMouseDown={this.handleSuggestionMouseDown}
          data-vcv-suggest={item.name}
        >
          {item.name}
        </span>
      )
    })
  }

  renderTokensList () {
    if (this.state.editing) {
      return null
    }
    const tokens = this.getTokensList()
    return (
      <div className='vcv-ui-tag-list vcv-ui-form-input' onClick={this.handleTagListClick}>
        {tokens}
      </div>
    )
  }

  renderSuggestionBox () {
    if (this.state.editing === false) {
      return null
    }
    const items = this.getSuggestionItems()
    if (!items.length) {
      return null
    }
    const cssClasses = classNames({
      'vcv-ui-suggest-box': true,
      'vcv-ui-form-input': true
    })

    return (
      <div className={cssClasses} style={this.state.cursorPosition} ref={this.suggestBoxRef}>
        {items}
      </div>
    )
  }

  render () {
    const { activeColumn, index, responsiveness, title } = this.props
    const tokenProps = {}
    if (title) {
      tokenProps.title = title
    }
    const cssClasses = classNames({
      'vcv-ui-form-input': true,
      'vcv-ui-tag-list-input': true,
      'vcv-ui-tag-list-input-editing-disabled': !this.state.editing && !responsiveness
    })
    const listContainerClasses = classNames({
      'vcv-ui-tag-list-container': true,
      'vcv-ui-tag-list-container--active': typeof activeColumn === 'number' && (activeColumn === index)
    })
    const tokensList = !responsiveness ? this.renderTokensList() : null
    return (
      <div className={listContainerClasses} onMouseOver={this.handleMouseOver} onMouseOut={this.handleMouseOut} {...tokenProps}>
        <Textarea
          minRows={1}
          className={cssClasses}
          type='text'
          onChange={this.handleChange}
          onKeyDown={this.handleKeyDown}
          value={this.state.suggestedValue || this.state.value}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          data-vcv-type='vcv-tokenized-input'
        />
        {tokensList}
        {this.renderSuggestionBox()}
      </div>
    )
  }
}
