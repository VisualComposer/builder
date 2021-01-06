/* eslint-disable import/no-webpack-loader-syntax */
/* eslint react/jsx-no-bind: "off" */

import React from 'react'
import ResponsivenessSettings from '../../responsivenessSettings/Component'
import TokenizationList from './tokenizationList'
import { getService } from 'vc-cake'

const dataManager = getService('dataManager')

export default class LayoutResponsiveness extends React.Component {
  static localizations = dataManager.get('localizations')

  getSettings () {
    const { devices, layoutData, defaultLayoutData } = this.props
    const hoverTitle = LayoutResponsiveness.localizations ? LayoutResponsiveness.localizations.clickToEditColumnValue : 'Click to edit column value'
    return devices.map((deviceData, i) => {
      const deviceLayout = layoutData[deviceData.deviceKey]
      const devicesContent = deviceLayout.map((layout, index) => {
        // if layout is empty and is the last item in array
        // don't render field
        if (!layout.length &&
          (deviceLayout.indexOf(layout) === deviceLayout.length - 1) &&
          deviceLayout.length > 1 &&
          deviceLayout.length !== defaultLayoutData.length &&
          defaultLayoutData[defaultLayoutData.length - 1]
        ) {
          return null
        }
        const responsiveness = true

        return (
          <TokenizationList
            key={`${deviceData.deviceKey}-device-layout-item-${index}`}
            layouts={this.props.layouts}
            value={layout}
            onChange={this.props.onChange}
            validator={this.props.validator}
            suggestions={this.props.suggestions}
            responsiveness={responsiveness}
            device={deviceData.deviceKey}
            index={index}
            activeColumn={this.props.activeColumn}
            onColumnHover={this.props.onColumnHover}
            title={hoverTitle}
          />
        )
      })

      return (
        <div key={`${deviceData.deviceKey}-device-layout-${i}`} className='vcv-ui-form-responsiveness-settings-device-layout'>
          {devicesContent}
        </div>
      )
    })
  }

  render () {
    return (
      <ResponsivenessSettings {...this.props}>
        <div className='vcv-ui-form-responsiveness-settings-options'>
          {this.getSettings()}
        </div>
      </ResponsivenessSettings>
    )
  }
}
