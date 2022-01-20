import NotificationContainer from './notificationsContainer'
import NotificationPortal from './notificationPortal'
import { connect } from 'react-redux'
import React from 'react'

interface Props {
  portal: string | null
}

const Notifications: React.FC<Props> = (props) => {


  const getVisibleContainer = (selector: string): HTMLElement | null => {
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

  const { portal } = props
  const portalContainer = portal ? getVisibleContainer(portal) : portal

  return (
    <>
      <NotificationContainer />
      <NotificationPortal portalContainer={portalContainer}>
        <NotificationContainer isPortal />
      </NotificationPortal>
    </>
  )
}

const mapStateToProps = (state: { notifications: { portal: HTMLElement | null } }) => ({
  portal: state.notifications.portal
})

export default connect(mapStateToProps)(Notifications)
