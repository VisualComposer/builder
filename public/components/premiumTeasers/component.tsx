import React, { useState, useEffect, useCallback } from 'react'
import { getService, getStorage } from 'vc-cake'
import classNames from 'classnames'
import { notificationAdded } from '../../editor/stores/notifications/slice'
import { connect } from 'react-redux'
import { Dispatch } from 'redux' // eslint-disable-line

interface Notification {
  type: string,
    text: string,
    time: number
}

interface PremiumTeaserProps {
  headingText: string,
    buttonText: string,
    description: string,
    url: string,
    isPremiumActivated: boolean,
    addonName: string,
    onClose: () => void,
    onPrimaryButtonClick: () => void,
    notificationAdded: (notification: Notification) => void
}

interface Addon {
  allowDownload: boolean
  bundle: string
  metaAddonImageUrl: string
  metaDescription: string
  metaPreviewUrl: string
  metaThumbnailUrl: string
  name: string
  tag: string
  type: string
  update: boolean
}

const dataManager = getService('dataManager')
const hubAddonsStorage = getStorage('hubAddons')
const workspaceStorage = getStorage('workspace')
const localizations = dataManager.get('localizations')

const PremiumTeaser = ({ onClose, addonName, onPrimaryButtonClick, url, isPremiumActivated, buttonText, headingText, description, notificationAdded }: PremiumTeaserProps) => {
  let downloading = false
  const downloadingItems = workspaceStorage.state('downloadingItems').get() || []
  if (downloadingItems.includes(addonName)) {
    downloading = true
  }

  const [isDownloading, setIsDownloading] = useState(downloading)

  const handleClose = useCallback((event: KeyboardEvent) => {
    if ((event as KeyboardEvent).code === 'Escape') {
      onClose()
      workspaceStorage.state('hasModal').set(false)
    }
  }, [onClose])

  const checkDownloading = useCallback((): void => {
    const downloadingItems = workspaceStorage.state('downloadingItems').get() || []
    if (!downloadingItems.includes(addonName)) {
      setIsDownloading(false)
      onClose && onClose()
    }
  }, [onClose, addonName])

  useEffect(() => {
    window.addEventListener('keyup', handleClose)
    workspaceStorage.state('hasModal').set(true)
    return () => {
      workspaceStorage.state('downloadingItems').ignoreChange(checkDownloading)
      window.removeEventListener('keyup', handleClose)
    }
  }, [handleClose, checkDownloading])

  const handleClick = (): void => {
    const allAddons = hubAddonsStorage.state('addonTeasers').get()
    const addonIndex = allAddons.findIndex((addon: Addon) => addon.tag === addonName)
    const addonData = allAddons[addonIndex]
    const downloadedAddons = hubAddonsStorage.state('addons').get()

    if (downloadedAddons[addonData.tag]) {
      const successMessage = localizations.successAddonDownload || '{name} has been successfully downloaded from the Visual Composer Hub and added to your content library. To finish the installation process reload the page.'
      notificationAdded({
        type: 'warning',
        text: successMessage.replace('{name}', addonData.name),
        time: 8000
      })
    } else {
      setIsDownloading(true)
      hubAddonsStorage.trigger('downloadAddon', addonData)
      workspaceStorage.state('downloadingItems').onChange(checkDownloading)
      onPrimaryButtonClick && onPrimaryButtonClick()
    }
  }

  const buttonClasses = classNames({
    'vcv-premium-teaser-btn': true,
    'vcv-premium-teaser-btn--loading': isDownloading
  })

  let control = null
  let closeButton = null

  if (url && !isPremiumActivated) {
    control = <a className='vcv-premium-teaser-btn' href={url} target='_blank' rel='noopener noreferrer'>{buttonText}</a>
  } else {
    control = <button className={buttonClasses} onClick={handleClick}>{buttonText}</button>
  }

  if (onClose) {
    const closeButtonText = localizations.close || 'Close'
    closeButton = (
      <button
        className='vcv-premium-teaser-close vcv-ui-icon vcv-ui-icon-close-thin'
        aria-label={closeButtonText}
        onClick={onClose}
      />)
  }

  return (
    <div className='vcv-premium-teaser'>
      {closeButton}
      <div className='vcv-premium-teaser-badge' />
      <header className='vcv-premium-teaser-header'>
        <h2 className='vcv-premium-teaser-heading'>{headingText}</h2>
      </header>
      <div className='vcv-premium-teaser-content'>
        <p className='vcv-premium-teaser-text' dangerouslySetInnerHTML={{ __html: description }} />
      </div>
      <div className='vcv-premium-teaser-action-container'>
        {control}
      </div>
    </div>
  )
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  notificationAdded: (data: Notification) => dispatch(notificationAdded(data))
})

export default connect(null, mapDispatchToProps)(PremiumTeaser)
