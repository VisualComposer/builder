import React from 'react'
import VCVLogo from './vcvLogo'
import VersionBox from './versionBox'
import Timeline from './timeline'

import { getService } from 'vc-cake'
import { getResponse } from 'public/tools/response'

const dataProcessor = getService('dataProcessor')

export default class InitialScreen extends React.Component {
  static localizations = window.VCV_I18N && window.VCV_I18N()
  static texts = {
    createYourWordpressWebsite: InitialScreen.localizations ? InitialScreen.localizations.createYourWordpressWebsite : 'Create Your WordPress Website.',
    anyLayoutFastAndEasy: InitialScreen.localizations ? InitialScreen.localizations.anyLayoutFastAndEasy : 'Any Layout. Fast and Easy.',
    unlockHub: InitialScreen.localizations ? InitialScreen.localizations.unlockHub : 'Unlock Visual Composer Hub',
    goPremium: InitialScreen.localizations ? InitialScreen.localizations.goPremium : 'Go Premium',
    directActivation: InitialScreen.localizations ? InitialScreen.localizations.directActivation : 'Direct Activation',
    themeActivation: InitialScreen.localizations ? InitialScreen.localizations.themeActivation : 'Theme Activation',
    bundledInThemeText: InitialScreen.localizations ? InitialScreen.localizations.bundledInThemeText : 'It seems your Visual Composer Website Builder was bundled in a theme.',
    chooseThemeOrDirectActivationText: InitialScreen.localizations ? InitialScreen.localizations.chooseThemeOrDirectActivationText : 'Choose between theme activation or activate Visual Composer with direct license.'
  }

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
    const iWantToGoPremiumText = InitialScreen.localizations ? InitialScreen.localizations.iWantToGoPremium : 'I want to go premium'
    const freeText = InitialScreen.localizations ? InitialScreen.localizations.freeLicense : 'Free License'
    const limitedText = InitialScreen.localizations ? InitialScreen.localizations.limitedAccessToExtensions : 'Limited access to the Visual Composer Hub of elements, templates, and add-ons'
    const themeBuilderWithHFSText = InitialScreen.localizations ? InitialScreen.localizations.themeBuilderWithHFS : 'Theme builder with Header, Footer, and Sidebar editor'
    const wooCommerceCompatibilityText = InitialScreen.localizations ? InitialScreen.localizations.wooCommerceCompatibility : 'WooCommerce compatibility'
    const premiumSupportAndUpdatesText = InitialScreen.localizations ? InitialScreen.localizations.premiumSupportAndUpdates : 'Premium support and updates'
    const activateFreeText = InitialScreen.localizations ? InitialScreen.localizations.activateFree : 'Activate Free'
    const premiumLicenseText = InitialScreen.localizations ? InitialScreen.localizations.premiumLicense : 'Premium License'
    const unlimitedAccessToExtensionsText = InitialScreen.localizations ? InitialScreen.localizations.unlimitedAccessToExtensions : 'Unlimited access to the Visual Composer Hub of elements, templates, and add-ons'

    const goPremiumButton = (
      <a href={window.VCV_GO_PREMIUM_URL()} target='_blank' rel='noopener noreferrer' className='vcv-activation-button vcv-activation-button--dark'>
        {iWantToGoPremiumText}
      </a>
    )
    if (window.VCV_MANAGE_OPTIONS()) {
      if (window.VCV_IS_FREE_ACTIVATED()) {
        return (
          <div className='vcv-activation-simple-list'>
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
        )
      } else {
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
                <a href={window.VCV_GO_FREE_URL()} target='_blank' rel='noopener noreferrer' className='vcv-activation-button vcv-activation-button--dark'>
                  {activateFreeText}
                </a>
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
    }
  }

  render () {
    const { hasError, errorText, loading } = this.state
    const enterYourLicenseKey = InitialScreen.localizations ? InitialScreen.localizations.enterYourLicenseKey : 'Enter your license key'

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

    return (
      <div className='vcv-initial-screen vcv-activation-content' ref={this.activationContent}>
        <VCVLogo />
        <VersionBox />
        <Timeline />

        <p className='vcv-activation-heading'>
          Get Access to the Visual Composer Hub
        </p>
        <p className='vcv-activation-description'>
          Build your site with the help of drag and drop editor straight from the frontend - it’s that easy.
        </p>

        {errorBox}
        <div className={inputClasses}>
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
            type='button'
            className='vcv-activation-input-button'
            onClick={this.handleActivateClick}
          >
            Activate
          </button>
        </div>

        {this.getFeatureList()}
      </div>
    )
  }
}
