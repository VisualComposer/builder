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
    const { device, index } = this.props
    let deviceIconClasses = classNames(
      'vcv-ui-navbar-control-icon',
      'vcv-ui-icon',
      'vcv-ui-icon-' + device.className
    )
    return (
      <span className='vcv-ui-navbar-control'
        title={device.type}
        key={index}
        onClick={this.handleClick.bind(this, index)}
      >
        <span className='vcv-ui-navbar-control-content'>
          <i className={deviceIconClasses} />
          <span>{device.type}</span>
        </span>
      </span>
    )
  }
}
