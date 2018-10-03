import React from 'react'
import Slider from './slider'
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
            <div className='vcv-activation-heading'>
              <h2>Create your wordpress website.</h2>
              <h2>Any layout. Fast and easy.</h2>
            </div>
            <Slider />
            <button onClick={() => { setActiveScreen('loadingScreen') }}>Go premium</button>
          </React.Fragment>
        )}
      </ActivationSectionConsumer>
    )
  }
}
