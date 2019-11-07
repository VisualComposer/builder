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
    goPremium: InitialScreen.localizations ? InitialScreen.localizations.goPremium : 'Go Premium'
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
    const buttonText = window.VCV_IS_ACTIVATED() ? InitialScreen.texts.goPremium : InitialScreen.texts.unlockHub
    let goPremiumButton = ''

    if (window.VCV_MANAGE_OPTIONS()) {
      if (window.VCV_IS_ACTIVATED()) {
        goPremiumButton = (
          <button onClick={this.props.setActiveScreen.bind(this, 'vcv-go-premium')} className='vcv-activation-button vcv-activation-button--dark'>{buttonText}</button>
        )
      } else {
        goPremiumButton = (
          <button onClick={this.props.setActiveScreen.bind(this, 'vcv-license-options')} className='vcv-activation-button vcv-activation-button--dark'>{buttonText}</button>
        )
      }
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
          <a href={window.VCV_CREATE_NEW_URL()} className='vcv-activation-button'>{window.VCV_CREATE_NEW_TEXT()}</a>
          {goPremiumButton}
        </div>
        <ShareButtons />
      </div>
    )
  }
}
