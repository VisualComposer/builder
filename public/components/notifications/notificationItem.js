import React from 'react'
import ReactDOM from 'react-dom'
import classNames from 'classnames'
import { getService } from 'vc-cake'
import store from 'public/editor/stores/store'
import { notificationRemoved } from 'public/editor/stores/notifications/slice'

const dataManager = getService('dataManager')

export default class NotificationItem extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      hidden: false
    }

    this.timer = null
    this.handleClickHideNotification = this.handleClickHideNotification.bind(this)
    this.handleRemoveNotification = this.handleRemoveNotification.bind(this)
  }

  componentWillUnmount () {
    store.dispatch(notificationRemoved(this.props.data.id))
  }

  handleRemoveNotification () {
    store.dispatch(notificationRemoved(this.props.data.id))
  }

  handleClickHideNotification () {
    this.setState({ hidden: true })
    const element = ReactDOM.findDOMNode(this)
    element.addEventListener('transitionend', this.handleRemoveNotification)
  }

  render () {
    const localizations = dataManager.get('localizations')
    const { data } = this.props
    if (!data.text) {
      return null
    }
    let textHtml = ''
    let closeButton = ''
    const customProps = {}

    if (data.html) {
      textHtml = <div className='vcv-layout-notifications-text' dangerouslySetInnerHTML={{ __html: data.text }} />
    } else {
      textHtml = <div className='vcv-layout-notifications-text'>{data.text}</div>
    }

    if (data.showCloseButton) {
      const closeTitle = localizations ? localizations.close : 'Close'
      closeButton = (
        <div className='vcv-layout-notifications-close' title={closeTitle} onClick={this.handleClickHideNotification}>
          <i className='vcv-ui-icon vcv-ui-icon-close-thin' />
        </div>
      )
    } else {
      customProps.onClick = this.handleClickHideNotification
    }

    const type = data.type && ['default', 'success', 'warning', 'error'].indexOf(data.type) >= 0 ? data.type : 'default'

    const classes = classNames({
      'vcv-layout-notifications-item': true,
      [`vcv-layout-notifications-type--${type}`]: true,
      'vcv-layout-notifications-type--disabled': this.state.hidden
    })

    return (
      <div className={classes} {...customProps} ref={(element) => { this.textInput = element }}>
        {textHtml}
        {closeButton}
      </div>
    )
  }
}
