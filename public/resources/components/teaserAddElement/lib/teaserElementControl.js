import React from 'react'
import classNames from 'classnames'
import { env, getService } from 'vc-cake'
import ElementControl from '../../addElement/lib/elementControl'

const dataProcessor = getService('dataProcessor')

export default class TeaserElementControl extends ElementControl {
  downloadElement (e) {
    // TODO: start loader
    let bundle = e.currentTarget.dataset.bundle
    console.log('download', bundle)

    let data = {
      'vcv-action': 'hub:download:element:adminNonce',
      'vcv-bundle': bundle,
      'vcv-nonce': window.vcvNonce
    }
    dataProcessor.appServerRequest(data).then(() => {
      // TODO: Sync element and setState loader finished
      // TODO: Set success notice
      console.log('success')
    }, () => {
      // Failed
      // TODO: Set failed notice and finish loader
      console.log('failed')
    })
  }

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

    let bundle
    if (env('HUB_TEASER_ELEMENT_DOWNLOAD')) {
      // element/lcfirst(tag)
      bundle = 'element/' + element.tag.charAt(0).toLowerCase() + element.tag.substr(1, element.tag.length - 1)
      if (element.bundle) {
        bundle = element.bundle
      }
    }

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
              {/* TODO: change icon */}
              {env('HUB_TEASER_ELEMENT_DOWNLOAD') ? <span data-bundle={bundle} className='vcv-ui-item-add vcv-ui-icon vcv-ui-icon-arrow-up' onClick={this.downloadElement.bind(this)} /> : ''}
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
