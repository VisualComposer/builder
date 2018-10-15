import React from 'react'
import SliderComponent from './slider'
import VCVLogo from './vcvLogo'
import VersionBox from './versionBox'
import { ActivationSectionConsumer } from './activationSection'

export default class InitialScreen extends React.Component {
  render () {
    return (
      <ActivationSectionConsumer>
        {({ setActiveScreen }) => (
          <React.Fragment>
            <VCVLogo />
            <VersionBox />
            <h2 className='vcv-activation-heading'>
              Create Your WordPress Website.<br /> Any Layout. Fast and Easy.
            </h2>
            <SliderComponent />
            <div className='vcv-activation-button-container'>
              <a href={window.VCV_CREATE_NEW_URL()} className='vcv-activation-button'>{window.VCV_CREATE_NEW_TEXT()}</a>
              <a href={window.VCV_ACTIVATION_PREMIUM_URL()} className='vcv-activation-button vcv-activation-button--dark'>Go premium</a>
            </div>
          </React.Fragment>
        )}
      </ActivationSectionConsumer>
    )
  }
}
