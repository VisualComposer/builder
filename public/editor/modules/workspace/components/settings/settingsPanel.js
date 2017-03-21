import React from 'react'
import SettingsHeaderTabs from './lib/settingsHeaderTabs'
import SettingsContent from './lib/settingsContent'
import SettingsFooter from './lib/settingsFooter'
import './css/init.less'

export default class SettingsPanel extends React.Component {
  render () {
    return (
      <div className='vcv-ui-tree-view-content vcv-ui-add-element-content'>
        <div className='vcv-ui-tree-content'>
          <SettingsHeaderTabs />
          <SettingsContent />
          <SettingsFooter />
        </div>
      </div>
    )
  }
}
