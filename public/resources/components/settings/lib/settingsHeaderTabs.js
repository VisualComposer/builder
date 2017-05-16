import React from 'react'
import SettingsTab from './settingsTab'

export default class SettingsHeaderTabs extends React.Component {
  render () {
    const localizations = window.VCV_I18N && window.VCV_I18N()
    const customCssText = localizations ? localizations.customCSS : 'Custom CSS'

    return (
      <div className='vcv-ui-editor-tabs-container'>
        <nav className='vcv-ui-editor-tabs'>
          <SettingsTab title={customCssText} />
          <span className='vcv-ui-editor-tabs-free-space' />
        </nav>
      </div>
    )
  }
}
