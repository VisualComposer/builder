import React from 'react'
import classNames from 'classnames'
import { getStorage, getService } from 'vc-cake'

const hubAddonsStorage = getStorage('hubAddons')
const eventsStorage = getStorage('events')
const dataManager = getService('dataManager')
const localizations = dataManager.get('localizations')

export default class HubAddonControl extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isNew: this.props.isNew
    }

    this.downloadAddon = this.downloadAddon.bind(this)
    this.handleAddonClick = this.handleAddonClick.bind(this)
  }

  downloadAddon () {
    const { element, onDownloadItem } = this.props
    const errorMessage = localizations.addonDownloadRequiresUpdate || 'Update Visual Composer plugin to the most recent version to download this addon.'

    const allowDownload = onDownloadItem(errorMessage)
    if (allowDownload) {
      hubAddonsStorage.trigger('downloadAddon', element)
    }
  }

  handleAddonClick () {
    const options = {
      element: this.props.element
    }
    eventsStorage.trigger('hub:addon:clickAdd', options)
  }

  render () {
    const { name, element, isDownloading, tag, isAllowedForThisRole } = this.props
    const { isNew } = this.state
    let elementState = 'downloading'
    if (!isDownloading) {
      elementState = hubAddonsStorage.state('addons').get()[tag] ? 'success' : 'inactive'
    }

    const migratedToFree = dataManager.get('hubGetMigratedToFreeAddons')
    const isAddonMigratedToFree = Object.values(migratedToFree).includes(tag)
    if (isAddonMigratedToFree) {
      elementState = 'success'
    }

    const lockIcon = (!element.allowDownload && elementState === 'inactive')
    const downloadAddonText = localizations.downloadAddonText || 'Download Addon'
    const addonInstalledText = localizations.installedText || 'Installed'
    const availableInPremiumText = localizations.availableInPremiumText || 'Available in Premium'
    const restrictedText = localizations.restrictedText || 'Restricted'
    let buttonText

    let action = this.handleAddonClick
    if (elementState !== 'success') {
      if (!lockIcon) {
        action = this.downloadAddon
        if (!isAllowedForThisRole) {
          action = null
        }
      }
    }

    if (elementState === 'success') {
      buttonText = addonInstalledText
    } else if (lockIcon) {
      buttonText = availableInPremiumText
    } else if (elementState === 'inactive') {
      buttonText = downloadAddonText
      if (!isAllowedForThisRole) {
        buttonText = restrictedText
      }
    }

    const buttonClasses = classNames({
      'vcv-hub-addon-control': true,
      'vcv-hub-addon-control--locked': elementState === 'success' || (!lockIcon && !isAllowedForThisRole)
    })

    let addonControl = <button className={buttonClasses} onClick={action}>{buttonText}</button>
    if (elementState !== 'success' && lockIcon) {
      const utm = dataManager.get('utm')
      const buttonUrl = utm['editor-available-in-premium'].replace('{medium}', this.props.utmMedium)
      addonControl = <a className={buttonClasses} href={buttonUrl} target='_blank' rel='noopener noreferrer'>{buttonText}</a>
    }

    if (elementState === 'downloading') {
      addonControl = <span className='vcv-ui-icon vcv-ui-wp-spinner' />
    }

    let newBadge = null
    if (isNew) {
      const newText = localizations.new || 'New'
      newBadge = <span className='vcv-ui-hub-item-badge vcv-ui-hub-item-badge--new'>{newText}</span>
    }

    return (
      <div
        className='vcv-ui-item-list-item'
      >
        <div className='vcv-hub-addon-item-container'>
          <div className='vcv-hub-addon-item-image-container'>
            <img className='vcv-hub-addon-image' src={element.metaAddonImageUrl} alt={name} />
          </div>
          <div className='vcv-hub-addon-item-content-container'>
            {newBadge}
            <h3 className='vcv-hub-addon-name'>{name}</h3>
            <p className='vcv-hub-addon-description'>{element.metaDescription}</p>
            {addonControl}
          </div>
        </div>
      </div>
    )
  }
}
