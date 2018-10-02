import React from 'react'
import ReactDOM from 'react-dom'
import VCVLogo from './vcvLogo'

export default class ActivationSection extends React.Component {
  render () {
    return (
      <div className='vcv-activation-section'>
        <VCVLogo />
        <div className='vcv-activation-plugin-version-box'>
          version 10.0
        </div>
        <div className='vcv-activation-heading'>
          <h2>Create your wordpress website.</h2>
          <h2>Any layout. Fast and easy.</h2>
        </div>
        <div>Slider</div>
      </div>
    )
  }
}

ReactDOM.render(
  <ActivationSection />,
  document.querySelector('.vcv-settings')
)
