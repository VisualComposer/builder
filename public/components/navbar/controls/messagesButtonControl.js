import React from 'react'
import classNames from 'classnames'
import NavbarContent from '../navbarContent'
import { getStorage, getService } from 'vc-cake'
import innerAPI from 'public/components/api/innerAPI'
import MessagesPanel from 'public/components/panels/messages/messagesPanel'

const workspaceStorage = getStorage('workspace')
const workspaceContentState = workspaceStorage.state('content')
const workspaceSettings = workspaceStorage.state('settings')
const workspaceMessagesTabState = workspaceStorage.state('messagesTab')
const workspaceMessagesControls = workspaceStorage.state('messagesControls')
const insightsStorage = getStorage('insights')
const dataManager = getService('dataManager')

export default class MessagesButtonControl extends NavbarContent {
  constructor (props) {
    super(props)
    this.state = {
      isActive: workspaceContentState.get() === 'messages',
      showWarning: false, // !!assetsStorage.getCustomCss()
      insightData: insightsStorage.state('insights').get() || []
    }
    this.handleTabClick = this.handleTabClick.bind(this)
    this.setActiveState = this.setActiveState.bind(this)
    this.handleInsightsChange = this.handleInsightsChange.bind(this)

    insightsStorage.state('insights').onChange(this.handleInsightsChange)
  }

  /* eslint-enable */
  setActiveState (state) {
    this.setState({ isActive: state === 'messages' })
  }

  componentDidMount () {
    workspaceContentState.onChange(this.setActiveState)

    innerAPI.mount('panel:messages', () => <MessagesPanel key='panels-container-messages' />)
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

  handleTabClick (e, type) {
    e && e.preventDefault()
    type ? workspaceMessagesTabState.set(type) : workspaceMessagesTabState.set('insights')
    workspaceContentState.set(!this.state.isActive || type ? 'messages' : false)
    workspaceSettings.set({ action: 'messages' })
  }

  render () {
    const localizations = dataManager.get('localizations')
    const name = localizations ? localizations.insightsAndNotifications : 'Insights & Notifications'
    const controls = workspaceMessagesControls.get()
    const controlsArray = Object.keys(controls).map(key => controls[key])
    const currentLevel = insightsStorage.state('currentLevel').get()

    const controlClass = classNames({
      'vcv-ui-navbar-control': true,
      'vcv-ui-pull-end': true,
      'vcv-ui-state--active': this.state.isActive,
      'vcv-ui-badge--error': currentLevel === 'critical',
      'vcv-ui-badge--warning': currentLevel === 'warning',
      'vcv-ui-badge--success': currentLevel === 'success',
      'vcv-ui-navbar-dropdown-trigger': true
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
          onClick={(e) => this.handleTabClick(e, control.type)}
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

    const messagesControls = (
      <dl className='vcv-ui-navbar-dropdown'>
        <dt className={controlClass} title={name} onClick={this.handleTabClick} data-vcv-guide-helper='insights-control'>
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

    const messagesControlsInsideDropdown = (
      <div className='vcv-ui-navbar-controls-set'>
        {subMenus}
      </div>
    )

    return (
      this.props.insideDropdown ? messagesControlsInsideDropdown : messagesControls
    )
  }
}
