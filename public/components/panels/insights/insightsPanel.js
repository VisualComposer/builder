import React from 'react'
import classNames from 'classnames'
import { getStorage, getService } from 'vc-cake'
import Scrollbar from '../../scrollbar/scrollbar'
import PanelNavigation from '../panelNavigation'
import InsightGroup from './insightGroup'
import vcLogo from 'public/sources/images/brandLogo/vcLogo.raw'
import Tooltip from '../../tooltip/tooltip'

const insightsStorage = getStorage('insights')
const dataManager = getService('dataManager')
const localizations = dataManager.get('localizations')
const workspaceStorage = getStorage('workspace')
const workspaceContentState = workspaceStorage.state('content')
const controls = {
  all: {
    index: 0,
    type: 'all',
    title: localizations ? localizations.all : 'All'
  },
  critical: {
    index: 1,
    type: 'critical',
    title: localizations ? localizations.critical : 'Critical'
  },
  warning: {
    index: 2,
    type: 'warning',
    title: localizations ? localizations.warnings : 'Warnings'
  },
  success: {
    index: 3,
    type: 'success',
    title: localizations ? localizations.success : 'Success'
  }
}

export default class InsightsPanel extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      activeSection: 'all',
      insightData: insightsStorage.state('insights').get() || {},
      currentControls: this.getCurrentControls(insightsStorage.state('insights').get()),
      isVisible: workspaceContentState.get() === 'insights'
    }

    this.setActiveSection = this.setActiveSection.bind(this)
    this.handleInsightsChange = this.handleInsightsChange.bind(this)
    this.setVisibility = this.setVisibility.bind(this)

    insightsStorage.state('insights').onChange(this.handleInsightsChange)
  }

  componentDidMount () {
    workspaceContentState.onChange(this.setVisibility)
  }

  componentWillUnmount () {
    insightsStorage.state('insights').ignoreChange(this.handleInsightsChange)
    workspaceContentState.ignoreChange(this.setVisibility)
  }

  setActiveSection (type) {
    const currentControl = Object.keys(this.state.currentControls).find(control => control === type)
    this.setState({ activeSection: currentControl || 'all' })
  }

  setVisibility (activePanel) {
    this.setState({
      isVisible: activePanel === 'insights'
    })
  }

  handleInsightsChange (data) {
    const currentControls = this.getCurrentControls(data)
    const currentActiveSection = Object.keys(currentControls).find(control => control === this.state.activeSection)
    this.setState({
      insightData: data || {},
      currentControls: currentControls,
      activeSection: currentActiveSection || 'all'
    })
  }

  getInsightsHTML (insightData) {
    let insightsHTML = Object.keys(insightData).map((type, index) => {
      const insightGroup = insightData[type]

      if (this.state.activeSection === 'all' || this.state.activeSection === insightGroup.state) {
        return (
          <InsightGroup
            key={`insight-group-${type}-${index}`}
            type={type}
            insightGroup={insightGroup}
          />
        )
      }
    })

    if (!insightsHTML.length) {
      insightsHTML = <span className='vcv-ui-insights-spinner vcv-vcv-ui-icon vcv-ui-wp-spinner' />
    } else if (insightsHTML.filter(item => item === undefined).length === Object.keys(insightData).length) {
      let insightsNoIssuesFoundTitle, insightsNoIssuesFoundDescription
      if (this.state.activeSection === 'critical') {
        insightsNoIssuesFoundTitle = localizations.insightsNoCriticalIssuesFoundTitle ? localizations.insightsNoCriticalIssuesFoundTitle : 'No Critical Issues Found'
        insightsNoIssuesFoundDescription = localizations.insightsNoCriticalIssuesFoundDescription ? localizations.insightsNoCriticalIssuesFoundDescription : 'There are no critical issues on the page. Congratulations and keep up the good work!'
      } else if (this.state.activeSection === 'warning') {
        insightsNoIssuesFoundTitle = localizations.insightsNoWarningsFoundTitle ? localizations.insightsNoWarningsFoundTitle : 'No Warnings Found'
        insightsNoIssuesFoundDescription = localizations.insightsNoWarningsFoundDescription ? localizations.insightsNoWarningsFoundDescription : 'There are no warnings on the page. Congratulations and keep up the good work!'
      }
      insightsHTML = (
        <div className='vcv-insight-no-issues'>
          <span
            className=''
            dangerouslySetInnerHTML={{ __html: vcLogo }}
          />
          <h2 className='vcv-no-issues-heading'>{insightsNoIssuesFoundTitle}</h2>
          <span className='vcv-insight-description'>{insightsNoIssuesFoundDescription}</span>
        </div>
      )
    }

    return insightsHTML
  }

  getCurrentControls (insightData) {
    const insightsControls = Object.assign({}, controls)
    let successNotifications = false
    if (Object.keys(insightData).length) {
      Object.keys(insightData).forEach((item) => {
        if (insightData[item].state === 'success') {
          successNotifications = true
        }
      })
      if (!successNotifications) {
        delete insightsControls.success
      }
    }
    return insightsControls
  }

  render () {
    const VCInsights = localizations ? localizations.VCInsights : 'Visual Composer Insights'
    const insightsIsAContentAnalysisTool = localizations ? localizations.insightsIsAContentAnalysisTool : 'Insights is a content analysis tool that helps to improve the quality, performance, and SEO ranking of the page.'
    const insightsHTML = this.getInsightsHTML(this.state.insightData)

    const insightsPanelClasses = classNames({
      'vcv-ui-tree-view-content': true,
      'vcv-ui-state--hidden': !this.state.isVisible
    })

    return (
      <div className={insightsPanelClasses}>
        <div className='vcv-ui-panel-heading'>
          <i className='vcv-ui-panel-heading-icon vcv-ui-icon vcv-ui-icon-lamp' />
          <span className='vcv-ui-panel-heading-text'>
            {VCInsights}
          </span>
          <Tooltip>
            {insightsIsAContentAnalysisTool}
          </Tooltip>
        </div>
        <PanelNavigation controls={this.state.currentControls} activeSection={this.state.activeSection} setActiveSection={this.setActiveSection} />
        <Scrollbar>
          <div className='vcv-ui-tree-content-section'>
            <div className='vcv-insights vcv-ui-tree-content-section-inner'>
              {insightsHTML}
            </div>
          </div>
        </Scrollbar>
      </div>
    )
  }
}
