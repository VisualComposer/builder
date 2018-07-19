/* eslint-disable import/no-webpack-loader-syntax */
/* eslint react/jsx-no-bind: "off" */

import React from 'react'
import ResponsivenessSettings from '../../responsivenessSettings/Component'
import TokenizationList from './tokenizationList'

export default class LayoutResponsiveness extends React.Component {
  getSettings () {
    const { devices, layoutData, defaultLayoutData } = this.props
    const devicesReversed = devices.slice().reverse()
    return devicesReversed.map((device, i) => {
      const deviceLayout = layoutData[ device ]
      return <div key={`${device}-device-layout-${i}`}>{deviceLayout.map((layout, index) => {
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
        return <TokenizationList key={`${device}-device-layout-item-${index}`}
          layouts={this.props.layouts}
          value={layout}
          onChange={this.props.onChange}
          validator={this.props.validator}
          suggestions={this.props.suggestions}
          responsiveness={responsiveness}
          device={device}
          index={index}
        />
      })}
      </div>
    })
  }

  render () {
    return (<ResponsivenessSettings {...this.props}>
      <div className='vcv-ui-form-responsiveness-settings-options'
        style={{ display: 'flex', justifyContent: 'space-between' }}>
        {this.getSettings()}
      </div>
    </ResponsivenessSettings>)
  }
}
