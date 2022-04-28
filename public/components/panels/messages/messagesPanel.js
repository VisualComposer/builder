import React, { useState, useEffect } from 'react'
import classNames from 'classnames'
import { getStorage, getService } from 'vc-cake'
import Scrollbar from 'public/components/scrollbar/scrollbar'
import PanelNavigation from '../panelNavigation'
import DefaultInsights from '../insights/defaultInsights'
import NotificationsPanel from '../notifications/notificationsPanel'
import innerAPI from '../../api/innerAPI'
import { connect } from 'react-redux'

const dataManager = getService('dataManager')
const localizations = dataManager.get('localizations')
const workspaceStorage = getStorage('workspace')
const workspaceContentState = workspaceStorage.state('content')
const workspaceMessagesTabState = workspaceStorage.state('messagesTab')
const workspaceMessagesControls = workspaceStorage.state('messagesControls')

const isUnseenMessages = (allMessages, seenMessages) => {
  const unseenMessages = allMessages.filter(n => !seenMessages.includes(n))
  return !!unseenMessages.length
}

const initControls = innerAPI.applyFilter('insightPanelsData', {
  insights: {
    index: 0,
    type: 'insights',
    title: 'Insights',
    icon: 'lamp'
  },
  notifications: {
    index: 1,
    type: 'notifications',
    title: 'Notifications',
    icon: 'bell'
  }
})

workspaceMessagesControls.set({ ...initControls })

const MessagesPanel = ({ seenMessages, notifications, currentLevel }) => {
  const notificationIds = notifications.map(item => item.ID)
  if (isUnseenMessages(notificationIds, seenMessages)) {
    initControls.notifications.level = 'critical'
  }

  const [controls, setControls] = useState(initControls)
  const [activeSection, setActiveSection] = useState(workspaceMessagesTabState.get() ? workspaceMessagesTabState.get() : 'insights')
  const [isVisible, setIsVisible] = useState(workspaceContentState.get() === 'messages')

  innerAPI.mount('panelMessages:insights', () => {
    return <DefaultInsights key='panel-insights-default' />
  })

  innerAPI.mount('panelMessages:notifications', () => {
    return <NotificationsPanel key='panel-notifications' />
  })

  useEffect(() => {
    handleLevelChange(controls)
    workspaceContentState.onChange(handleSetVisibility)
    workspaceMessagesTabState.onChange(handleSetActiveSection)
    return () => {
      workspaceContentState.ignoreChange(handleSetVisibility)
      workspaceMessagesTabState.ignoreChange(handleSetActiveSection)
    }
  }, [])

  useEffect(() => {
    handleLevelChange(currentLevel)
  }, [currentLevel])

  useEffect(() => {
    handleSeenMessagesChange(seenMessages)
  }, [seenMessages])

  const handleSeenMessagesChange = (newSeenState) => {
    const newControls = { ...controls }
    const notificationIds = notifications.map(item => item.ID)
    if (isUnseenMessages(notificationIds, newSeenState)) {
      newControls.notifications.level = 'critical'
    } else {
      delete newControls.notifications.level
    }
    setControls(newControls)
  }

  const handleSetActiveSection = (type) => {
    setActiveSection(type)
  }

  const handleSetVisibility = (activePanel) => {
    setIsVisible(activePanel === 'messages')
  }

  const handleLevelChange = () => {
    const newControls = { ...controls }
    newControls.insights.level = currentLevel
    setControls(newControls)
  }

  const title = localizations ? localizations.insightsAndNotifications : 'Insights & Notifications'
  const panelClasses = classNames({
    'vcv-ui-tree-view-content': true,
    'vcv-ui-tree-view-content--full-width': true,
    'vcv-ui-state--hidden': !isVisible
  })

  return (
    <div className={panelClasses} data-vcv-disable-on-demo>
      <div className='vcv-ui-panel-heading'>
        <i className='vcv-ui-panel-heading-icon vcv-ui-icon vcv-ui-icon-bell' />
        <span className='vcv-ui-panel-heading-text'>
          {title}
        </span>
      </div>
      <PanelNavigation controls={controls} activeSection={activeSection} setActiveSection={handleSetActiveSection} />
      <div className='vcv-ui-tree-content-section'>
        <Scrollbar>
          {innerAPI.pick(`panelMessages:${controls[activeSection].type}`, null)}
        </Scrollbar>
      </div>
    </div>
  )
}

const mapStateToProps = (state) => ({
  seenMessages: state.insights.seenMessages,
  notifications: state.insights.notifications,
  currentLevel: state.insights.currentLevel
})

export default connect(mapStateToProps)(MessagesPanel)
