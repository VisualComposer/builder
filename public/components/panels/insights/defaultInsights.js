import React from 'react'
import { getStorage, getService } from 'vc-cake'
import InsightGroup from './insightGroup'
import vcLogo from 'public/sources/images/brandLogo/vcLogo.raw'
import Dropdown from 'public/sources/attributes/dropdown/Component'

const insightsStorage = getStorage('insights')
const dataManager = getService('dataManager')
const localizations = dataManager.get('localizations')

const insightsTypeControls = {
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

export default class DefaultInsights extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      activeControl: 'insights',
      activeSection: 'all',
      insightData: insightsStorage.state('insights').get() || {},
      currentControls: this.getCurrentControls(insightsStorage.state('insights').get())
    }

    this.setActiveSection = this.setActiveSection.bind(this)
    this.handleInsightsChange = this.handleInsightsChange.bind(this)

    insightsStorage.state('insights').onChange(this.handleInsightsChange)
  }

  componentDidMount () {
    this.handleInsightsChange(this.state.insightData)
  }

  componentWillUnmount () {
    insightsStorage.state('insights').ignoreChange(this.handleInsightsChange)
  }

  setActiveSection (fieldKey, type) {
    const currentControl = Object.keys(this.state.currentControls).find(control => control === type)
    this.setState({ activeSection: currentControl || 'all' })
  }

  setActiveControl (type) {
    const currentControl = Object.keys(this.state.currentControls).find(control => control === type)
    this.setState({ activeSection: currentControl || 'all' })
  }

  handleInsightsChange (data) {
    let sortedData = data
    // Sorting insights by criticality
    if (Object.keys(data).length) {
      sortedData = Object.fromEntries(
        Object.entries(data).sort(([, a], [, b]) => insightsTypeControls[a.state].index - insightsTypeControls[b.state].index)
      )
    }
    const currentControls = this.getCurrentControls(sortedData)
    const currentActiveSection = Object.keys(currentControls).find(control => control === this.state.activeSection)
    this.setState({
      insightData: sortedData || {},
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
    const insightsControls = Object.assign({}, insightsTypeControls)
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
    const insightsHTML = this.getInsightsHTML(this.state.insightData)
    const dropdownControls = {
      values: Object.keys(this.state.currentControls).map(key => ({
        value: this.state.currentControls[key].type,
        label: this.state.currentControls[key].title
      }))
    }

    return (
      <>
        <div className='vcv-ui-tree-content-section'>
          <div className='vcv-insights vcv-ui-tree-content-section-inner'>
            <div className='vcv-ui-form-group vcv-ui-form-group-style--inline'>
              <Dropdown
                fieldKey='insightControls'
                options={dropdownControls}
                updater={this.setActiveSection}
                value={this.state.activeSection}
              />
            </div>
            {insightsHTML}
          </div>
        </div>
      </>
    )
  }
}
