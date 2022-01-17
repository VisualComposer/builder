// @ts-ignore
import { notificationRemoved } from 'public/editor/stores/notifications/slice'
import React, { useEffect, useState } from 'react'
// @ts-ignore
import store from 'public/editor/stores/store'
// @ts-ignore
import { getService } from 'vc-cake'
import classNames from 'classnames'
import ReactDOM from 'react-dom'

interface Props {
  data: {
    id: string;
    text: string;
    type: string;
    showCloseButton: boolean;
    html: boolean;
    time: number;
  };
}

const NotificationItem: React.FC<Props> = (props) => {
  const dataManager = getService('dataManager')
  const localizations = dataManager.get('localizations')
  const [hidden, setHidden] = useState<boolean>(false)
  let textHtml

  useEffect(() => {
    return () => {
      store.dispatch(notificationRemoved(props.data.id))
    }
  }, [])

  const handleRemoveNotification = (): void => {
    store.dispatch(notificationRemoved(props.data.id))
  }

  const handleClickHideNotification = (e: React.BaseSyntheticEvent): void => {
    setHidden(true)
    const element = ReactDOM.findDOMNode(e.target)
    element?.addEventListener('transitionend', handleRemoveNotification)
  }

  if (!props.data.text) return null

  if (props.data.html) {
    textHtml = <div className='vcv-layout-notifications-text' dangerouslySetInnerHTML={{ __html: props.data.text }} />
  } else {
    textHtml = <div className='vcv-layout-notifications-text'>{props.data.text}</div>
  }

  const type = props.data.type && ['default', 'success', 'warning', 'error'].indexOf(props.data.type) >= 0
    ? props.data.type
    : 'default'

  const classes = classNames({
    'vcv-layout-notifications-item': true,
    [`vcv-layout-notifications-type--${type}`]: true,
    'vcv-layout-notifications-type--disabled': hidden
  })

  return (
    <div
      className={classes}
      onClick={!props.data.showCloseButton ? handleClickHideNotification : () => {
      }}
    >
      {textHtml}
      {props.data.showCloseButton &&
        <div
          className='vcv-layout-notifications-close'
          title={localizations ? localizations.close : 'Close'}
          onClick={handleClickHideNotification}
        >
          <i className='vcv-ui-icon vcv-ui-icon-close-thin' />
        </div>}
    </div>
  )
}

export default NotificationItem
