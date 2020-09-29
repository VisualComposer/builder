import React from 'react'
import classNames from 'classnames'
import { env, getService, getStorage } from 'vc-cake'
import ElementControl from '../../addElement/lib/elementControl'

const myTemplatesService = getService('myTemplates')
const dataProcessorService = getService('dataProcessor')
const workspaceStorage = getStorage('workspace')
const elementsStorage = getStorage('elements')
const workspaceSettings = workspaceStorage.state('settings')
const hubTemplateStorage = getStorage('hubTemplates')

const localizations = window.VCV_I18N && window.VCV_I18N()

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
    this.sendHubTemplateStatus = this.sendHubTemplateStatus.bind(this)
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

  handleMouseLeaveHidePreview () {
    // send ajax if template is NEW
    if (this.state.isNew) {
      this.setState({
        isNew: false
      }, this.sendHubTemplateStatus)
    }
    super.handleMouseLeaveHidePreview()
  }

  sendHubTemplateStatus () {
    dataProcessorService.appAdminServerRequest({
      'vcv-action': 'hub:templates:teasers:updateStatus:adminNonce',
      'vcv-item-tag': this.props.tag
    })
  }

  openPremiumTab () {
    window.open(window.VCV_UTM().goPremiumElementDownload)
  }

  render () {
    const { name, element, isDownloading } = this.props
    const { previewVisible, previewStyle, isNew } = this.state

    let elementState = 'downloading'
    if (!isDownloading) {
      elementState = myTemplatesService.findTemplateByBundle(element.bundle) ? 'success' : 'inactive'
    }

    const lockIcon = (!element.allowDownload && elementState === 'inactive') || !window.vcvIsAnyActivated
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

    const previewClasses = classNames({
      'vcv-ui-item-preview-container': true,
      'vcv-ui-state--visible': previewVisible
    })

    const itemOverlayClasses = classNames({
      'vcv-ui-item-overlay': true,
      'vcv-ui-item-downloading': elementState === 'downloading'
    })

    const publicPathThumbnail = element.metaThumbnailUrl
    const publicPathPreview = element.metaPreviewUrl

    const iconClasses = classNames({
      'vcv-ui-item-add': true,
      'vcv-ui-item-add-hub': true,
      'vcv-ui-icon': true,
      'vcv-ui-icon-download': elementState === 'inactive',
      'vcv-ui-wp-spinner-light': elementState === 'downloading' || this.state.showLoading,
      'vcv-ui-icon-lock': lockIcon,
      'vcv-ui-icon-add': elementState === 'success' && !this.isHubInWpDashboard
    })

    let action = this.isHubInWpDashboard ? null : this.addTemplate
    if (elementState !== 'success') {
      if (lockIcon) {
        action = this.openPremiumTab
      } else {
        action = this.downloadTemplate
      }
    }

    const overlayOutput = <span className={iconClasses} onClick={action} />
    let previewOutput = null
    let newBadge = null

    if (isNew) {
      const newText = localizations.new || 'New'
      newBadge = <span className='vcv-ui-hub-item-badge vcv-ui-hub-item-badge--new'>{newText}</span>
    }

    if (previewVisible) {
      previewOutput = (
        <figure className={previewClasses} style={previewStyle}>
          <img className='vcv-ui-item-preview-image' src={publicPathPreview} alt={name} />
          <figcaption className='vcv-ui-item-preview-caption'>
            <div className='vcv-ui-item-preview-text'>
              {element.metaDescription}
            </div>
            {newBadge}
          </figcaption>
        </figure>
      )
    }

    return (
      <li className={listItemClasses}>
        <span
          className={itemElementClasses}
          onMouseEnter={this.handleMouseEnterShowPreview}
          onMouseLeave={this.handleMouseLeaveHidePreview}
          title={name}
        >
          {newBadge}
          <span className='vcv-ui-item-element-content'>
            <img className='vcv-ui-item-element-image' src={publicPathThumbnail} alt={name} />
            <span className={itemOverlayClasses}>
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
      </li>
    )
  }
}
