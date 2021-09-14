import React from 'react'
import ReactDOM from 'react-dom'
import classNames from 'classnames'
import { getStorage } from 'vc-cake'

const notificationsStorage = getStorage('notifications')

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

  componentDidMount () {
    const { time } = this.props.data
    const timeout = parseInt(time)
    if (timeout !== -1) {
      this.timer = window.setTimeout(() => {
        this.handleClickHideNotification()
      }, timeout)
    }
  }

  componentWillUnmount () {
    window.clearTimeout(this.timer)
    notificationsStorage.trigger('remove', this.props.data.id)
  }

  handleRemoveNotification () {
    notificationsStorage.trigger('remove', this.props.data.id)
  }

  handleClickHideNotification () {
    window.clearTimeout(this.timer)
    this.setState({ hidden: true })
    const element = ReactDOM.findDOMNode(this)
    element.addEventListener('transitionend', this.handleRemoveNotification)
  }

  render () {
    const { data, position } = this.props
    if (!data.text) {
      return null
    }
    let textHtml = ''
    let iconHtml = ''
    let closeButton = ''
    const customProps = {}

    if (data.html) {
      textHtml = <div className='vcv-layout-notifications-text' dangerouslySetInnerHTML={{ __html: data.text }} />
    } else {
      textHtml = <div className='vcv-layout-notifications-text'>{data.text}</div>
    }

    if (data.icon) {
      iconHtml = <div className='vcv-layout-notifications-icon'><i className={data.icon} /></div>
    }

    if (data.showCloseButton) {
      closeButton = (
        <div className='vcv-layout-notifications-close' onClick={this.handleClickHideNotification}>
          <div className='vcv-layout-notifications-close-btn' />
        </div>
      )
    } else {
      customProps.onClick = this.handleClickHideNotification
    }

    const type = data.type && ['default', 'success', 'warning', 'error'].indexOf(data.type) >= 0 ? data.type : 'default'

    const classes = classNames({
      [`vcv-layout-notifications-position--${position}`]: true,
      [`vcv-layout-notifications-type--${type}`]: true,
      'vcv-layout-notifications-style--transparent': data.transparent,
      'vcv-layout-notifications-shape--rounded': data.rounded,
      'vcv-layout-notifications-type--disabled': this.state.hidden
    })

    return (
      <div className={classes} {...customProps} ref={(element) => { this.textInput = element }}>
        {iconHtml}
        {textHtml}
        {closeButton}
      </div>
    )
  }
}
