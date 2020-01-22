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
    onClick: PropTypes.func
  }

  constructor (props) {
    super(props)
    this.handleMouseOverDisplayDescription = this.handleMouseOverDisplayDescription.bind(this)
    this.handleMouseOutHideDescription = this.handleMouseOutHideDescription.bind(this)
  }

  handleMouseOverDisplayDescription () {
    this.props.setActive(this.props.description)
  }

  handleMouseOutHideDescription () {
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
        onMouseOver={this.handleMouseOverDisplayDescription}
        onMouseOut={this.handleMouseOutHideDescription}
        onClick={this.props.onClick}
      >
        <span className='vcv-ui-element-control-content'>
          <i className={iconClass} />
          <span className='vcv-ui-element-control-label'>{this.props.title}</span>
        </span>
      </button>
    )
  }
}
