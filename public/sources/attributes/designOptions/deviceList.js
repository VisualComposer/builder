import React from 'react'
import Devices from './devices'

export default class DeviceList extends React.Component {
  static propTypes = {
    onChangeDropdown: React.PropTypes.func.isRequired,
    onChangeDevice: React.PropTypes.func.isRequired,
    deviceTypeValue: React.PropTypes.string,
    deviceValue: React.PropTypes.string
  }

  render () {
    let devicesListOutput = null
    if (this.props.deviceTypeValue === 'custom') {
      devicesListOutput = (
        <div className='vcv-ui-col vcv-ui-col--fixed-width'>
          <div className='vcv-ui-form-group'>
            <Devices value={this.props.deviceValue} onChange={this.props.onChangeDevice} />
          </div>
        </div>
      )
    }

    return (
      <div className='vcv-ui-row vcv-ui-row-gap--md'>
        <div className='vcv-ui-col vcv-ui-col--fixed-width'>
          <div className='vcv-ui-form-group'>
            <select className='vcv-ui-form-dropdown' onChange={this.props.onChangeDropdown} value={this.props.deviceTypeValue}>
              <option value='all'>All devices</option>
              <option value='custom'>Custom device settings</option>
            </select>
          </div>
        </div>
        {devicesListOutput}
      </div>
    )
  }
}
