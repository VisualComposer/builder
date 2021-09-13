import React from 'react'
import { getStorage } from 'vc-cake'
import NotificationItem from './notificationItem'

const notificationsStorage = getStorage('notifications')
const notificationsState = notificationsStorage.state('notifications')
const vcvLayout = document.getElementById('vcv-layout')

export default class NotificationsContainer extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      topNotifications: [],
      bottomNotifications: []
    }

    this.update = this.update.bind(this)

    notificationsState.onChange(this.update)
  }

  componentWillUnmount () {
    notificationsState.ignoreChange(this.update)
  }

  update (data) {
    const topNotifications = []
    const bottomNotifications = []
    const { isPortal } = this.props

    if (data && data.length) {
      data.forEach((item) => {
        if ((isPortal && item.usePortal) || (!isPortal && !item.usePortal)) {
          if (item.position === 'bottom') {
            bottomNotifications.push(item)
          } else {
            topNotifications.push(item)
          }
        }
      })
    }

    if (!this.state.topNotifications.length && topNotifications.length > 0) {
      vcvLayout.style.marginTop = '98px'
    } else if (this.state.topNotifications.length && !topNotifications.length) {
      vcvLayout.style = ''
    }

    this.setState({
      topNotifications: topNotifications,
      bottomNotifications: bottomNotifications
    })
  }

  renderItems (items, position) {
    if (items) {
      return items.map((item) => {
        return (
          <NotificationItem
            data={item}
            key={`notification-${item.id}`}
            position={position}
          />
        )
      })
    }
  }

  render () {
    return (
      <div className='vcv-layout-notifications'>
        <div className='vcv-layout-notifications-top'>
          {this.renderItems(this.state.topNotifications, 'top')}
        </div>
        <div className='vcv-layout-notifications-bottom'>
          {this.renderItems(this.state.bottomNotifications, 'bottom')}
        </div>
      </div>
    )
  }
}
