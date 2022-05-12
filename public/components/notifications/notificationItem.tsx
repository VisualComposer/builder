// @ts-ignore
import { notificationRemoved } from 'public/editor/stores/notifications/slice'
import React, { useState, useEffect, useRef } from 'react'
// @ts-ignore
import store from 'public/editor/stores/store'
// @ts-ignore
import { getService } from 'vc-cake'
import classNames from 'classnames'

interface Props {
  data: {
    id: string;
    text: string;
    type: string;
    showCloseButton: boolean;
    html: boolean;
    time: number;
    usePortal: boolean
  };
}

const NotificationItem: React.FC<Props> = (props) => {
  const dataManager = getService('dataManager')
  const localizations = dataManager.get('localizations')
  const [hidden, setHidden] = useState<boolean>(false)
  let textHtml
  const timerRef = useRef(0)

  useEffect(() => {
    if (props.data.time !== -1) {
      timerRef.current = window.setTimeout(() => {
        handleClickHideNotification()
        return () => {
          clearTimeout(timerRef.current)
        }
      }, props.data.time)
    }
  }, [props.data])

  if (!props.data.text) {
    return null
  }

  const handleClickHideNotification = () => {
    setHidden(true)
    setTimeout(() => {
      clearTimeout(timerRef.current)
      store.dispatch(notificationRemoved(props.data.id))
    }, 600)
  }

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

  return (!props.data.showCloseButton ?
      <div className={classes} onClick={handleClickHideNotification}>
        {textHtml}
      </div> : <div className={classes}>
        {textHtml}
        <div
          className='vcv-layout-notifications-close'
          title={localizations ? localizations.close : 'Close'}
          onClick={handleClickHideNotification}
        >
          <i className='vcv-ui-icon vcv-ui-icon-close-thin' />
        </div>
      </div>
  )
}

export default NotificationItem
