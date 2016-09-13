/* eslint react/jsx-no-bind: "off" */
import React from 'react'
import classNames from 'classnames'

import '../css/tokenizationList/token.less'

export default class Token extends React.Component {
  static propTypes = {
    index: React.PropTypes.number.isRequired,
    title: React.PropTypes.string.isRequired,
    removeCallback: React.PropTypes.func.isRequired,
    valid: React.PropTypes.bool
  }
  constructor (props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }
  handleClick () {
    this.props.removeCallback(this.props.index)
  }
  render () {
    let {index, title, valid} = this.props
    let tagClasses = classNames({
      'vcv-ui-tag-list-item': true,
      'vcv-ui-tag-list-item-error': !valid // add validation
    })
    return <span key={'tagItem' + index} data-index={index} className={tagClasses}>
      {title}
      <button className='vcv-ui-tag-list-item-remove' type='button' title='Remove' onClick={this.handleClick}>
        <i className='vcv-ui-icon vcv-ui-icon-close-thin' />
      </button>
    </span>
  }
}
