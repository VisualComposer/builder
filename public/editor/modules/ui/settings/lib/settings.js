import React from 'react'
import SettingsHeaderTabs from './settingsHeaderTabs'
import SettingsContent from './settingsContent'
import SettingsFooter from './settingsFooter'

export default class Settings extends React.Component {
  static propTypes = {
    api: React.PropTypes.object.isRequired
  }
  render () {
    return (
      <div className='vcv-ui-tree-view-content vcv-ui-add-element-content'>
        <div className='vcv-ui-tree-content'>
          <SettingsHeaderTabs api={this.props.api} />
          <SettingsContent api={this.props.api} />
          <SettingsFooter api={this.props.api} />
        </div>
      </div>
    )
  }
}
