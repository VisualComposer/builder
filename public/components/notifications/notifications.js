import React from 'react'
import vcCake from 'vc-cake'
import NotificationContainer from './notificationsContainer'
import NotificationPortal from './notificationPortal'

const notificationsStorage = vcCake.getStorage('notifications')
const notificationsPortalState = notificationsStorage.state('portal')

export default class Notifications extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      portalContainer: null
    }

    this.changePortalContainer = this.changePortalContainer.bind(this)
  }

  componentDidMount () {
    notificationsPortalState.onChange(this.changePortalContainer)
  }

  componentWillUnmount () {
    notificationsPortalState.ignoreChange(this.changePortalContainer)
  }

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

  changePortalContainer (selector) {
    this.setState({
      portalContainer: selector ? this.getVisibleContainer(selector) : selector
    })
  }

  render () {
    const isPortal = true
    return (
      <>
        <NotificationContainer />
        <NotificationPortal portalContainer={this.state.portalContainer}>
          <NotificationContainer isPortal={isPortal} />
        </NotificationPortal>
      </>
    )
  }
}
