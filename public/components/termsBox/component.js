import React from 'react'
import { getService, getStorage } from 'vc-cake'
import classNames from 'classnames'

const dataManager = getService('dataManager')
const localizations = dataManager.get('localizations')
const settingsStorage = getStorage('settings')
const dataProcessor = getService('dataProcessor')
const editorPopupStorage = getStorage('editorPopup')

export default class TermsBox extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      isLoading: false
    }

    this.handleClick = this.handleClick.bind(this)
  }

  handleClick () {
    const editorLink = 'https://visualcomposer.com/cloud-access-terms/confirmation/?utm_source=vcwb&utm_medium=hub-editor&utm_campaign=get-free-license&utm_content=button'
    const dashboardLink = 'https://visualcomposer.com/cloud-access-terms/confirmation/?utm_source=vcwb&utm_medium[…]cdashboard&utm_campaign=get-free-license&utm_content=button'
    const utmLink = dataManager.get('slug') === 'vcv-hub' ? dashboardLink : editorLink
    window.open(utmLink)
    this.setState({ isLoading: true })
    settingsStorage.state('agreeHubTerms').set(true)
    dataProcessor.appAdminServerRequest({
      'vcv-action': 'editors:agreeHubTerms:enable:adminNonce'
    }).then(() => {
      const popupData = editorPopupStorage.state('fullScreenPopupData').get() || {}
      popupData && popupData.onPrimaryButtonClick && popupData.onPrimaryButtonClick()

      this.setState({ isLoading: false })
      this.props.onClose()
    })
  }

  render () {
    const buttonClasses = classNames({
      'vcv-premium-teaser-btn': true,
      'vcv-premium-teaser-btn--loading': this.state.isLoading
    })

    let closeButton = null

    if (this.props.onClose) {
      const closeButtonText = localizations.close || 'Close'
      closeButton = (
        <button
          className='vcv-premium-teaser-close vcv-ui-icon vcv-ui-icon-close-thin'
          aria-label={closeButtonText}
          onClick={this.props.onClose}
        />)
    }

    const description = localizations ? localizations.agreeHubAccessTerms : 'To download content from the Visual Composer Hub, read and accept our <a href="https://visualcomposer.com/terms-of-use/" target="_blank" rel="noopener noreferrer">cloud access terms</a> and <a href="https://visualcomposer.com/privacy-policy/" target="_blank" rel="noopener noreferrer">privacy policy</a>'

    return (
      <div className='vcv-premium-teaser'>
        {closeButton}
        <div className='vcv-agree-hub-terms-badge' />
        <header className='vcv-premium-teaser-header'>
          <h2 className='vcv-premium-teaser-heading'>
            {localizations ? localizations.addPremiumElement : 'Visual Composer Hub'}
          </h2>
        </header>
        <div className='vcv-premium-teaser-content'>
          <p className='vcv-premium-teaser-text' dangerouslySetInnerHTML={{ __html: description }} />
        </div>
        <div className='vcv-premium-teaser-action-container'>
          <button className={buttonClasses} onClick={this.handleClick}>
            {localizations ? localizations.yesIAgree : 'Yes, I agree'}
          </button>
        </div>
      </div>
    )
  }
}
