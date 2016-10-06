import React from 'react'
import classNames from 'classnames'

export default class CustomContentElementControl extends React.Component {
  static propTypes = {
    title: React.PropTypes.string.isRequired,
    classSuffix: React.PropTypes.string.isRequired,
    description: React.PropTypes.string.isRequired,
    setActive: React.PropTypes.func.isRequired,
    unsetActive: React.PropTypes.func.isRequired,
    handleClick: React.PropTypes.func
  }
  constructor (props) {
    super(props)
    this.displayDescription = this.displayDescription.bind(this)
    this.hideDescription = this.hideDescription.bind(this)
    this.handleClick = this.handleClick.bind(this)
  }
  displayDescription () {
    this.props.setActive(this.props.description)
  }
  hideDescription () {
    this.props.unsetActive()
  }
  handleClick () {
    this.props.handleClick && this.props.handleClick(this.props.title)
  }
  render () {
    let controlClass = classNames([
      'vcv-ui-element-control',
      `vcv-ui-element-control--${this.props.classSuffix}`
    ])
    let iconClass = classNames([
      'vcv-ui-icon',
      `vcv-ui-icon-${this.props.classSuffix}`
    ])

    return (
      <button
        className={controlClass}
        title={this.props.title}
        onMouseOver={this.displayDescription}
        onMouseOut={this.hideDescription}
        onClick={this.handleClick}
      >
        <i className={iconClass} />
        <span className='vcv-ui-element-control-label'>{this.props.title}</span>
      </button>
    )
  }
}

