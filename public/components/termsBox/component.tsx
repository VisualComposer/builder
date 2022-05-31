import React from 'react'
import { getService, getStorage } from 'vc-cake'
import classNames from 'classnames'

const dataManager = getService('dataManager')
const localizations = dataManager.get('localizations')
const settingsStorage = getStorage('settings')
const dataProcessor = getService('dataProcessor')

interface Props {
  onPrimaryButtonClick?: () => void
  onClose?: () => void
}

interface State {
  isLoading: boolean
}

export default class TermsBox extends React.Component<Props, State> {
  constructor (props: Props) {
    super(props)

    this.state = {
      isLoading: false
    }

    this.handleClick = this.handleClick.bind(this)
  }

  handleClick () {
    this.handleUtmRedirect()
    this.setState({ isLoading: true })
    settingsStorage.state('agreeHubTerms').set(true)
    dataProcessor.appAdminServerRequest({
      'vcv-action': 'editors:agreeHubTerms:enable:adminNonce'
    }).then(() => {
      this.setState({ isLoading: false })
      this.props.onPrimaryButtonClick && this.props.onPrimaryButtonClick()
      this.props.onClose && this.props.onClose()
    })
  }

  handleUtmRedirect () {
    const utm = dataManager.get('utm')
    const editorMedium = 'hub-editor'
    const dashboardMedium = 'hub-vcdashboard'
    const utmMedium = dataManager.get('slug') === 'vcv-hub' ? dashboardMedium : editorMedium
    const utmLink = utm['hub-terms-box-button']
    const hubUtmLink = utmLink.replace('{medium}', utmMedium)

    window.open(hubUtmLink)
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
