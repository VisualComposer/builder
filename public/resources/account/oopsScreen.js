import React from 'react'
import { ActivationSectionConsumer } from './activationSection'
import VCVLogo from './vcvLogo'

export default class OopsScreen extends React.Component {
  static localizations = window.VCV_I18N && window.VCV_I18N()
  static texts = {
    oops: OopsScreen.localizations ? OopsScreen.localizations.feOopsMessageDefault : 'It seems that something went wrong with loading content. Please make sure you are loading correct content and try again.'
  }
  constructor (props) {
    super(props)
    this.activationContent = React.createRef()
  }

  componentDidMount () {
    setTimeout(() => {
      this.activationContent.current.classList.add('vcv-activation-content--active')
    }, 0)
  }

  sendErrorReport () {

  }

  render () {
    return (
      <ActivationSectionConsumer>
        {({ error, errorAction }) => (
          <div className='vcv-activation-loading-screen vcv-activation-content' ref={this.activationContent}>
            <VCVLogo />
            <p className='vcv-activation-loading-text'>Oops!</p>
            <p className='vcv-activation-loading-helper-text'>
              {(error && error.message) || OopsScreen.localizations.feOopsMessageDefault}
            </p>
            <div className='vcv-activation-button-container'>
              {errorAction && (
                <button onClick={errorAction} className='vcv-activation-button'>
                  Try Again
                </button>
              )}
              <button onClick={this.sendErrorReport} className='vcv-activation-button vcv-activation-button--dark'>
                Send error report
              </button>
            </div>
          </div>
        )}
      </ActivationSectionConsumer>
    )
  }
}
