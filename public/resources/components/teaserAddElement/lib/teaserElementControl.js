import React from 'react'
import classNames from 'classnames'
import ElementControl from '../../addElement/lib/elementControl'

export default class TeaserElementControl extends ElementControl {
  render () {
    let { name, element } = this.props
    let { previewVisible, previewStyle } = this.state

    let listItemClasses = classNames({
      'vcv-ui-item-list-item': true,
      'vcv-ui-item-list-item--inactive': false
    })
    let nameClasses = classNames({
      'vcv-ui-item-badge vcv-ui-badge--success': false,
      'vcv-ui-item-badge vcv-ui-badge--warning': false
    })

    let previewClasses = classNames({
      'vcv-ui-item-preview-container': true,
      'vcv-ui-state--visible': previewVisible
    })

    let publicPathThumbnail = element.metaThumbnailUrl
    let publicPathPreview = element.metaPreviewUrl

    return (
      <li className={listItemClasses}>
        <span className='vcv-ui-item-element'
          onMouseEnter={this.showPreview}
          onMouseLeave={this.hidePreview}
          title={name}>
          <span className='vcv-ui-item-element-content'>
            <img className='vcv-ui-item-element-image' src={publicPathThumbnail}
              alt='' />
            <span className='vcv-ui-item-overlay'>
              <span className='vcv-ui-item-add vcv-ui-icon vcv-ui-icon-lock' />
            </span>
          </span>
          <span className='vcv-ui-item-element-name'>
            <span className={nameClasses}>
              {name}
            </span>
          </span>
          <figure className={previewClasses} style={previewStyle}>
            <img className='vcv-ui-item-preview-image' src={publicPathPreview} alt='' />
            <figcaption className='vcv-ui-item-preview-caption'>
              <div className='vcv-ui-item-preview-text'>
                {element.metaDescription}
              </div>
            </figcaption>
          </figure>
        </span>
      </li>
    )
  }
}
