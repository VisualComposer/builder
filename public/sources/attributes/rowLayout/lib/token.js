/* eslint react/jsx-no-bind: "off" */
import React from 'react'
import classNames from 'classnames'
// import {Motion, spring} from 'react-motion'

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
    this.handleMouseDown = this.handleMouseDown.bind(this)
    this.handleTouchStart = this.handleTouchStart.bind(this)
    this.handleClick = this.handleClick.bind(this)
  }
  handleClick () {
    this.props.removeCallback(this.props.index)
  }
  handleMouseDown () {

  }
  handleTouchStart () {

  }
  render () {
    let {index, title, valid} = this.props
    let tagClasses = classNames({
      'vcv-ui-tag-list-item': true,
      'vcv-ui-tag-list-item-error': !valid // add validation
    })
    return <span
      onMouseDown={this.handleMouseDown.bind(this)}
      onTouchStart={this.handleTouchStart.bind(this)}
      key={'tagItem' + index} className={tagClasses}
      >
      {title}
      <button className='vcv-ui-tag-list-item-remove' type='button' title='Remove' onClick={this.handleClick}>
        <i className='vcv-ui-icon vcv-ui-icon-close-thin' />
      </button>
    </span>
  }
}
