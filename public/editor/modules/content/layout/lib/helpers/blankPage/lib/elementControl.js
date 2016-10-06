import React from 'react'
import classNames from 'classnames'

export default class ContentElementControl extends React.Component {
  static propTypes = {
    tag: React.PropTypes.any,
    title: React.PropTypes.string.isRequired,
    icon: React.PropTypes.string.isRequired,
    description: React.PropTypes.string.isRequired,
    setActive: React.PropTypes.func.isRequired,
    unsetActive: React.PropTypes.func.isRequired,
    handleClick: React.PropTypes.func
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
      onClick={this.props.handleClick.bind(null, this.props.tag)}
    >
      <img className='vcv-ui-icon vcv-ui-element-control-image' src={this.props.icon} alt={this.props.title} />
      <span className='vcv-ui-element-control-label'>{this.props.title}</span>
    </button>
  }
}

