import React from 'react'
import NotificationContainer from './notificationsContainer'
import NotificationPortal from './notificationPortal'
import { connect } from 'react-redux'

class Notifications extends React.Component {
  getVisibleContainer (selector) {
    const portals = [].slice.call(document.querySelectorAll(selector))
    if (portals.length) {
      const visibleItems = portals.filter((item) => {
        return item.offsetParent !== null
      })
      return visibleItems[0]
    }
    return null
  }

  render () {
    const { portal } = this.props
    const isPortal = true
    const portalContainer = portal ? this.getVisibleContainer(portal) : portal
    return (
      <>
        <NotificationContainer />
        <NotificationPortal portalContainer={portalContainer}>
          <NotificationContainer isPortal={isPortal} />
        </NotificationPortal>
      </>
    )
  }
}

const mapStateToProps = state => ({
  portal: state.notifications.portal
})

export default connect(mapStateToProps)(Notifications)
