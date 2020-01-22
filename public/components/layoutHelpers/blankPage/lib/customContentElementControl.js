import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'

export default class CustomContentElementControl extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    classSuffix: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    setActive: PropTypes.func.isRequired,
    unsetActive: PropTypes.func.isRequired,
    handleClick: PropTypes.func
  }

  constructor (props) {
    super(props)
    this.displayDescription = this.displayDescription.bind(this)
    this.hideDescription = this.hideDescription.bind(this)
  }

  displayDescription () {
    this.props.setActive(this.props.description)
  }

  hideDescription () {
    this.props.unsetActive()
  }

  render () {
    const controlClass = classNames([
      'vcv-ui-element-control',
      `vcv-ui-element-control--${this.props.classSuffix}`
    ])
    const iconClass = classNames([
      'vcv-ui-icon',
      `vcv-ui-icon-${this.props.classSuffix}`
    ])

    return (
      <button
        className={controlClass}
        title={this.props.title}
        onMouseOver={this.displayDescription}
        onMouseOut={this.hideDescription}
        onClick={this.props.handleClick}
      >
        <span className='vcv-ui-element-control-content'>
          <i className={iconClass} />
          <span className='vcv-ui-element-control-label'>{this.props.title}</span>
        </span>
      </button>
    )
  }
}
