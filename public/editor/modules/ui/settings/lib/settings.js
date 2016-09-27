// import vcCake from 'vc-cake'
import React from 'react'
import SettingsHeaderTabs from './settingsHeaderTabs'
import SettingsContent from './settingsContent'
import SettingsFooter from './settingsFooter'

class Settings extends React.Component {
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
Settings.propTypes = {
  api: React.PropTypes.object.isRequired,
  parent: React.PropTypes.string
}

export default Settings
