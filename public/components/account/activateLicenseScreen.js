import React from 'react'
import VCVLogo from './vcvLogo'
import VersionBox from './versionBox'
import Timeline from './timeline'

import { getService } from 'vc-cake'
import { getResponse } from 'public/tools/response'

const dataProcessor = getService('dataProcessor')

export default class ActivateLicenseScreen extends React.Component {
  static localizations = window.VCV_I18N && window.VCV_I18N()

  constructor (props) {
    super(props)
    this.state = {
      licenseValue: '',
      hasError: false,
      errorText: ''
    }

    this.activationContent = React.createRef()

    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleInputFocus = this.handleInputFocus.bind(this)
    this.handleActivateClick = this.handleActivateClick.bind(this)
    this.setError = this.setError.bind(this)
  }

  componentDidMount () {
    setTimeout(() => {
      this.activationContent.current && this.activationContent.current.classList.add('vcv-activation-content--active')
    }, 0)
  }

  handleInputChange (e) {
    const val = e.currentTarget && e.currentTarget.value

    this.setState({
      licenseValue: val
    })
  }

  handleActivateClick (e) {
    e.preventDefault()
    this.setState({
      hasError: false,
      errorText: ''
    })
    if (this.state.licenseValue) {
      this.setState({
        loading: true
      })
      dataProcessor.appAdminServerRequest({
        'vcv-action': 'license:activate:adminNonce',
        'vcv-license-key': this.state.licenseValue
      }).then((responseData) => {
        const response = getResponse(responseData)
        if (response && response.status) {
          const updateUrl = window.VCV_UPDATE_URL && window.VCV_UPDATE_URL()
          if (updateUrl) {
            window.location.href = updateUrl
          } else {
            window.location.reload()
          }
        } else {
          this.setError(response && response.message ? response.message : '')
          console.warn(response)
        }
      }, (error) => {
        this.setError()
        console.warn(error)
      })
    } else {
      this.setState({
        hasError: true
      })
    }
  }

  setError (errorText) {
    if (errorText) {
      this.setState({ errorText })
    }
    this.setState({
      hasError: true,
      loading: false
    })
  }

  handleInputFocus () {
    this.setState({ hasError: false })
  }

  getFeatureList () {
    const iWantToGoPremiumText = ActivateLicenseScreen.localizations ? ActivateLicenseScreen.localizations.goPremium : 'Go Premium'
    const getFreeLicenseText = ActivateLicenseScreen.localizations ? ActivateLicenseScreen.localizations.getFreeLicense : 'Get Free License'
    const freeLicenseActivatedText = ActivateLicenseScreen.localizations ? ActivateLicenseScreen.localizations.activated : 'Activated'
    const freeText = ActivateLicenseScreen.localizations ? ActivateLicenseScreen.localizations.freeLicense : 'Free License'
    const limitedText = ActivateLicenseScreen.localizations ? ActivateLicenseScreen.localizations.limitedAccessToExtensions : 'Limited access to the Visual Composer Hub of elements, templates, and addons'
    const themeBuilderWithHFSText = ActivateLicenseScreen.localizations ? ActivateLicenseScreen.localizations.themeBuilderWithHFS : 'A theme builder with Header, Footer, and Sidebar editor'
    const wooCommerceCompatibilityText = ActivateLicenseScreen.localizations ? ActivateLicenseScreen.localizations.wooCommerceCompatibility : 'WooCommerce compatibility'
    const premiumSupportAndUpdatesText = ActivateLicenseScreen.localizations ? ActivateLicenseScreen.localizations.premiumSupportAndUpdates : 'Premium support and updates'
    const premiumLicenseText = ActivateLicenseScreen.localizations ? ActivateLicenseScreen.localizations.premiumLicense : 'Premium License'
    const unlimitedAccessToExtensionsText = ActivateLicenseScreen.localizations ? ActivateLicenseScreen.localizations.unlimitedAccessToExtensions : 'Unlimited access to the Visual Composer Hub of elements, templates, and addons'

    let getFreeButton = (
      <a href={window.VCV_GO_FREE_URL()} target='_blank' rel='noopener noreferrer' className='vcv-activation-button vcv-activation-button--dark'>
        {getFreeLicenseText}
      </a>
    )
    if (window.vcvIsFreeActivated) {
      getFreeButton = (
        <button className='vcv-activation-button vcv-activation-button--dark vcv-activation-button--free-activated' disabled>
          {freeLicenseActivatedText}
        </button>
      )
    }

    const goPremiumButton = (
      <a href={window.VCV_GO_PREMIUM_URL()} target='_blank' rel='noopener noreferrer' className='vcv-activation-button vcv-activation-button--dark'>
        {iWantToGoPremiumText}
      </a>
    )

    return (
      <div className='vcv-activation-box-container'>
        <div className='vcv-activation-box'>
          <h3 className='vcv-activation-box-heading'>{freeText}</h3>
          <ul className='vcv-basic-list'>
            <li className='vcv-basic-list-item'>{limitedText}</li>
            <li className='vcv-basic-list-item vcv-basic-list-item--not-included'>{themeBuilderWithHFSText}</li>
            <li className='vcv-basic-list-item vcv-basic-list-item--not-included'>{wooCommerceCompatibilityText}</li>
            <li className='vcv-basic-list-item vcv-basic-list-item--not-included'>{premiumSupportAndUpdatesText}</li>
          </ul>
          <div className='vcv-activation-button-container'>
            {getFreeButton}
          </div>
        </div>
        <div className='vcv-activation-box'>
          <h3 className='vcv-activation-box-heading'>{premiumLicenseText}</h3>
          <ul className='vcv-basic-list'>
            <li className='vcv-basic-list-item'>{unlimitedAccessToExtensionsText}</li>
            <li className='vcv-basic-list-item'>{themeBuilderWithHFSText}</li>
            <li className='vcv-basic-list-item'>{wooCommerceCompatibilityText}</li>
            <li className='vcv-basic-list-item'>{premiumSupportAndUpdatesText}</li>
          </ul>
          <div className='vcv-activation-button-container'>
            {goPremiumButton}
          </div>
        </div>
      </div>
    )
  }

