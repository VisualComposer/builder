import React from 'react'
import VCVLogo from './vcvLogo'
import VersionBox from './versionBox'

export default class FeatureScreen extends React.Component {
  static localizations = window.VCV_I18N && window.VCV_I18N()


  constructor (props) {
    super(props)
    this.activationContent = React.createRef()
  }

  componentDidMount () {
    setTimeout(() => {
      this.activationContent.current && this.activationContent.current.classList.add('vcv-activation-content--active')
    }, 200)
  }

  render () {
    const activateFreeLink = window.VCV_PREMIUM_URL()

    return (
      <div className='vcv-activation-content' ref={this.activationContent}>
        <VCVLogo />
        <VersionBox />
        <p className='vcv-activation-heading'>
          Get Access to the Visual Composer Hub
        </p>
        <div className='vcv-activation-box-container'>
          <div className='vcv-activation-box'>
            <h3 className='vcv-activation-box-heading'>Free License</h3>
            <ul className='vcv-basic-list'>
              <li className='vcv-basic-list-item'>Limited access to the Visual Composer Hub of elements, templates, and extensions</li>
              <li className='vcv-basic-list-item vcv-basic-list-item--not-included'>Theme builder with Header, Footer, and Sidebar editor</li>
              <li className='vcv-basic-list-item vcv-basic-list-item--not-included'>WooCommerce compatibility</li>
              <li className='vcv-basic-list-item vcv-basic-list-item--not-included'>Premium support and updates</li>
            </ul>
            <div className='vcv-activation-button-container'>
              <a href={activateFreeLink} className='vcv-activation-button vcv-activation-button--dark'>Activate free</a>
            </div>
          </div>
          <div className='vcv-activation-box'>
            <h3 className='vcv-activation-box-heading'>Premium License</h3>
            <ul className='vcv-basic-list'>
              <li className='vcv-basic-list-item'>Unlimited access to the Visual Composer Hub of elements, templates, and extensions</li>
              <li className='vcv-basic-list-item'>Theme builder with Header, Footer, and Sidebar editor</li>
              <li className='vcv-basic-list-item'>WooCommerce compatibility</li>
              <li className='vcv-basic-list-item'>Premium support and updates</li>
            </ul>
            <div className='vcv-activation-button-container'>
              <button type='button' onClick={this.props.setActiveScreen.bind(this, 'vcv-go-premium')} className='vcv-activation-button'>Activate Premium</button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
