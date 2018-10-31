import React from 'react'
import { ActivationSectionConsumer } from './activationSection'
import VCVLogo from './vcvLogo'

export default class OopsScreen extends React.Component {
  static localizations = window.VCV_I18N && window.VCV_I18N()
  static texts = {
    failedDefault: OopsScreen.localizations ? OopsScreen.localizations.activationFailed : 'Your activation request failed. Please try again.'
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
      <ActivationSectionConsumer>
        {({ error }) => (
          <div className='vcv-activation-loading-screen vcv-activation-content' ref={this.activationContent}>
            <VCVLogo />
            <p className='vcv-activation-loading-text'>Oops!</p>
            <p className='vcv-activation-loading-helper-text'>
              {(error && error.message) || OopsScreen.texts.failedDefault}
            </p>
            <div className='vcv-activation-button-container'>
              {error && error.errorAction && (
                <button onClick={error.errorAction} className='vcv-activation-button'>
                  Try Again
                </button>
              )}
              {error && error.errorReportAction && (
                <button onClick={error.errorReportAction} className='vcv-activation-button vcv-activation-button--dark'>
                  Send error report
                </button>
              )}
            </div>
          </div>
        )}
      </ActivationSectionConsumer>
    )
  }
}