  render () {
    const { hasError, errorText, loading } = this.state
    const enterYourLicenseKey = ActivateLicenseScreen.localizations ? ActivateLicenseScreen.localizations.enterYourLicenseKey : 'Enter your license key'
    const makeTheFinalStepText = ActivateLicenseScreen.localizations ? ActivateLicenseScreen.localizations.makeTheFinalStep : 'Make the final step! Enter your license key to activate Visual Composer Hub and start creating the website right away.'
    const activateVisualComposerHubText = ActivateLicenseScreen.localizations ? ActivateLicenseScreen.localizations.activateVisualComposerHub : 'Activate Visual Composer Hub'
    const activateText = ActivateLicenseScreen.localizations ? ActivateLicenseScreen.localizations.activate : 'Activate'
    const bundledInAThemeText = ActivateLicenseScreen.localizations ? ActivateLicenseScreen.localizations.bundledInAThemeText : 'It seems that your copy of Visual Composer was bundled in a theme - use your Envato purchase key to activate Visual Composer Premium. You can also activate Visual Composer with a free or premium license.'
    const alreadyHaveALicenseText = ActivateLicenseScreen.localizations ? ActivateLicenseScreen.localizations.alreadyHaveALicenseText : 'Already have a license? Log in to My Visual Composer(link) to find it.'

    let inputClasses = 'vcv-activation-input-field'
    if (hasError) {
      inputClasses += ' vcv-activation-input-field--error'
    }
    if (loading) {
      inputClasses += ' vcv-activation-input-field--loading'
    }

    let errorBox = null
    if (errorText) {
      errorBox = <div className='vcv-activation-box-error-box'>{errorText}</div>
    }

    const authorApiKey = window.VCV_AUTHOR_API_KEY && window.VCV_AUTHOR_API_KEY()
    let forgotYourLicense = (
      <p className='vcv-activation-input-field-forgot-license' dangerouslySetInnerHTML={{ __html: alreadyHaveALicenseText }} />
    )
    let themeNotice = null
    if (this.props.licenseType !== 'theme' && authorApiKey) {
      themeNotice = (
        <div className='vcv-activation-theme-notice'>
          <svg className='vcv-activation-theme-notice-logo' enableBackground='new 0 0 128 128' version='1.1' viewBox='0 0 128 128' xmlns='http://www.w3.org/2000/svg'>
            <g>
              <rect fill='none' height='128' width='128' />
              <path clipRule='evenodd' d='M102.953,0.702 c5.732,2.812,29.055,53.144,9.158,96.98c-15.979,35.2-56.093,35.204-76.427,22.8c-17.368-10.6-43.898-43.996-14.528-84.776 c1.243-1.548,4.225-1.408,3.552,3.268c-0.476,3.32-4.736,27.156,3.395,37.512c3.714,5.18,4.583,1.608,4.583,1.608 S32.053,43.41,58.422,17.078C75.16,1.022,98.374-1.546,102.953,0.702' fill='#FFFFFF' fillRule='evenodd' />
            </g>
          </svg>
          {bundledInAThemeText}
        </div>
      )
      forgotYourLicense = null
    }

    return (
      <div className='vcv-activation-content' ref={this.activationContent}>
        <VCVLogo />
        <VersionBox />
        <Timeline />

        <p className='vcv-activation-heading'>
          {activateVisualComposerHubText}
        </p>
        <p className='vcv-activation-description'>
          {makeTheFinalStepText}
        </p>

        {errorBox}
        <div className='vcv-activation-input-field-container'>
          <form className={inputClasses} onSubmit={this.handleActivateClick}>
            <input
              name='licenseKey'
              value={this.state.licenseValue}
              onChange={this.handleInputChange}
              maxLength='36'
              onFocus={this.handleInputFocus}
              type='text'
              className='vcv-activation-input'
              placeholder={enterYourLicenseKey}
            />
            <button
              type='submit'
              className='vcv-activation-input-button'
              onClick={this.handleActivateClick}
            >
              {activateText}
            </button>
          </form>
          {forgotYourLicense}
        </div>

        {themeNotice}

        {this.getFeatureList()}
      </div>
    )
  }
}
