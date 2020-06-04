import React from 'react'
import classNames from 'classnames'
import NavbarContent from '../navbarContent'
import { getStorage } from 'vc-cake'

const workspaceContentState = getStorage('workspace').state('content')
const workspaceSettings = getStorage('workspace').state('insights')
const insightsStorage = getStorage('insights')

export default class InsightsButtonControl extends NavbarContent {
  constructor (props) {
    super(props)
    this.state = {
      isActive: workspaceContentState.get() === 'insights',
      showWarning: false, // !!assetsStorage.getCustomCss()
      insightData: insightsStorage.state('insights').get() || []
    }
    this.handleClickSettings = this.handleClickSettings.bind(this)
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

  handleClickSettings (e) {
    e && e.preventDefault()
    workspaceContentState.set(!this.state.isActive ? 'insights' : false)
    workspaceSettings.set({ action: 'insights' })
  }

  render () {
    const localizations = window.VCV_I18N && window.VCV_I18N()
    const name = localizations ? localizations.VCInsights : 'Visual Composer Insights'

    const currentLevel = insightsStorage.state('currentLevel').get()
    const CRITICAL_LEVEL = 4
    const WARNING_LEVEL = 2
    const SUCCESS_LEVEL = 1
    const controlClass = classNames({
      'vcv-ui-navbar-control': true,
      'vcv-ui-pull-end': true,
      'vcv-ui-state--active': this.state.isActive,
      'vcv-ui-badge--error': currentLevel & CRITICAL_LEVEL && !(currentLevel & WARNING_LEVEL),
      'vcv-ui-badge--warning': currentLevel & WARNING_LEVEL && !(currentLevel & CRITICAL_LEVEL),
      'vcv-ui-badge--success': currentLevel & SUCCESS_LEVEL && !(currentLevel & CRITICAL_LEVEL) && !(currentLevel & WARNING_LEVEL)
    })
    const iconClass = classNames({
      'vcv-ui-navbar-control-icon': true,
      'vcv-ui-icon': true,
      'vcv-ui-icon-lamp': true
    })

    return (
      <span className={controlClass} title={name} onClick={this.handleClickSettings}>
        <span className='vcv-ui-navbar-control-content'>
          <i className={iconClass} />
          <span>{name}</span>
        </span>
      </span>
    )
  }
}
