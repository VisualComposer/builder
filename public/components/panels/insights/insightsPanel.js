import React from 'react'
import { getStorage, env } from 'vc-cake'
import Scrollbar from '../../scrollbar/scrollbar'
import PanelNavigation from '../panelNavigation'

const workspaceStorage = getStorage('workspace')

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
      insightData: insightsStorage.state('insights').get()
    }

    this.iframe = env('iframe').document

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
      insightData: data
    })
  }

  handleGoToElement (elementID) {
    const editorEl = this.iframe.querySelector(`#el-${elementID}`)
    this.iframe.scrollTo({ top: editorEl.offsetTop, behavior: 'smooth' })
    workspaceStorage.trigger('edit', elementID, '')
  }

  render () {
    const localizations = window.VCV_I18N && window.VCV_I18N()
    const VCInsights = localizations ? localizations.VCInsights : 'Visual Composer Insights'
    const data = this.state.insightData

    const insightsHTML = []
    data.forEach((insight) => {
      if (this.state.activeSection === 'all' || this.state.activeSection === insight.state) {
        let goToButton = null
        if (insight.elementID) {
          goToButton = (
            <div className='vcv-insight-go-to'>
              <button
                onClick={this.handleGoToElement.bind(this, insight.elementID)}
                className='vcv-insight-go-to-action vcv-ui-icon vcv-ui-icon-forward'
              />
            </div>
          )
        }

        insightsHTML.push(
          <div className={`vcv-insight vcv-insight-${insight.state}`} key={`insights-item-${insight.type}`}>
            <span className='vcv-insight-title'>{insight.title}</span>
            <span className='vcv-insight-description'>{insight.description}</span>
            {goToButton}
          </div>
        )
      }
    })

    return (
      <div className='vcv-ui-tree-view-content'>
        <div className='vcv-ui-panel-heading'>
          <i className='vcv-ui-panel-heading-icon vcv-ui-icon vcv-ui-icon-lamp' />
          <span className='vcv-ui-panel-heading-text'>
            {VCInsights}
          </span>
        </div>
        <PanelNavigation controls={controls} activeSection={this.state.activeSection} setActiveSection={this.setActiveSection} />
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
