import ReactDOM from 'react-dom'

const NotificationPortal = (props) => {
  if (props.portalContainer) {
    return ReactDOM.createPortal(
      props.children,
      props.portalContainer
    )
  }
  return null
}

export default NotificationPortal
