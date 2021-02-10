import React from 'react'
import classNames from 'classnames'
import NavbarContent from '../navbarContent'
import { getStorage, getService } from 'vc-cake'
import innerAPI from 'public/components/api/innerAPI'
import InsightsPanel from 'public/components/panels/insights/insightsPanel'

const workspaceContentState = getStorage('workspace').state('content')
const workspaceSettings = getStorage('workspace').state('settings')
const insightsStorage = getStorage('insights')
const dataManager = getService('dataManager')

export default class InsightsButtonControl extends NavbarContent {
  constructor (props) {
    super(props)
    this.state = {
      isActive: workspaceContentState.get() === 'insights',
      showWarning: false, // !!assetsStorage.getCustomCss()
      insightData: insightsStorage.state('insights').get() || []
    }
    this.handleClickInsights = this.handleClickInsights.bind(this)
    this.setActiveState = this.setActiveState.bind(this)
    this.handleInsightsChange = this.handleInsightsChange.bind(this)

    insightsStorage.state('insights').onChange(this.handleInsightsChange)
  }

  /* eslint-enable */
  setActiveState (state) {
    this.setState({ isActive: state === 'insights' })
  }

  componentDidMount () {
    workspaceContentState.onChange(this.setActiveState)

    innerAPI.mount('panel:insights', (props) => { return <InsightsPanel {...props} key='panels-container-insights' /> })
  }

  componentWillUnmount () {
    workspaceContentState.ignoreChange(this.setActiveState)
    insightsStorage.state('insights').ignoreChange(this.handleInsightsChange)
  }

  handleInsightsChange (data) {
    this.setState({
      insightData: data
    })
  }

  handleClickInsights (e) {
    e && e.preventDefault()
    workspaceContentState.set(!this.state.isActive ? 'insights' : false)
    workspaceSettings.set({ action: 'insights' })
  }

  render () {
    const localizations = dataManager.get('localizations')
    const name = localizations ? localizations.VCInsights : 'Visual Composer Insights'

    const currentLevel = insightsStorage.state('currentLevel').get()
    const controlClass = classNames({
      'vcv-ui-navbar-control': true,
      'vcv-ui-pull-end': true,
      'vcv-ui-state--active': this.state.isActive,
      'vcv-ui-badge--error': currentLevel === 'critical',
      'vcv-ui-badge--warning': currentLevel === 'warning',
      'vcv-ui-badge--success': currentLevel === 'success'
    })
    const iconClass = classNames({
      'vcv-ui-navbar-control-icon': true,
      'vcv-ui-icon': true,
      'vcv-ui-icon-lamp': true
    })

    return (
      <span className={controlClass} title={name} onClick={this.handleClickInsights} data-vcv-guide-helper='insights-control'>
        <span className='vcv-ui-navbar-control-content'>
          <i className={iconClass} />
          <span>{name}</span>
        </span>
      </span>
    )
  }
}
