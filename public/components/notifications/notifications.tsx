// @ts-ignore
import NotificationContainer from './notificationsContainer'
import NotificationPortal from './notificationPortal'
import { connect } from 'react-redux'
import React from 'react'

const Notifications = (props: any) => {
  const getVisibleContainer = (selector: any) => {
    const portals = [].slice.call(document.querySelectorAll(selector))
    if (portals.length) {
      const visibleItems = portals.filter((item) => {
        // @ts-ignore
        return item.offsetParent !== null
      })
      return visibleItems[0]
    }
    return null
  }

  const portalContainer = props.portal
    ? getVisibleContainer(props.portal)
    : props.portal

  return (
    <>
      <NotificationContainer />
      <NotificationPortal portalContainer={portalContainer}>
        <NotificationContainer isPortal />
      </NotificationPortal>
    </>
  )
}

const mapStateToProps = (state : any) => ({
  portal: state.notifications.portal
})

export default connect(mapStateToProps)(Notifications)
