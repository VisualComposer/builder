/* eslint react/jsx-no-bind: "off" */
import React from 'react'
import classNames from 'classnames'

import '../css/tokenizationList/suggestBox.less'

export default class SuggestBox extends React.Component {
  static propTypes = {
    value: React.PropTypes.string.isRequired,
    updateCallback: React.PropTypes.func,
    suggestions: React.PropTypes.array.isRequired,
    show: React.PropTypes.bool.isRequired
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
    let suggestions = this.getSuggestions()
    return suggestions.map((item, index) => {
      return <span key={'vcvSuggestBoxItem' + index}
        className='vcv-ui-suggest-box-item'
        onClick={this.handleClick}
        data-vcv-suggest={item}
        >
        {item}
      </span>
    })
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
