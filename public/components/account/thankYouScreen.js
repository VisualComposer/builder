import React from 'react'
import VCVLogo from './vcvLogo'
import { getService } from 'vc-cake'

const dataManager = getService('dataManager')

export default class ThankYouScreen extends React.Component {
  static localizations = dataManager.get('localizations')
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
