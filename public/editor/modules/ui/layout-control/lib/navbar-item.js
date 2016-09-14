import React from 'react'
import classNames from 'classnames'

class LayoutControlItem extends React.Component {
  static propTypes = {
    devices: React.PropTypes.array.isRequired,
    onChange: React.PropTypes.func.isRequired
  }

  handleClick = (index, e) => {
    e && e.preventDefault()
    this.props.onChange(index)
  }

  render () {
    let devices = []

    this.props.devices.forEach((item, index) => {
      let deviceIconClasses = classNames(
        'vcv-ui-navbar-control-icon',
        'vcv-ui-icon',
        `vcv-ui-icon-${item.type.replace(/\s+/g, '-').toLowerCase()}`
      )
      devices.push(
        <a className='vcv-ui-navbar-control'
          href='#'
          title={item.type}
          key={index}
          onClick={this.handleClick.bind(this, index)}
          disabled={item.disabled}
        >
          <span className='vcv-ui-navbar-control-content'>
            <i className={deviceIconClasses} />
            <span>{item.type}</span>
          </span>
        </a>
      )
    })

    return (
      <div className='vcv-ui-navbar-controls-group'>
        {devices}
      </div>
    )
  }
}

export default LayoutControlItem
