import React from 'react'
import SliderComponent from './slider'
import VCVLogo from './vcvLogo'
import VersionBox from './versionBox'
import ShareButtons from './shareButtons'

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
    this.activationContent = React.createRef()
  }

  componentDidMount () {
    setTimeout(() => {
      this.activationContent.current && this.activationContent.current.classList.add('vcv-activation-content--active')
    }, 0)
  }

  render () {
    let goPremiumButton = ''

    if (window.VCV_MANAGE_OPTIONS()) {
      let buttonText = window.VCV_IS_FREE_ACTIVATED() ? InitialScreen.texts.goPremium : InitialScreen.texts.unlockHub
      if (this.props.authorApiKey) {
        buttonText = InitialScreen.texts.directActivation
      }
      if (window.VCV_IS_FREE_ACTIVATED()) {
        goPremiumButton = (
          <button onClick={this.props.setActiveScreen.bind(this, 'vcv-go-premium')} className='vcv-activation-button vcv-activation-button--dark'>{buttonText}</button>
        )
      } else {
        goPremiumButton = (
          <button onClick={this.props.setActiveScreen.bind(this, 'vcv-license-options')} className='vcv-activation-button vcv-activation-button--dark'>{buttonText}</button>
        )
      }
    }

    let primaryButton = null
    if (this.props.authorApiKey) {
      primaryButton = (
        <button
          onClick={this.props.setActiveScreen.bind(this, 'vcv-activate-author')}
          className='vcv-activation-button'
        >
          {InitialScreen.texts.themeActivation}
        </button>
      )
    } else {
      primaryButton = <a href={window.VCV_CREATE_NEW_URL()} className='vcv-activation-button'>{window.VCV_CREATE_NEW_TEXT()}</a>
    }

    let descriptionContent = null
    if (this.props.authorApiKey) {
      descriptionContent = (
        <>
          <p className='vcv-activation-screen-description'>{InitialScreen.texts.bundledInThemeText}</p>
          <p className='vcv-activation-screen-description'>{InitialScreen.texts.chooseThemeOrDirectActivationText}</p>
        </>
      )
    } else {
      descriptionContent = <ShareButtons />
    }

    return (
      <div className='vcv-initial-screen vcv-activation-content' ref={this.activationContent}>
        <VCVLogo />
        <VersionBox />
        <p className='vcv-activation-heading'>
          {InitialScreen.texts.createYourWordpressWebsite}<br /> {InitialScreen.texts.anyLayoutFastAndEasy}
        </p>
        <SliderComponent />
        <div className='vcv-activation-button-container'>
          {primaryButton}
          {goPremiumButton}
        </div>
        {descriptionContent}
      </div>
    )
  }
}
