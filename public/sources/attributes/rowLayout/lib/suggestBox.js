/* eslint react/jsx-no-bind: "off" */
import React from 'react'
import classNames from 'classnames'

import '../css/tokenizationList/suggestBox.less'

export default class SuggestBox extends React.Component {
  static propTypes = {
    value: React.PropTypes.string.isRequired,
    updateCallback: React.PropTypes.func,
    suggestions: React.PropTypes.array.isRequired,
    show: React.PropTypes.bool.isRequired,
    activated: React.PropTypes.bool
  }
  state = {
    active: -1
  }
  constructor (props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }
  handleClick (e) {
    this.props.updateCallback && this.props.updateCallback(e.currentTarget.getAttribute('data-vcv-suggest'))
  }
  getSuggestions () {
    let valueRegex = new RegExp('^' + RegExp.escape(this.props.value))
    return this.props.suggestions.filter((layout) => {
      return valueRegex.test(layout)
    })
  }
  getItems () {
    if (!this.props.value.length) {
      return []
    }
    let activeState = this.state.active
    let suggestions = this.getSuggestions()
    console.log(this.props.activated)
    if (this.props.activated && this.state.active < 0) {
      activeState = this.setNextActive(suggestions)
    }
    return suggestions.map((item, index) => {
      let cssClasses = classNames({
        'vcv-ui-suggest-box-item': true,
        'vcv-selected': index === activeState
      })
      return <span key={'vcvSuggestBoxItem' + index}
        className={cssClasses}
        onClick={this.handleClick}
        data-vcv-suggest={item}
        >
        {item}
      </span>
    })
  }
  setNextActive (suggestions) {
    let active = this.state.active + 1
    if (suggestions[active] !== undefined) {
      this.setState({active: active})
    }
    return active
  }
  render () {
    if (this.props.show === false) {
      return null
    }
    let items = this.getItems()
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
}
