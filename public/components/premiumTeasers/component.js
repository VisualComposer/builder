import React from 'react'
import { getService, getStorage } from 'vc-cake'
import classNames from 'classnames'

const dataManager = getService('dataManager')
const hubAddonsStorage = getStorage('hubAddons')
const workspaceStorage = getStorage('workspace')
const notificationsStorage = getStorage('notifications')
const localizations = dataManager.get('localizations')

export default class PremiumTeaser extends React.Component {
  constructor (props) {
    super(props)
    let isDownloading = false
    const downloadingItems = workspaceStorage.state('downloadingItems').get() || []
    if (downloadingItems.includes(this.props.addonName)) {
      isDownloading = true
    }

    this.state = {
      isDownloading: isDownloading
    }

    this.checkDownloading = this.checkDownloading.bind(this)
    this.handleClick = this.handleClick.bind(this)
  }

  componentWillUnmount () {
    workspaceStorage.state('downloadingItems').ignoreChange(this.checkDownloading)
  }

  checkDownloading () {
    const downloadingItems = workspaceStorage.state('downloadingItems').get() || []
    if (!downloadingItems.includes(this.props.addonName)) {
      this.setState({ isDownloading: false })
      this.props.onClose && this.props.onClose()
    }
  }

  handleClick () {
    const allAddons = hubAddonsStorage.state('addonTeasers').get()
    const addonIndex = allAddons.findIndex(addon => addon.tag === this.props.addonName)
    const addonData = allAddons[addonIndex]
    const downloadedAddons = hubAddonsStorage.state('addons').get()

    if (downloadedAddons[addonData.tag]) {
      const successMessage = localizations.successAddonDownload || '{name} has been successfully downloaded from the Visual Composer Hub and added to your content library. To finish the installation process reload the page.'
      notificationsStorage.trigger('add', {
        position: 'top',
        transparent: false,
        rounded: false,
        type: 'warning',
        text: successMessage.replace('{name}', addonData.name),
        time: 8000
      })
    } else {
      this.setState({ isDownloading: true })
      hubAddonsStorage.trigger('downloadAddon', addonData)
      workspaceStorage.state('downloadingItems').onChange(this.checkDownloading)
      this.props.onPrimaryButtonClick && this.props.onPrimaryButtonClick()
    }
  }

  render () {
    const buttonClasses = classNames({
      'vcv-premium-teaser-btn': true,
      'vcv-premium-teaser-btn--loading': this.state.isDownloading
    })

    let control = null
    let closeButton = null

    if (this.props.url && !this.props.isPremiumActivated) {
      control = <a className='vcv-premium-teaser-btn' href={this.props.url} target='_blank' rel='noopener noreferrer'>{this.props.buttonText}</a>
    } else {
      control = <button className={buttonClasses} onClick={this.handleClick}>{this.props.buttonText}</button>
    }

    if (this.props.onClose) {
      const closeButtonText = localizations.close || 'Close'
      closeButton = (
        <button
          className='vcv-premium-teaser-close vcv-ui-icon vcv-ui-icon-close-thin'
          aria-label={closeButtonText}
          onClick={this.props.onClose}
        />)
    }

    return (
      <div className='vcv-premium-teaser'>
        {closeButton}
        <div className='vcv-premium-teaser-badge' />
        <header className='vcv-premium-teaser-header'>
          <h2 className='vcv-premium-teaser-heading'>{this.props.headingText}</h2>
        </header>
        <div className='vcv-premium-teaser-content'>
          <p className='vcv-premium-teaser-text' dangerouslySetInnerHTML={{ __html: this.props.description }} />
        </div>
        <div className='vcv-premium-teaser-action-container'>
          {control}
        </div>
      </div>
    )
  }
}
