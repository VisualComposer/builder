/* eslint react/jsx-no-bind: "off" */
import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'

export default class Token extends React.Component {
  static propTypes = {
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]).isRequired,
    index: PropTypes.number.isRequired,
    title: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]).isRequired,
    removeCallback: PropTypes.func.isRequired,
    valid: PropTypes.bool,
    validating: PropTypes.bool
  }

  constructor (props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick () {
    this.props.removeCallback(this.props.index)
  }

  render () {
    const { title, label, value, valid, validating } = this.props

    const tagClasses = classNames({
      'vcv-ui-tag-list-item': true,
      'vcv-ui-tag-list-item-error': !valid,
      'vcv-ui-tag-list-item-validating': validating
    })

    return <span
      className={tagClasses}
      title={title}
      data-vcv-tag-list-label={label || value}
      data-vcv-tag-list-label-hover={label || value}
    >
      <button className='vcv-ui-tag-list-item-remove' type='button' title='Remove' onClick={this.handleClick}>
        <i className='vcv-ui-icon vcv-ui-icon-close-thin' />
      </button>
    </span>
  }
}
