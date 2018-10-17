import React from 'react'
import SliderComponent from './slider'
import VCVLogo from './vcvLogo'
import VersionBox from './versionBox'

export default class InitialScreen extends React.Component {
  render () {
    return (
      <React.Fragment>
        <VCVLogo />
        <VersionBox />
        <p className='vcv-activation-heading'>
          Create Your WordPress Website.<br /> Any Layout. Fast and Easy.
        </p>
        <SliderComponent />
        <div className='vcv-activation-button-container'>
          <a href={window.VCV_CREATE_NEW_URL()} className='vcv-activation-button'>{window.VCV_CREATE_NEW_TEXT()}</a>
          <a href={window.VCV_ACTIVATION_PREMIUM_URL()} className='vcv-activation-button vcv-activation-button--dark'>Go premium</a>
        </div>
      </React.Fragment>
    )
  }
}
