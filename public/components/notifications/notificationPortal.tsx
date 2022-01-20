import ReactDOM from 'react-dom'
import React from 'react'

interface Props {
  portalContainer: Element | null
}

const NotificationPortal: React.FC<Props> = (props) => {
  if (props.portalContainer) {
    return ReactDOM.createPortal(
      props.children,
      props.portalContainer
    )
  }
  return null
}

export default NotificationPortal
