import NotificationItem from './notificationItem'
import { connect } from 'react-redux'
import React from 'react'

interface NotificationsContainerType {
  notifications: [];
  isPortal?: any;
}

const NotificationsContainer: React.FC<NotificationsContainerType> = (props) => {
  const renderItems = () => {
    const { notifications, isPortal } = props
    if (!notifications || !notifications.length) {
      return null
    }

    const filteredNotifications = notifications.filter((item:any) => !(isPortal ^ item.usePortal))

    return filteredNotifications.map((item:any) => {
      return (
        <NotificationItem
          data={item}
          key={`notification-${item.id}`}
        />
      )
    })
  }

  return (
    <div className='vcv-layout-notifications'>
      <div className='vcv-layout-notifications-inner'>
        {renderItems()}
      </div>
    </div>
  )
}

const mapStateToProps = (state:any) => ({
  notifications: state.notifications.list
})

export default connect(mapStateToProps)(NotificationsContainer)
