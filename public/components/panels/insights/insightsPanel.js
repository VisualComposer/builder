import React from 'react'
import classNames from 'classnames'
import { getStorage, getService } from 'vc-cake'
import Scrollbar from 'public/components/scrollbar/scrollbar'
import PanelNavigation from '../panelNavigation'
import Tooltip from 'public/components/tooltip/tooltip'
import DefaultInsights from './defaultInsights'
import innerAPI from '../../api/innerAPI'

const insightsStorage = getStorage('insights')
const dataManager = getService('dataManager')
const localizations = dataManager.get('localizations')
const workspaceStorage = getStorage('workspace')
const workspaceContentState = workspaceStorage.state('content')
const workspaceInsightsTabState = workspaceStorage.state('insightsTab')
const workspaceInsightsControls = workspaceStorage.state('insightsControls')
const currentInsightsLevel = insightsStorage.state('currentLevel')

const controls = innerAPI.applyFilter('insightPanelsData', {
  insights: {
    index: 0,
    type: 'insights',
    title: 'Insights',
    icon: 'lamp'
  }
})

workspaceInsightsControls.set({ ...controls })

export default class InsightsPanel extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      controls: controls,
      activeSection: workspaceInsightsTabState.get() ? workspaceInsightsTabState.get() : 'insights',
      isVisible: workspaceContentState.get() === 'insights'
    }

    innerAPI.mount('panelInsights:insights', () => {
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
    workspaceInsightsTabState.onChange(this.setActiveSection)
  }

  componentWillUnmount () {
    insightsStorage.state('insights').ignoreChange(this.handleInsightsChange)
    workspaceContentState.ignoreChange(this.setVisibility)
    workspaceInsightsTabState.ignoreChange(this.setActiveSection)
    currentInsightsLevel.ignoreChange(this.handleLevelChange)
  }

  setActiveSection (type) {
    this.setState({ activeSection: type })
  }

  setVisibility (activePanel) {
    this.setState({
      isVisible: activePanel === 'insights'
    })
  }

  handleLevelChange (data) {
    const newControls = { ...this.state.controls }
    controls.insights.level = currentInsightsLevel.get()
    this.setState({ newControls })
  }

  render () {
    const VCInsights = localizations ? localizations.VCInsights : 'Visual Composer Insights'
    const insightsIsAContentAnalysisTool = localizations ? localizations.insightsIsAContentAnalysisTool : 'Insights is a content analysis tool that helps to improve the quality, performance, and SEO ranking of the page.'
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
            {VCInsights}
          </span>
          <Tooltip>
            {insightsIsAContentAnalysisTool}
          </Tooltip>
        </div>
        <PanelNavigation controls={this.state.controls} activeSection={this.state.activeSection} setActiveSection={this.setActiveSection} />
        <div className='vcv-ui-tree-content-section'>
          <Scrollbar>
            {innerAPI.pick(`panelInsights:${this.state.controls[this.state.activeSection].type}`, null)}
          </Scrollbar>
        </div>
      </div>
    )
  }
}
