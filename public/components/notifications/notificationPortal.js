import React from 'react'
import ReactDOM from 'react-dom'

export default class NotificationPortal extends React.Component {
  render () {
    const { children, portalContainer } = this.props
    if (portalContainer) {
      return ReactDOM.createPortal(
        children,
        portalContainer
      )
    }
    return null
  }
}
