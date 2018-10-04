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
              <button className='vcv-activation-button' onClick={() => { setActiveScreen('loadingScreen') }}>Create new page</button>
              <button className='vcv-activation-button vcv-activation-button--dark' onClick={() => { setActiveScreen('loadingScreen') }}>Go premium</button>
            </div>
          </React.Fragment>
        )}
      </ActivationSectionConsumer>
    )
  }
}
