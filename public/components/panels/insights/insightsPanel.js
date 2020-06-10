import React from 'react'
import { getStorage } from 'vc-cake'
import Scrollbar from '../../scrollbar/scrollbar'
import PanelNavigation from '../panelNavigation'
import InsightGroup from './insightGroup'
import vcLogo from 'public/sources/images/brandLogo/vcLogo.raw'

const insightsStorage = getStorage('insights')
const localizations = window.VCV_I18N && window.VCV_I18N()
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
      insightData: insightsStorage.state('insights').get() || {}
    }

    this.setActiveSection = this.setActiveSection.bind(this)
    this.handleInsightsChange = this.handleInsightsChange.bind(this)

    insightsStorage.state('insights').onChange(this.handleInsightsChange)
  }

  componentWillUnmount () {
    insightsStorage.state('insights').ignoreChange(this.handleInsightsChange)
  }

  setActiveSection (type) {
    this.setState({ activeSection: type })
  }

  handleInsightsChange (data) {
    this.setState({
      insightData: data || {}
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
    } else if (insightsHTML.indexOf(undefined) > -1) {
      const insightsNoIssuesFoundTitle = localizations.insightsNoIssuesFoundTitle ? localizations.insightsNoIssuesFoundTitle : 'No Critical Issues Found'
      const insightsNoIssuesFoundDescription = localizations.insightsNoIssuesFoundDescription ? localizations.insightsNoIssuesFoundDescription : 'You don\'t have any critical issues on your page. Congratulations and keep up the good work!'
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

  render () {
    const VCInsights = localizations ? localizations.VCInsights : 'Visual Composer Insights'
    let insightsHTML = this.getInsightsHTML(this.state.insightData)

    let insightsControls = Object.assign({}, controls)
    let successNotifications = false
    Object.keys(this.state.insightData).forEach((item) => {
      if (this.state.insightData[item].state === 'success') {
        successNotifications = true
      }
    })
    if (!successNotifications) {
      delete insightsControls.success
    }

    return (
      <div className='vcv-ui-tree-view-content'>
        <div className='vcv-ui-panel-heading'>
          <i className='vcv-ui-panel-heading-icon vcv-ui-icon vcv-ui-icon-lamp' />
          <span className='vcv-ui-panel-heading-text'>
            {VCInsights}
          </span>
        </div>
        <PanelNavigation controls={insightsControls} activeSection={this.state.activeSection} setActiveSection={this.setActiveSection} />
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
