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

const activeSection = 'default'

const controls = innerAPI.applyFilter('insightPanelsData', {
  default: {
    index: 0,
    type: 'default',
    title: 'Insights'
  }
})

export default class InsightsPanel extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      activeSection: activeSection,
      isVisible: workspaceContentState.get() === 'insights'
    }

    innerAPI.mount('panelInsights:default', () => {
      return <DefaultInsights key='panel-insights-default' />
    })

    this.setActiveSection = this.setActiveSection.bind(this)
    this.setVisibility = this.setVisibility.bind(this)
  }

  componentDidMount () {
    workspaceContentState.onChange(this.setVisibility)
  }

  componentWillUnmount () {
    insightsStorage.state('insights').ignoreChange(this.handleInsightsChange)
    workspaceContentState.ignoreChange(this.setVisibility)
  }

  setActiveSection (type) {
    this.setState({ activeSection: type })
  }

  setVisibility (activePanel) {
    this.setState({
      isVisible: activePanel === 'insights'
    })
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
          <i className='vcv-ui-panel-heading-icon vcv-ui-icon vcv-ui-icon-lamp' />
          <span className='vcv-ui-panel-heading-text'>
            {VCInsights}
          </span>
          <Tooltip>
            {insightsIsAContentAnalysisTool}
          </Tooltip>
        </div>
        {Object.keys(controls).length > 1 ? <PanelNavigation controls={controls} activeSection={this.state.activeSection} setActiveSection={this.setActiveSection} /> : null}
        <div className='vcv-ui-tree-content-section'>
          <Scrollbar>
            {innerAPI.pick(`panelInsights:${controls[this.state.activeSection].type}`, null)}
          </Scrollbar>
        </div>
      </div>
    )
  }
}
