import React from 'react'

export default class NotificationItem extends React.Component {
  render () {
    const { imageUrl, title, content, url } = this.props
    return (
      <div className='vcv-notification-item'>
        {url ? <a className='vcv-notification-item-url' target='_blank' rel='noopener noreferrer' href={url} /> : null}
        {imageUrl ? <img className='vcv-notification-item-image' src={imageUrl} /> : null}
        <div className='vcv-notification-item-content'>
          <div className='vcv-notification-item-title'>{title}</div>
          <div className='vcv-notification-item-text' dangerouslySetInnerHTML={{ __html: content }} />
        </div>
        {url ? <span className='vcv-notification-item-url-icon vcv-ui-icon vcv-ui-icon-exit-top-right' /> : null}
      </div>
    )
  }
}
