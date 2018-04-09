import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'

export default class ContentElementControl extends React.Component {
  static propTypes = {
    tag: PropTypes.any,
    title: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    setActive: PropTypes.func.isRequired,
    unsetActive: PropTypes.func.isRequired,
    handleClick: PropTypes.func,
    data: PropTypes.object.isRequired
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
    let controlClass = classNames([
      'vcv-ui-element-control',
      `vcv-ui-element-control--${this.props.tag}`
    ])
    return <button
      className={controlClass}
      title={this.props.title}
      onMouseOver={this.displayDescription}
      onMouseOut={this.hideDescription}
      onClick={this.props.handleClick.bind(null, this.props.data)}
    >
      <span className='vcv-ui-element-control-content'>
        <img className='vcv-ui-icon' src={this.props.icon} alt={this.props.title} />
        <span className='vcv-ui-element-control-label'>{this.props.title}</span>
      </span>
    </button>
  }
}
