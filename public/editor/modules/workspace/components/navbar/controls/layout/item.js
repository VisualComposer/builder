import React from 'react'
import classNames from 'classnames'

export default class Item extends React.Component {
  static propTypes = {
    device: React.PropTypes.object.isRequired,
    onChange: React.PropTypes.func.isRequired,
    index: React.PropTypes.number.isRequired
  }

  handleClick = (index, e) => {
    e && e.preventDefault()
    this.props.onChange(index)
  }

  render () {
    let deviceIconClasses = classNames(
      'vcv-ui-navbar-control-icon',
      'vcv-ui-icon',
      'vcv-ui-icon-' + this.props.device.className
    )
    return (
      <a className='vcv-ui-navbar-control'
        href='#'
        title={this.props.device.type}
        key={this.props.index}
        onClick={this.handleClick.bind(this, this.props.index)}
      >
        <span className='vcv-ui-navbar-control-content'>
          <i className={deviceIconClasses} />
          <span>{this.props.device.type}</span>
        </span>
      </a>
    )
  }
}
