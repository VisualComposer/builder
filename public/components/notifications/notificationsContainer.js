import React from 'react'
import NotificationItem from './notificationItem'
import { connect } from 'react-redux'

class NotificationsContainer extends React.Component {
  renderItems () {
    const { notifications, isPortal } = this.props
    if (!notifications || !notifications.length) {
      return null
    }

    const filteredNotifications = notifications.filter(item => !(isPortal ^ item.usePortal))

    return filteredNotifications.map((item) => {
      return (
        <NotificationItem
          data={item}
          key={`notification-${item.id}`}
        />
      )
    })
  }

  render () {
    return (
      <div className='vcv-layout-notifications'>
        <div className='vcv-layout-notifications-inner'>
          {this.renderItems()}
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  notifications: state.notifications.list
})

export default connect(mapStateToProps)(NotificationsContainer)
