import React from 'react'
import NotificationItem from './notificationItem'
import { getStorage } from 'vc-cake'

const insightsStorage = getStorage('insights')

export default class NotificationsPanel extends React.Component {
  constructor (props) {
    super(props)

    this.notificationData = insightsStorage.state('notifications').get()

    this.notificationIds = this.notificationData.map(item => item.ID)

    window.localStorage.setItem('vcv-seen-messages', JSON.stringify(this.notificationIds))
  }

  componentWillUnmount () {
    insightsStorage.state('seenMessages').set(this.notificationIds || [])
  }

  render () {
    return (
      <div className='vcv-ui-tree-content-section'>
        <div className='vcv-notifications vcv-ui-tree-content-section-inner'>
          {this.notificationData.map((item) => {
            return (
              <NotificationItem
                key={`messages-notification-item-${item.ID}`}
                imageUrl={item.notification_image && item.notification_image[0]}
                title={item.post_title}
                content={item.post_content}
                url={item.notification_url}
              />
            )
          })}
        </div>
      </div>
    )
  }
}
