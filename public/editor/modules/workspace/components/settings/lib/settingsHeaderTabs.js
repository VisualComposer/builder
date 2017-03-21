import React from 'react'
import SettingsTab from './settingsTab'

export default class SettingsHeaderTabs extends React.Component {
  render () {
    return (
      <div className='vcv-ui-editor-tabs-container'>
        <nav className='vcv-ui-editor-tabs'>
          <SettingsTab title={'Custom CSS'} />
          <span className='vcv-ui-editor-tabs-free-space' />
        </nav>
      </div>
    )
  }
}
