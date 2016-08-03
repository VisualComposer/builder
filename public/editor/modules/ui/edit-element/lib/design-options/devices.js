import React from 'react'
import classNames from 'classnames'

class Devices extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      value: 'desktop'
    }
  }

  static getAll () {
    return [
      {
        strid: 'all',
        title: 'All',
        icon: ''
      },
      {
        strid: 'desktop',
        title: 'Desktop',
        icon: 'vcv-ui-icon-desktop'
      },
      {
        strid: 'tablet-landscape',
        title: 'Tablet Landscape',
        icon: 'vcv-ui-icon-tablet-landscape'
      },
      {
        strid: 'tablet-portrait',
        title: 'Tablet Portrait',
        icon: 'vcv-ui-icon-tablet-portrait'
      },
      {
        strid: 'mobile-landscape',
        title: 'Mobile Landscape',
        icon: 'vcv-ui-icon-mobile-landscape'
      },
      {
        strid: 'mobile-portrait',
        title: 'Mobile Portrait',
        icon: 'vcv-ui-icon-mobile-portrait'
      }
    ]
  }

  componentWillMount () {
    if (this.props.value) {
      this.setState({ value: this.props.value })
    }
  }

  handleChange (device) {
    let value = device

    if (value === this.state.value) {
      return
    }

    this.setState({
      value: value
    })

    this.props.onChange(value)
  }

  render () {
    let items = []

    Devices.getAll().map((device) => {
      if (device.strid === 'all') {
        return
      }

      let classes = classNames({
        'vcv-ui-form-button': true,
        'vcv-ui-state--active': this.state.value === device.strid
      })
      let icons = classNames([
        'vcv-ui-form-button-icon',
        'vcv-ui-icon',
        device.icon
      ])

      items.push(
        <button
          key={'device-' + device.strid}
          onClick={this.handleChange.bind(this, device.strid)}
          className={classes}
          title={device.title}
          data-vcv-device={device.strid}
        >
          <i className={icons}></i>
        </button>
      )
    }, this)

    return (
      <div className='vcv-ui-form-buttons-group vcv-ui-form-button-group--action'>
        {items}
      </div>
    )
  }
}
Devices.propTypes = {
  onChange: React.PropTypes.func,
  value: React.PropTypes.string
}

module.exports = Devices
