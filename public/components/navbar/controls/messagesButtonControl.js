import React from 'react'
import { connect } from 'react-redux'
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
const dataManager = getService('dataManager')

const checkIsUnseenMessages = (allMessages, seenMessages) => {
  const unseenMessages = allMessages.filter(n => !seenMessages.includes(n))
  return !!unseenMessages.length
}

class MessagesButtonControl extends NavbarContent {
  constructor (props) {
    super(props)
    this.state = {
      isActive: workspaceContentState.get() === 'messages'
    }
    this.handleTabClick = this.handleTabClick.bind(this)
    this.setActiveState = this.setActiveState.bind(this)
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
  }

  handleTabClick (e, type) {
    e && e.preventDefault()
    if (type) {
      workspaceMessagesTabState.set(type)
    } else if (!this.state.isActive) {
      workspaceMessagesTabState.set('insights')
    }
    workspaceContentState.set(!this.state.isActive || type ? 'messages' : false)
    workspaceSettings.set({ action: 'messages' })
    this.handleDropdownVisibility(e)
    this.props.handleOnClick && this.props.handleOnClick(e)
  }

  render () {
    const localizations = dataManager.get('localizations')
    const name = localizations ? localizations.insightsAndNotifications : 'Insights & Notifications'
    const controls = workspaceMessagesControls.get()
    const controlsArray = Object.keys(controls).map(key => controls[key])
    const { currentLevel, isUnseenMessages } = this.props

    const containerClasses = classNames({
      'vcv-ui-navbar-dropdown': true,
      'vcv-ui-pull-end': true
    })

    const controlClass = classNames({
      'vcv-ui-navbar-control': true,
      'vcv-ui-state--active': this.state.isActive,
      'vcv-ui-badge--error': currentLevel === 'critical' || currentLevel === 'warning' || isUnseenMessages,
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
      'vcv-ui-show-dropdown-content': this.state.showDropdown,
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
      <dl className={containerClasses} onMouseLeave={this.handleDropdownVisibility}>
        <dt className={controlClass} title={name} onClick={this.handleTabClick} onMouseEnter={this.handleDropdownVisibility} data-vcv-guide-helper='insights-control'>
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

const mapStateToProps = (state) => ({
  isUnseenMessages: () => {
    const notificationIds = state.insights.notifications.map(item => item.ID)
    return checkIsUnseenMessages(notificationIds, state.insights.seenMessages)
  },
  currentLevel: state.insights.currentLevel
})

export default connect(mapStateToProps)(MessagesButtonControl)
