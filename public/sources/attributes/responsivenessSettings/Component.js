/* eslint-disable import/no-webpack-loader-syntax */
/* eslint react/jsx-no-bind: "off" */

import React from 'react'
import Attribute from '../attribute'

export default class ResponsivenessSettings extends Attribute {
  getDevicesSettings () {
    const devicesReversed = this.props.devices.slice().reverse()
    return devicesReversed.map((device) => {
      let key = `responsiveness-settings-${device}`
      return <div key={key} style={{ background: 'blue', margin: '0 1px', flex: '1 0 auto' }}>{device}</div>
    })
  }

  render () {
    return (
      <div className='vcv-ui-form-responsiveness-settings'>
        <div className='vcv-ui-form-responsiveness-settings-devices' style={{ display: 'flex' }}>
          {this.getDevicesSettings()}
        </div>
        {this.props.children}
      </div>
    )
  }
}
