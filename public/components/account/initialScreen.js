import React from 'react'
import SliderComponent from './slider'
import VCVLogo from './vcvLogo'
import VersionBox from './versionBox'

export default class InitialScreen extends React.Component {
  static localizations = window.VCV_I18N && window.VCV_I18N()
  static texts = {
    createYourWordpressWebsite: InitialScreen.localizations ? InitialScreen.localizations.createYourWordpressWebsite : 'Create Your WordPress Website.',
    anyLayoutFastAndEasy: InitialScreen.localizations ? InitialScreen.localizations.anyLayoutFastAndEasy : 'Any Layout. Fast and Easy.',
    unlockHub: InitialScreen.localizations ? InitialScreen.localizations.unlockHub : 'Unlock Visual Composer Hub'
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
          <a href={window.VCV_PREMIUM_URL()} className='vcv-activation-button vcv-activation-button--dark'>{InitialScreen.texts.unlockHub}</a>
        </div>
      </div>
    )
  }
}
