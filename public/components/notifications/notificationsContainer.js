import React from 'react'
import { getStorage } from 'vc-cake'
import NotificationItem from './notificationItem'

const notificationsStorage = getStorage('notifications')
const notificationsState = notificationsStorage.state('notifications')

export default class NotificationsContainer extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      notifications: []
    }

    this.update = this.update.bind(this)

    notificationsState.onChange(this.update)
  }

  componentWillUnmount () {
    notificationsState.ignoreChange(this.update)
  }

  update (data) {
    const notifications = []
    const { isPortal } = this.props

    if (data && data.length) {
      data.forEach((item) => {
        if ((isPortal && item.usePortal) || (!isPortal && !item.usePortal)) {
          notifications.push(item)
        }
      })
    }

    this.setState({
      notifications: notifications
    })
  }

  renderItems () {
    if (!this.state.notifications) {
      return null
    }

    return this.state.notifications.map((item) => {
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
