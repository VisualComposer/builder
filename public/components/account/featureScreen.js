import React from 'react'
import VCVLogo from './vcvLogo'
import VersionBox from './versionBox'

export default class FeatureScreen extends React.Component {
  static localizations = window.VCV_I18N && window.VCV_I18N()

  constructor (props) {
    super(props)
    this.activationContent = React.createRef()
  }

  componentDidMount () {
    setTimeout(() => {
      this.activationContent.current && this.activationContent.current.classList.add('vcv-activation-content--active')
    }, 200)
    // Prevent offset on smaller screen sizes
    window.scrollTo(0,0)
  }

  render () {
    const activateFreeLink = window.VCV_ACTIVATE_FREE_URL()
    const activatePremiumText = FeatureScreen.localizations ? FeatureScreen.localizations.activatePremium : 'Activate Premium'
    const headingText = FeatureScreen.localizations ? FeatureScreen.localizations.getAccessToTheVisualComposerHub : 'Get Access to the Visual Composer Hub'
    const freeText = FeatureScreen.localizations ? FeatureScreen.localizations.freeLicense : 'Free License'
    const limitedText = FeatureScreen.localizations ? FeatureScreen.localizations.limitedAccessToExtensions : 'Limited access to the Visual Composer Hub of elements, templates, and extensions'
    const themeBuilderWithHFSText = FeatureScreen.localizations ? FeatureScreen.localizations.themeBuilderWithHFS : 'Theme builder with Header, Footer, and Sidebar editor'
    const wooCommerceCompatibilityText = FeatureScreen.localizations ? FeatureScreen.localizations.wooCommerceCompatibility : 'WooCommerce compatibility'
    const premiumSupportAndUpdatesText = FeatureScreen.localizations ? FeatureScreen.localizations.premiumSupportAndUpdates : 'Premium support and updates'
    const activateFreeText = FeatureScreen.localizations ? FeatureScreen.localizations.activateFree : 'Activate Free'
    const premiumLicenseText = FeatureScreen.localizations ? FeatureScreen.localizations.premiumLicense : 'Premium License'
    const unlimitedAccessToExtensionsText = FeatureScreen.localizations ? FeatureScreen.localizations.unlimitedAccessToExtensions : 'Unlimited access to the Visual Composer Hub of elements, templates, and extensions'

    return (
      <div className='vcv-activation-content' ref={this.activationContent}>
        <VCVLogo />
        <VersionBox />
        <p className='vcv-activation-heading'>{headingText}</p>
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
              <a href={activateFreeLink} className='vcv-activation-button vcv-activation-button--dark'>{activateFreeText}</a>
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
              <button type='button' onClick={this.props.setActiveScreen.bind(this, 'vcv-go-premium')} className='vcv-activation-button'>{activatePremiumText}</button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
