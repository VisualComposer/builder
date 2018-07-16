/* eslint-disable import/no-webpack-loader-syntax */
/* eslint react/jsx-no-bind: "off" */

import React from 'react'
import ResponsivenessSettings from '../../responsivenessSettings/Component'
import TokenizationList from '../../rowLayout/lib/tokenizationList'

export default class LayoutResponsiveness extends React.Component {
  getSettings () {
    const { devices, layoutData } = this.props
    return devices.map((device, i) => {
      return <div key={`${device}-device-layout-${i}`}>{layoutData.map((layout, i) => {
        return <TokenizationList key={`${device}-device-layout-item-${i}`}
          layouts={this.props.layouts}
          value={layout}
          onChange={this.props.onChange}
          validator={this.props.validator}
          suggestions={this.props.suggestions}
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
