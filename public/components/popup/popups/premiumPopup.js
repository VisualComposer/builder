import React from 'react'
import PopupInner from '../popupInner'
import { getService, getStorage } from 'vc-cake'

const dataManager = getService('dataManager')
const workspaceStorage = getStorage('workspace')
const workspaceSettings = workspaceStorage.state('settings')

export default class PremiumPopup extends React.Component {
  constructor (props) {
    super(props)

    this.handlePrimaryButtonClick = this.handlePrimaryButtonClick.bind(this)
    this.handleCloseClick = this.handleCloseClick.bind(this)
  }

  handlePrimaryButtonClick () {
    const isPremiumActivated = dataManager.get('isPremiumActivated')
    if (isPremiumActivated) {
      const settings = {
        action: 'addHub',
        options: {
          filterType: 'addon',
          id: '4',
          bundleType: undefined
        }
      }
      workspaceSettings.set(settings)
    } else {
      const goPremiumUrl = dataManager.get('goPremiumUrl')
      window.open(goPremiumUrl, '_blank')
    }

    this.props.onPrimaryButtonClick()
  }

  handleCloseClick () {
    this.props.onClose()
  }

  getPopupBadge () {
    return (
      <div className='vcv-layout-popup-badge' />
    )
  }

  render () {
    const localizations = dataManager.get('localizations')
    const isPremiumActivated = dataManager.get('isPremiumActivated')
    const headingText = localizations ? localizations.premiumPopupBuilder : 'PREMIUM POPUP BUILDER. DO MORE.'
    const goPremiumText = localizations ? localizations.goPremium.toUpperCase() : 'GO PREMIUM'
    const downloadAddonText = localizations ? localizations.downloadTheAddon.toUpperCase() : 'DOWNLOAD THE ADD-ON'
    const popupText = localizations ? localizations.createEngagingPopups : 'Create engaging popups to boost your conversion rate with Visual Composer Premium Popup Builder.'

    return (
      <PopupInner
        {...this.props}
        headingText={headingText}
        popupName='premiumPopup'
        buttonText={isPremiumActivated ? downloadAddonText : goPremiumText}
        onPrimaryButtonClick={this.handlePrimaryButtonClick}
        popupBadgeHtml={this.getPopupBadge()}
        onClose={this.handleCloseClick}
      >
        <p className='vcv-layout-popup-text'>{popupText}</p>
      </PopupInner>
    )
  }
}
