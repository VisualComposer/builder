import React from 'react'

import VCVLogo from './vcvLogo'

export default class ThankYouScreen extends React.Component {
  static localizations = window.VCV_I18N && window.VCV_I18N()
  static texts = {
    thankYouText: ThankYouScreen.localizations ? ThankYouScreen.localizations.thankYouText : 'Thank You!'
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
      <div className='vcv-activation-loading-screen vcv-activation-content' ref={this.activationContent}>
        <VCVLogo />
        <p className='vcv-activation-loading-text'>{ThankYouScreen.texts.thankYouText}</p>
        <p className='vcv-activation-loading-helper-text'>We have successfully received Your error report.</p>
      </div>
    )
  }
}
