import React from 'react'
import { getStorage } from 'vc-cake'
import ActivitiesManager from './activitiesManager'

const workspace = getStorage('workspace')

export default class EditFormPanel extends React.Component {
  constructor (props) {
    super(props)

    const workSpaceSettings = workspace.state('settings').get()
    this.state = {
      elementAccessPoint: workSpaceSettings && workSpaceSettings.elementAccessPoint,
      activeTabId: workSpaceSettings && workSpaceSettings.activeTab ? workSpaceSettings.activeTab : '',
      options: workSpaceSettings && workSpaceSettings.options ? workSpaceSettings.options : {}
    }

    this.handleWorkSpaceSettingsChange = this.handleWorkSpaceSettingsChange.bind(this)
  }

  componentDidMount () {
    workspace.state('settings').onChange(this.handleWorkSpaceSettingsChange)
  }

  componentWillUnmount () {
    workspace.state('settings').ignoreChange(this.handleWorkSpaceSettingsChange)
  }

  handleWorkSpaceSettingsChange (settings) {
    if (settings && settings.elementAccessPoint) {
      this.setState({
        elementAccessPoint: settings.elementAccessPoint,
        activeTabId: settings.activeTab || '',
        options: settings.options || {}
      })
    }
  }

  render () {
    const { elementAccessPoint, activeTabId, options } = this.state
    if (!elementAccessPoint) {
      return null
    }

    return (
      <ActivitiesManager
        elementAccessPoint={elementAccessPoint}
        activeTabId={activeTabId}
        options={options}
      />
    )
  }
}
