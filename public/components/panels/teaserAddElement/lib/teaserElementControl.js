import React from 'react'
import classNames from 'classnames'
import { env, getService, getStorage } from 'vc-cake'
import ElementControl from '../../addElement/lib/elementControl'

const hubElementsService = getService('hubElements')
const myTemplatesService = getService('myTemplates')
const workspaceStorage = getStorage('workspace')
const workspaceNotifications = workspaceStorage.state('notifications')
const elementsStorage = getStorage('elements')
const workspaceSettings = workspaceStorage.state('settings')
const hubElementsStorage = getStorage('hubElements')
const hubTemplateStorage = getStorage('hubTemplates')
const hubAddonsStorage = getStorage('hubAddons')
const eventsStorage = getStorage('events')

export default class TeaserElementControl extends ElementControl {
  constructor (props) {
    super(props)
    const elements = hubElementsService.all()

    let elementState
    if (this.props.type === 'element') {
      const downloadingItems = workspaceStorage.state('downloadingItems').get() || []
      if (downloadingItems.includes(props.tag)) {
        elementState = 'downloading'
      } else {
        elementState = typeof elements[ this.props.tag ] !== 'undefined' ? 'success' : 'inactive'
      }
    } else if (this.props.type === 'addon') {
      const tag = this.props.element.tag
      const downloadingItems = workspaceStorage.state('downloadingItems').get() || []
      if (downloadingItems.includes(tag)) {
        elementState = 'downloading'
      } else if (hubAddonsStorage.state('addons').get()[ tag ]) {
        elementState = 'success'
      } else {
        elementState = 'inactive'
      }
    } else {
      const downloadingItems = workspaceStorage.state('downloadingItems').get() || []
      let tag = this.props.element.bundle.replace('template/', '').replace('predefinedTemplate/', '')
      if (downloadingItems.includes(tag)) {
        elementState = 'downloading'
      } else {
        elementState = 'inactive'
        if (myTemplatesService.findTemplateByBundle(this.props.element.bundle)) {
          elementState = 'success'
        }
      }
    }

    this.state = {
      elementState: elementState,
      showLoading: false
    }

    this.addElement = this.addElement.bind(this)
    this.downloadElement = this.downloadElement.bind(this)
    this.downloadTemplate = this.downloadTemplate.bind(this)
    this.downloadAddon = this.downloadAddon.bind(this)
    this.addTemplate = this.addTemplate.bind(this)
    this.downloadingItemOnChange = this.downloadingItemOnChange.bind(this)
    this.handleAddonClick = this.handleAddonClick.bind(this)
  }

  componentDidMount () {
    if (this.state.elementState === 'downloading') {
      workspaceStorage.state('downloadingItems').onChange(this.downloadingItemOnChange)
    }
    this.ellipsize('.vcv-ui-item-element-name')
    this.ellipsize('.vcv-ui-item-preview-text')
  }

  componentWillUnmount () {
    workspaceStorage.state('downloadingItems').ignoreChange(this.downloadingItemOnChange)
  }

  downloadingItemOnChange (data) {
    let tag = this.props.type === 'element' ? this.props.tag : this.props.element.bundle.replace('template/', '').replace('predefinedTemplate/', '').replace('addon/', '')
    let elementState = 'failed'
    if (!data.includes(tag)) {
      switch (this.props.type) {
        case 'element':
          elementState = this.props.tag && 'success'
          break
        case 'addon':
          elementState = this.props.tag && 'success'
          break
        case 'template':
          elementState = this.props.element.bundle.replace('template/', '').replace('predefinedTemplate/', '') && 'success'
          break
        default:
          console.warn('Invalid hub element type received')
      }
      // let downloaded = this.props.type === 'element' ? hubElementsService.get(tag) : templatesService.findBy('bundle', this.props.element.bundle)
      this.setState({ elementState })
      workspaceStorage.state('downloadingItems').ignoreChange(this.downloadingItemOnChange)
    }
  }

  downloadAddon (e) {
    if (!this.props.element.allowDownload || !window.vcvIsActivated) {
      return
    }

    const localizations = window.VCV_I18N && window.VCV_I18N()
    if (this.props.element.update) {
      let errorMessage = localizations.elementDownloadRequiresUpdate || 'Update Visual Composer plugin to the most recent version to download this content element.'
      workspaceNotifications.set({
        type: 'error',
        text: errorMessage,
        showCloseButton: 'true',
        icon: 'vcv-ui-icon vcv-ui-icon-error',
        time: 5000
      })
      return
    }
    this.setState({ elementState: 'downloading' })
    workspaceStorage.state('downloadingItems').onChange(this.downloadingItemOnChange)
    hubAddonsStorage.trigger('downloadAddon', this.props.element)
  }

