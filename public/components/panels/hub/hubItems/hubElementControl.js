import React from 'react'
import classNames from 'classnames'
import { getService, getStorage } from 'vc-cake'
import ElementControl from '../../addElement/lib/elementControl'

const hubElementsStorage = getStorage('hubElements')
const workspaceStorage = getStorage('workspace')
const dataManager = getService('dataManager')
const localizations = dataManager.get('localizations')
const hubElementsState = hubElementsStorage.state('elements')
const roleManager = getService('roleManager')

export default class HubElementControl extends ElementControl {
  constructor (props) {
    super(props)
    this.itemRef = React.createRef()
    this.state = {
      isNew: this.props.isNew
    }
    this.isHubInWpDashboard = workspaceStorage.state('isHubInWpDashboard').get()

    this.addElement = this.addElement.bind(this)
    this.downloadElement = this.downloadElement.bind(this)
  }

  downloadElement () {
    const { element, onDownloadItem } = this.props
    const errorMessage = localizations.elementDownloadRequiresUpdate || 'Update Visual Composer plugin to the most recent version to download this content element.'

    const allowDownload = onDownloadItem(errorMessage)
    if (allowDownload) {
      hubElementsStorage.trigger('downloadElement', element)
    }
  }

  addElement () {
    this.props.addElement(this.props.element)
  }

  render () {
    const { name, element, isDownloading, tag, isAllowedForThisRole } = this.props
    const { previewVisible, previewStyle, isNew } = this.state
    const isAbleToAdd = roleManager.can('editor_content_element_add', roleManager.defaultTrue())

    let elementState = 'downloading'
    if (!isDownloading) {
      const hubElement = hubElementsState.get()[tag]
      if (typeof hubElement !== 'undefined' && !hubElement.metaIsElementRemoved) {
        elementState = 'success'
      } else {
        elementState = 'inactive'
      }
    }

    const lockIcon = !isAllowedForThisRole || (!element.allowDownload && elementState === 'inactive')
    const itemElementClasses = classNames({
      'vcv-ui-item-element': true,
      'vcv-ui-item-element-inactive': elementState !== 'success',
      'vcv-ui-item-element-inactive--locked': lockIcon
    })

    const listItemClasses = classNames({
      'vcv-ui-item-list-item': true,
      'vcv-ui-item-list-item--inactive': false
    })
    const nameClasses = classNames({
      'vcv-ui-item-badge vcv-ui-badge--success': false,
      'vcv-ui-item-badge vcv-ui-badge--warning': false
    })

    const itemOverlayClasses = classNames({
      'vcv-ui-item-overlay': true,
      'vcv-ui-item-downloading': elementState === 'downloading'
    })

    const publicPathThumbnail = element.thumbnailUrl || element.metaThumbnailUrl
    const publicPathPreview = element.previewUrl || element.metaPreviewUrl

    const iconClasses = classNames({
      'vcv-ui-item-add': true,
      'vcv-ui-item-add-hub': true,
      'vcv-ui-icon': true,
      'vcv-ui-icon-download': elementState === 'inactive' && !lockIcon,
      'vcv-ui-wp-spinner-light': elementState === 'downloading',
      'vcv-ui-icon-lock-fill': lockIcon,
      'vcv-ui-icon-add': elementState === 'success' && !this.isHubInWpDashboard && isAbleToAdd
    })

    const itemProps = {}
    const overlayProps = {}

    let action = (this.isHubInWpDashboard || !isAbleToAdd) ? null : this.addElement

    if (!isAbleToAdd && elementState === 'success') {
      overlayProps.style = {
        cursor: 'not-allowed'
      }
    }

    if (elementState !== 'success') {
      if (lockIcon) {
        action = null

        if (!isAllowedForThisRole) {
          overlayProps.style = {
            cursor: 'not-allowed'
          }
        } else {
          itemProps.onClick = this.props.onClickGoPremium.bind(this, 'element')
        }
      } else {
        action = this.downloadElement
      }
    }

    const overlayOutput = <span className={iconClasses} onClick={action} />
    let previewOutput = null
    let newBadge = null
    let premiumBadge = null

    if (isNew) {
      const newText = localizations.new || 'New'
      newBadge = <span className='vcv-ui-hub-item-badge vcv-ui-hub-item-badge--new'>{newText}</span>
    }
    if (!isNew && element.bundleType && element.bundleType.indexOf('free') < 0) {
      const premiumText = localizations ? localizations.premium : 'Premium'
      premiumBadge = <span className='vcv-ui-hub-item-badge vcv-ui-hub-item-badge--new'>{premiumText}</span>
    }

    if (previewVisible) {
      previewOutput = (
        <figure className='vcv-ui-item-preview-container' style={previewStyle}>
          <img className='vcv-ui-item-preview-image' src={publicPathPreview} alt={name} onLoad={() => {
            this.handleUpdatePreviewPosition(this.itemRef.current)
          }} />
          <figcaption className='vcv-ui-item-preview-caption'>
            <div className='vcv-ui-item-preview-text'>
              {element.description || element.metaDescription}
            </div>
            {newBadge || premiumBadge}
          </figcaption>
        </figure>
      )
    }

    return (
      <div className={listItemClasses} ref={this.itemRef}>
        <span
          className={itemElementClasses}
          onMouseEnter={this.handleMouseEnterShowPreview}
          onMouseLeave={this.handleMouseLeaveHidePreview}
          title={name}
          {...itemProps}
        >
          {newBadge}
          <span className='vcv-ui-item-element-content'>
            <img className='vcv-ui-item-element-image' src={publicPathThumbnail} alt={name} />
            <span className={itemOverlayClasses} {...overlayProps}>
              {overlayOutput}
            </span>
          </span>
          <span className='vcv-ui-item-element-name'>
            <span className={nameClasses}>
              {name}
            </span>
          </span>
          {previewOutput}
        </span>
      </div>
    )
  }
}
