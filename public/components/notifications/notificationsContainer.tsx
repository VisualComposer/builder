import NotificationItem from './notificationItem'
import { connect } from 'react-redux'
import React from 'react'

interface Props {
  notifications: [{
    id: string;
    text: string;
    type: string;
    showCloseButton: boolean;
    html: boolean;
    time: number;
    usePortal: boolean
  }];
  isPortal?: boolean;
}

const NotificationsContainer: React.FC<Props> = (props) => {
  const renderItems = () => {
    const { notifications, isPortal } = props
    if (!notifications || !notifications.length) {
      return null
    }
    
    const filteredNotifications = notifications.filter(
      (item) => !(Number(isPortal) ^ Number(item.usePortal))
    )

    return filteredNotifications.map((item) => {
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

const mapStateToProps = (state: { notifications: { list: never } }) => ({
  notifications: state.notifications.list
})

export default connect(mapStateToProps)(NotificationsContainer)
