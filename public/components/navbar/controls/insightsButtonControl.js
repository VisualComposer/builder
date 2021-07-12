import React from 'react'
import classNames from 'classnames'
import NavbarContent from '../navbarContent'
import { getStorage, getService } from 'vc-cake'
import innerAPI from 'public/components/api/innerAPI'
import InsightsPanel from 'public/components/panels/insights/insightsPanel'

const workspaceStorage = getStorage('workspace')
const workspaceContentState = workspaceStorage.state('content')
const workspaceSettings = workspaceStorage.state('settings')
const workspaceInsightsTabState = workspaceStorage.state('insightsTab')
const workspaceInsightsControls = workspaceStorage.state('insightsControls')
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

    innerAPI.mount('panel:insights', () => <InsightsPanel key='panels-container-insights' />)
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

  handleClickInsights (e, type) {
    e && e.preventDefault()
    type ? workspaceInsightsTabState.set(type) : workspaceInsightsTabState.set('insights')
    workspaceContentState.set(!this.state.isActive || type ? 'insights' : false)
    workspaceSettings.set({ action: 'insights' })
  }

  render () {
    const localizations = dataManager.get('localizations')
    const name = localizations ? localizations.VCInsights : 'Visual Composer Insights'
    const controls = workspaceInsightsControls.get()
    const controlsArray = Object.keys(controls).map(key => controls[key])
    const currentLevel = insightsStorage.state('currentLevel').get()

    const controlClass = classNames({
      'vcv-ui-navbar-control': true,
      'vcv-ui-pull-end': true,
      'vcv-ui-navbar-dropdown-trigger': true,
      'vcv-ui-state--active': this.state.isActive,
      'vcv-ui-badge--error': currentLevel === 'critical',
      'vcv-ui-badge--warning': currentLevel === 'warning',
      'vcv-ui-badge--success': currentLevel === 'success'
    })

    const iconClass = classNames({
      'vcv-ui-navbar-control-icon': true,
      'vcv-ui-icon': true,
      'vcv-ui-icon-bell': true
    })

    const subMenuIconClasses = classNames({
      'vcv-ui-navbar-control-icon': true,
      'vcv-ui-icon': true
    })

    const navbarContentClasses = classNames({
      'vcv-ui-navbar-dropdown-content': true,
      'vcv-ui-navbar-show-labels': true
    })

    const subMenus = controlsArray.map((control, index) => {
      const subMenuIconClass = subMenuIconClasses + ` vcv-ui-icon-${control.icon}`
      return (
        <span
          onClick={(e) => this.handleClickInsights(e, control.type)}
          key={index}
          className='vcv-ui-navbar-control'
          title={control.title}
        >
          <span className='vcv-ui-navbar-control-content'>
            <i className={subMenuIconClass} />
            <span>{control.title}</span>
          </span>
        </span>
      )
    })

    const insightsControls = (
      <dl className='vcv-ui-navbar-dropdown'>
        <dt className={controlClass} title={name} onClick={this.handleClickInsights} data-vcv-guide-helper='insights-control'>
          <span className='vcv-ui-navbar-control-content'>
            <i className={iconClass} />
            <span>{name}</span>
          </span>
        </dt>
        <dd className={navbarContentClasses}>
          {subMenus}
        </dd>
      </dl>
    )

    const insightsControlsInsideDropdown = (
      <div className='vcv-ui-navbar-controls-set'>
        {subMenus}
      </div>
    )

    return (
      this.props.insideDropdown ? insightsControlsInsideDropdown : insightsControls
    )
  }
}
