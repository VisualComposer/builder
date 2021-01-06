import React from 'react'
import { getService } from 'vc-cake'

const dataManager = getService('dataManager')

export default class VersionBox extends React.Component {
  render () {
    return (
      <div className='vcv-activation-plugin-version-box'>
        version {dataManager.get('pluginVersion')}
      </div>
    )
  }
}
