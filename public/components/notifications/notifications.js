import React from 'react'
import ReactDOM from 'react-dom'
import vcCake from 'vc-cake'
import NotificationContainer from './notificationsContainer'

const notificationsStorage = vcCake.getStorage('notifications')
const notificationsPortalState = notificationsStorage.state('portal')

export default class Notifications extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      portalContainer: null
    }

    this.changePortalContainer = this.changePortalContainer.bind(this)

    notificationsPortalState.onChange(this.changePortalContainer)
  }

  changePortalContainer (selector) {
    this.setState({
      portalContainer: selector ? document.querySelector(selector) : selector
    })
  }

  render () {
    if (this.state.portalContainer) {
      return ReactDOM.createPortal(
        <NotificationContainer />,
        this.state.portalContainer
      )
    }

    return <NotificationContainer />
  }
}
