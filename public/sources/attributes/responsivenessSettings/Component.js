/* eslint-disable import/no-webpack-loader-syntax */
/* eslint react/jsx-no-bind: "off" */

import React from 'react'
import Attribute from '../attribute'

export default class ResponsivenessSettings extends Attribute {
  static defaultProps = {
    fieldType: 'responsivenessSettings'
  }

  getDevicesSettings () {
    const { devices } = this.props
    return devices.map((deviceData) => {
      let key = `responsiveness-settings-${deviceData.deviceKey}`
      return (
        <div key={key} className='vcv-ui-form-responsiveness-settings-devices-item' title={deviceData.title}>
          <i className={`vcv-ui-icon vcv-ui-icon-${deviceData.className}`} />
          <p className='vcv-ui-form-responsiveness-settings-devices-item-title'>{deviceData.title}</p>
        </div>
      )
    })
  }

  render () {
    return (
      <div className='vcv-ui-form-responsiveness-settings'>
        <div className='vcv-ui-form-responsiveness-settings-devices vcv-ui-form-responsiveness-settings-hide-labels'>
          {this.getDevicesSettings()}
        </div>
        {this.props.children}
      </div>
    )
  }
}
