import NotificationContainer from './notificationsContainer'
import NotificationPortal from './notificationPortal'
import { connect } from 'react-redux'
import React from 'react'

interface Props {
  portal: Element | null
}

const Notifications: React.FC<Props> = (props) => {
  const getVisibleContainer = (selector: Element) => {
    const portals = [].slice.call(document.querySelectorAll(selector))
    if (portals.length) {
      const visibleItems = portals.filter((item: {
        offsetParent: null | never
      }) => {
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

const mapStateToProps = (state: { notifications: { portal: Element | null } }) => ({
  portal: state.notifications.portal
})

export default connect(mapStateToProps)(Notifications)
