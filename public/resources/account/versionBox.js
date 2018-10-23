import React from 'react'

export default class VersionBox extends React.Component {
  render () {
    return (
      <div className='vcv-activation-plugin-version-box'>
        version {window.VCV_PLUGIN_VERSION()}
      </div>
    )
  }
}
