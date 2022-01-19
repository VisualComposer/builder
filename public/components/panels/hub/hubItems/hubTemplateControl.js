import React from 'react'
import classNames from 'classnames'
import { env, getService, getStorage } from 'vc-cake'
import ElementControl from '../../addElement/lib/elementControl'

const myTemplatesService = getService('myTemplates')
const workspaceStorage = getStorage('workspace')
const elementsStorage = getStorage('elements')
const workspaceSettings = workspaceStorage.state('settings')
const hubTemplateStorage = getStorage('hubTemplates')
const dataManager = getService('dataManager')
const roleManager = getService('roleManager')
const localizations = dataManager.get('localizations')

export default class HubTemplateControl extends ElementControl {
  constructor (props) {
    super(props)

    this.state = {
      showLoading: false,
      isNew: this.props.isNew
    }

    this.isHubInWpDashboard = workspaceStorage.state('isHubInWpDashboard').get()
    this.downloadTemplate = this.downloadTemplate.bind(this)
    this.addTemplate = this.addTemplate.bind(this)
  }

  downloadTemplate () {
    const { element, onDownloadItem } = this.props
    const errorMessage = localizations.templateDownloadRequiresUpdate || 'Update Visual Composer plugin to the most recent version to download this template.'

    const allowDownload = onDownloadItem(errorMessage)
    if (allowDownload) {
      hubTemplateStorage.trigger('downloadTemplate', element)
    }
  }

  addTemplate () {
    const next = (elements) => {
      elementsStorage.trigger('merge', elements)
      workspaceSettings.set(false)
    }
    if (env('VCV_FT_TEMPLATE_DATA_ASYNC')) {
      const template = myTemplatesService.findTemplateByBundle(this.props.element.bundle)
      const id = template.id
      this.setState({ showLoading: true })
      myTemplatesService.load(id, (response) => {
        this.setState({ showLoading: false })
        next(response.data)
      })
    } else {
      const template = myTemplatesService.findTemplateByBundle(this.props.element.bundle)
      next(template.data)
    }
  }

  render () {
    const { name, element, isDownloading, isAllowedForThisRole } = this.props
    const { previewVisible, previewStyle, isNew } = this.state

    let elementState = 'downloading'
    if (!isDownloading) {
      elementState = myTemplatesService.findTemplateByBundle(element.bundle) ? 'success' : 'inactive'
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

    const publicPathThumbnail = element.metaThumbnailUrl
    const publicPathPreview = element.metaPreviewUrl
    const isAbleToAdd = roleManager.can('hub_elements_templates_blocks', roleManager.defaultTrue())

    const iconClasses = classNames({
      'vcv-ui-item-add': true,
      'vcv-ui-item-add-hub': true,
      'vcv-ui-icon': true,
      'vcv-ui-icon-download': elementState === 'inactive' && !lockIcon,
      'vcv-ui-wp-spinner-light': elementState === 'downloading' || this.state.showLoading,
      'vcv-ui-icon-lock-fill': lockIcon,
      'vcv-ui-icon-add': elementState === 'success' && !this.isHubInWpDashboard && isAbleToAdd
    })

    const itemProps = {}
    const overlayProps = {}

    let action
    if (this.isHubInWpDashboard) {
      action = null
    } else {
      if (isAbleToAdd) {
        action = this.addTemplate
      } else {
        overlayProps.style = {
          cursor: 'not-allowed'
        }
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
          itemProps.onClick = this.props.onClickGoPremium.bind(this, 'template')
        }
      } else {
        action = this.downloadTemplate
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
          <img className='vcv-ui-item-preview-image' src={publicPathPreview} alt={name} onLoad={this.handleUpdatePreviewPosition} />
          <figcaption className='vcv-ui-item-preview-caption'>
            <div className='vcv-ui-item-preview-text'>
              {element.metaDescription}
            </div>
            {newBadge || premiumBadge}
          </figcaption>
        </figure>
      )
    }

    return (
      <div className={listItemClasses}>
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
