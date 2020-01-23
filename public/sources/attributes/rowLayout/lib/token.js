/* eslint react/jsx-no-bind: "off" */
import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'

export default class Token extends React.Component {
  static propTypes = {
    index: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    removeCallback: PropTypes.func.isRequired,
    valid: PropTypes.bool,
    onColumnHover: PropTypes.func,
    activeToken: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.bool
    ])
  }

  constructor (props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
    this.handleMouseOver = this.handleMouseOver.bind(this)
    this.handleMouseOut = this.handleMouseOut.bind(this)
  }

  handleClick () {
    this.props.removeCallback(this.props.index)
  }

  handleHover (mouseOver) {
    const options = {
      index: this.props.index,
      over: mouseOver,
      type: 'activeColumn'
    }
    this.props.onColumnHover(options)
  }

  handleMouseOver () {
    this.handleHover(true)
  }

  handleMouseOut () {
    this.handleHover(false)
  }

  render () {
    let { title, valid, activeToken, index } = this.props
    let roundedTitle = title
    if (title.indexOf('%') >= 0) {
      title = title.indexOf(',') >= 0 ? title.slice(0, (title.indexOf(',') + 3)).replace('%', '') + '%' : title
      title = title.indexOf('.') >= 0 ? title.slice(0, (title.indexOf('.') + 3)).replace('%', '') + '%' : title
      roundedTitle = title.indexOf('.') >= 0 ? title.slice(0, (title.indexOf('.'))).replace('%', '') + '%' : title
    }

    const tagClasses = classNames({
      'vcv-ui-tag-list-item': true,
      'vcv-ui-tag-list-item--active': typeof activeToken === 'number' && (activeToken === index),
      'vcv-ui-tag-list-item-error': !valid // add validation
    })
    return (
      <span
        className={tagClasses}
        data-vcv-tag-list-label={roundedTitle}
        data-vcv-tag-list-label-hover={title}
        onMouseOver={this.handleMouseOver}
        onMouseOut={this.handleMouseOut}
      >
        <button className='vcv-ui-tag-list-item-remove' type='button' title='Remove' onClick={this.handleClick}>
          <i className='vcv-ui-icon vcv-ui-icon-close-thin' />
        </button>
      </span>
    )
  }
}
