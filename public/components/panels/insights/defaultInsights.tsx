import React, {useState, useEffect} from 'react'
import {connect} from 'react-redux'
import {getService} from 'vc-cake'
import InsightGroup from './insightGroup'
import Dropdown from '../../../sources/attributes/dropdown/Component'
import {Insights, InsightsTypeControl} from '../../../editor/stores/insights/types'
import { AppStateType } from '../../../editor/stores/reducer'

const vcLogo = require('../../../sources/images/brandLogo/vcLogo.raw') as string
const dataManager = getService('dataManager')
const localizations = dataManager.get('localizations')

const insightsTypeControls: InsightsTypeControl = {
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

type Props = {
  insights: Insights
}

const DefaultInsights = ({insights}: Props) => {

  const getCurrentControls = (insightData: Insights) => {
    const insightsControls: InsightsTypeControl = Object.assign({}, insightsTypeControls)
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

  const [activeSection, setActiveSection] = useState('all')
  const [currentControls, setCurrentControls] = useState(getCurrentControls(insights))
  const [insightData, setInsightData] = useState(insights || {})

  useEffect(() => {
    handleInsightsChange(insights)
  }, [insights])

  const setActiveSectionHandler = (fieldKey: string, type: string) => {
    const currentControl = Object.keys(currentControls).find(control => control === type)
    setActiveSection(currentControl || 'all')
  }

  const handleInsightsChange = (data: Insights) => {
    let sortedData = data
    // Sorting insights by criticality
    if (Object.keys(data).length) {
      sortedData = Object.fromEntries(
        Object.entries(data).sort(([, a], [, b]) => insightsTypeControls[a.state].index - insightsTypeControls[b.state].index)
      )
    }
    const sortedCurrentControls = getCurrentControls(sortedData)
    const currentActiveSection = Object.keys(currentControls).find(control => control === activeSection)

    setInsightData(sortedData || {})
    setCurrentControls(sortedCurrentControls)
    setActiveSection(currentActiveSection || 'all')
  }

  const getInsightsHTML = (insightData: Insights) => {
    let insightsHTML: any = Object.keys(insightData).map((type, index) => {
      const insightGroup = insightData[type]

      if (activeSection === 'all' || activeSection === insightGroup.state) {
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
    } else if (insightsHTML.filter((item: any) => item === undefined).length === Object.keys(insightData).length) {
      let insightsNoIssuesFoundTitle, insightsNoIssuesFoundDescription
      if (activeSection === 'critical') {
        insightsNoIssuesFoundTitle = localizations.insightsNoCriticalIssuesFoundTitle ? localizations.insightsNoCriticalIssuesFoundTitle : 'No Critical Issues Found'
        insightsNoIssuesFoundDescription = localizations.insightsNoCriticalIssuesFoundDescription ? localizations.insightsNoCriticalIssuesFoundDescription : 'There are no critical issues on the page. Congratulations and keep up the good work!'
      } else if (activeSection === 'warning') {
        insightsNoIssuesFoundTitle = localizations.insightsNoWarningsFoundTitle ? localizations.insightsNoWarningsFoundTitle : 'No Warnings Found'
        insightsNoIssuesFoundDescription = localizations.insightsNoWarningsFoundDescription ? localizations.insightsNoWarningsFoundDescription : 'There are no warnings on the page. Congratulations and keep up the good work!'
      }
      insightsHTML = (
        <div className='vcv-insight-no-issues'>
          <span
            className=''
            dangerouslySetInnerHTML={{__html: vcLogo}}
          />
          <h2 className='vcv-no-issues-heading'>{insightsNoIssuesFoundTitle}</h2>
          <span className='vcv-insight-description'>{insightsNoIssuesFoundDescription}</span>
        </div>
      )
    }

    return insightsHTML
  }

  const insightsHTML = getInsightsHTML(insightData)
  const dropdownControls = {
    values: Object.keys(currentControls).map(key => ({
      value: currentControls[key].type,
      label: currentControls[key].title
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
              updater={setActiveSectionHandler}
              value={activeSection}
            />
          </div>
          {insightsHTML}
        </div>
      </div>
    </>
  )
}


const mapStateToProps = (state: AppStateType) => ({
  insights: state.insights.insights
})

export default connect(mapStateToProps)(DefaultInsights)
