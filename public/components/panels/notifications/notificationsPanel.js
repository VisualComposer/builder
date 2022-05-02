import React from 'react'
import { connect } from 'react-redux'
import NotificationItem from './notificationItem'
import { seenMessagesSet } from 'public/editor/stores/insights/slice'

class NotificationsPanel extends React.Component {
  constructor (props) {
    super(props)

    this.notificationIds = props.notifications.map(item => item.ID)

    window.localStorage.setItem('vcv-seen-messages', JSON.stringify(this.notificationIds))
  }

  componentWillUnmount () {
    this.props.seenMessagesSet(this.notificationIds || [])
  }

  render () {
    return (
      <div className='vcv-ui-tree-content-section'>
        <div className='vcv-notifications vcv-ui-tree-content-section-inner'>
          {this.props.notifications.map((item) => {
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

const mapStateToProps = (state) => ({
  notifications: state.insights.notifications
})

const mapDispatchToProps = (dispatch) => ({
  seenMessagesSet: (data) => dispatch(seenMessagesSet(data))
})

export default connect(mapStateToProps, mapDispatchToProps)(NotificationsPanel)