  downloadElement (e) {
    if (!this.props.element.allowDownload || !window.vcvIsActivated) {
      return
    }

    const localizations = window.VCV_I18N && window.VCV_I18N()
    if (this.props.element.update) {
      let errorMessage = localizations.elementDownloadRequiresUpdate || 'Update Visual Composer plugin to the most recent version to download this content element.'
      workspaceNotifications.set({
        type: 'error',
        text: errorMessage,
        showCloseButton: 'true',
        icon: 'vcv-ui-icon vcv-ui-icon-error',
        time: 5000
      })
      return
    }
    this.setState({ elementState: 'downloading' })
    workspaceStorage.state('downloadingItems').onChange(this.downloadingItemOnChange)
    hubElementsStorage.trigger('downloadElement', this.props.element)
  }

  downloadTemplate (e) {
    if (!this.props.element.allowDownload || !window.vcvIsActivated) {
      return
    }

    const localizations = window.VCV_I18N && window.VCV_I18N()

    if (this.props.element.update) {
      let errorMessage = localizations.templateDownloadRequiresUpdate || 'Update Visual Composer plugin to the most recent version to download this template.'
      workspaceNotifications.set({
        type: 'error',
        text: errorMessage,
        showCloseButton: 'true',
        icon: 'vcv-ui-icon vcv-ui-icon-error',
        time: 5000
      })
      return
    }
    this.setState({ elementState: 'downloading' })
    workspaceStorage.state('downloadingItems').onChange(this.downloadingItemOnChange)
    hubTemplateStorage.trigger('downloadTemplate', this.props.element)
  }

  addTemplate () {
    const next = (elements) => {
      elementsStorage.trigger('merge', elements)
      workspaceSettings.set(false)
    }
    if (env('FT_TEMPLATE_DATA_ASYNC')) {
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

  buildVariables (variables) {
    if (variables.length) {
      variables.forEach((item) => {
        if (typeof window[ item.key ] === 'undefined') {
          if (item.type === 'constant') {
            window[ item.key ] = function () { return item.value }
          } else {
            window[ item.key ] = item.value
          }
        }
      })
    }
  }

  addElement () {
    this.props.addElement(this.props.tag)
  }

  handleAddonClick () {
    const options = {
      element: this.props.element
    }
    eventsStorage.trigger('hub:addon:clickAdd', options)
  }

  openPremiumTab () {
    window.open(window.VCV_UTM().goPremiumElementDownload)
  }

  render () {
    let { name, element, tag, type } = this.props
    let { previewVisible, previewStyle, elementState } = this.state

    let itemElementClasses = classNames({
      'vcv-ui-item-element': true,
      'vcv-ui-item-element-inactive': elementState !== 'success'
    })

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

    let itemOverlayClasses = classNames({
      'vcv-ui-item-overlay': true,
      'vcv-ui-item-downloading': elementState === 'downloading'
    })

    let publicPathThumbnail = element.metaThumbnailUrl
    let publicPathPreview = element.metaPreviewUrl
    let lockIcon = (!element.allowDownload && elementState === 'inactive') || !window.vcvIsActivated

    let iconClasses = classNames({
      'vcv-ui-item-add': true,
      'vcv-ui-item-add-hub': true,
      'vcv-ui-icon': true,
      'vcv-ui-icon-download': elementState === 'inactive' || elementState === 'failed',
      'vcv-ui-wp-spinner-light': elementState === 'downloading' || this.state.showLoading,
      'vcv-ui-icon-lock': lockIcon
    })

    if (elementState === 'success') {
      let actionClass = 'vcv-ui-icon-add'

      if (type === 'addon') {
        const addonData = hubAddonsStorage.state('addons').get()[ tag ]
        actionClass = (addonData && (addonData.addable === undefined || addonData.addable)) ? 'vcv-ui-icon-add' : 'vcv-ui-icon-more-dots'
      }

      iconClasses += ` ${actionClass}`
    }

    let action = this.addElement
    if (this.props.type === 'element') {
      if (elementState !== 'success') {
        if (lockIcon) {
          action = this.openPremiumTab
        } else {
          action = this.downloadElement
        }
      }
    } else if (this.props.type === 'template') {
      action = this.addTemplate
      if (elementState !== 'success') {
        if (lockIcon) {
          action = this.openPremiumTab
        } else {
          action = this.downloadTemplate
        }
      }
    } else if (this.props.type === 'addon') {
      if (elementState !== 'success') {
        if (lockIcon) {
          action = this.openPremiumTab
        } else {
          action = this.downloadAddon
        }
      } else {
        action = this.handleAddonClick
      }
    }
    let overlayOutput = <span className={iconClasses} onClick={action} />

    return (
      <li className={listItemClasses}>
        <span className={itemElementClasses}
          onMouseEnter={this.showPreview}
          onMouseLeave={this.hidePreview}
          title={name}>
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
          <figure className={previewClasses} style={previewStyle}>
            <img className='vcv-ui-item-preview-image' src={publicPathPreview} alt={name} />
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
