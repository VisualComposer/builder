import React from 'react'
import classNames from 'classnames'
import { getStorage, getService } from 'vc-cake'
import Scrollbar from 'public/components/scrollbar/scrollbar'
import PanelNavigation from '../panelNavigation'
import DefaultInsights from '../insights/defaultInsights'
import innerAPI from '../../api/innerAPI'

const insightsStorage = getStorage('insights')
const dataManager = getService('dataManager')
const localizations = dataManager.get('localizations')
const workspaceStorage = getStorage('workspace')
const workspaceContentState = workspaceStorage.state('content')
const workspaceMessagesTabState = workspaceStorage.state('messagesTab')
const workspaceMessagesControls = workspaceStorage.state('messagesControls')
const currentInsightsLevel = insightsStorage.state('currentLevel')

const controls = innerAPI.applyFilter('insightPanelsData', {
  insights: {
    index: 0,
    type: 'insights',
    title: 'Insights',
    icon: 'lamp'
  }
})

workspaceMessagesControls.set({ ...controls })

export default class MessagesPanel extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      controls: controls,
      activeSection: workspaceMessagesTabState.get() ? workspaceMessagesTabState.get() : 'insights',
      isVisible: workspaceContentState.get() === 'messages'
    }

    innerAPI.mount('panelMessages:insights', () => {
      return <DefaultInsights key='panel-insights-default' />
    })

    this.setActiveSection = this.setActiveSection.bind(this)
    this.setVisibility = this.setVisibility.bind(this)
    this.handleLevelChange = this.handleLevelChange.bind(this)
  }

  componentDidMount () {
    this.handleLevelChange(controls)
    currentInsightsLevel.onChange(this.handleLevelChange)
    workspaceContentState.onChange(this.setVisibility)
    workspaceMessagesTabState.onChange(this.setActiveSection)
  }

  componentWillUnmount () {
    insightsStorage.state('insights').ignoreChange(this.handleInsightsChange)
    workspaceContentState.ignoreChange(this.setVisibility)
    workspaceMessagesTabState.ignoreChange(this.setActiveSection)
    currentInsightsLevel.ignoreChange(this.handleLevelChange)
  }

  setActiveSection (type) {
    this.setState({ activeSection: type })
  }

  setVisibility (activePanel) {
    this.setState({
      isVisible: activePanel === 'messages'
    })
  }

  handleLevelChange (data) {
    const newControls = { ...this.state.controls }
    controls.insights.level = currentInsightsLevel.get()
    this.setState({ newControls })
  }

  render () {
    const title = localizations ? localizations.insightsAndNotifications : 'Insights & Notifications'
    const panelClasses = classNames({
      'vcv-ui-tree-view-content': true,
      'vcv-ui-tree-view-content--full-width': true,
      'vcv-ui-state--hidden': !this.state.isVisible
    })

    return (
      <div className={panelClasses} data-vcv-disable-on-demo>
        <div className='vcv-ui-panel-heading'>
          <i className='vcv-ui-panel-heading-icon vcv-ui-icon vcv-ui-icon-bell' />
          <span className='vcv-ui-panel-heading-text'>
            {title}
          </span>
        </div>
        <PanelNavigation controls={this.state.controls} activeSection={this.state.activeSection} setActiveSection={this.setActiveSection} />
        <div className='vcv-ui-tree-content-section'>
          <Scrollbar>
            {innerAPI.pick(`panelMessages:${this.state.controls[this.state.activeSection].type}`, null)}
          </Scrollbar>
        </div>
      </div>
    )
  }
}
