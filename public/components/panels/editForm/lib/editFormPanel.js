import React from 'react'
import { getStorage, getService } from 'vc-cake'
import ActivitiesManager from './activitiesManager'

const workspace = getStorage('workspace')
const elementAccessPointService = getService('elementAccessPoint')

export default class EditFormPanel extends React.Component {
  constructor (props) {
    super(props)

    const workSpaceSettings = workspace.state('settings').get()
    const elementAccessPoint = workSpaceSettings?.id ? elementAccessPointService.getInstance(workSpaceSettings.id) : null

    this.state = {
      elementAccessPoint: elementAccessPoint,
      activeTabId: workSpaceSettings?.activeTab ? workSpaceSettings.activeTab : '',
      options: workSpaceSettings?.options ? workSpaceSettings.options : {}
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
    if (settings?.id) {
      this.setState({
        elementAccessPoint: elementAccessPointService.getInstance(settings.id),
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
