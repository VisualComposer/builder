import React from 'react'
import VCVLogo from './vcvLogo'
import VersionBox from './versionBox'

export default class FeatureScreen extends React.Component {
  static localizations = window.VCV_I18N && window.VCV_I18N()

  constructor (props) {
    super(props)
    this.activationContent = React.createRef()

    this.state = {
      licenseValue: ''
    }

    this.handleInputChange = this.handleInputChange.bind(this)
  }

  componentDidMount () {
    setTimeout(() => {
      this.activationContent.current && this.activationContent.current.classList.add('vcv-activation-content--active')
    }, 200)
  }

  handleInputChange (e) {
    const val = e.currentTarget && e.currentTarget.value

    this.setState({
      licenseValue: val
    })
  }

  handleActivateClick (type, e) {
    e.preventDefault()

    console.log(type)
    console.log(this.state.licenseValue)

  }

  render () {
    return (
      <div className='vcv-activation-content' ref={this.activationContent}>
        <VCVLogo />
        <VersionBox />
        <p className='vcv-activation-heading'>
          Get Premium Elements, Templates,<br />
          Extensions, and Support
        </p>

        <div className='vcv-activation-box-container vcv-activation-box-container-premium'>
          <div className='vcv-activation-box'>
            <h3 className='vcv-activation-box-heading'>What You Will Get?</h3>
            <ul className='vcv-basic-list'>
              <li className='vcv-basic-list-item'>Limited access to the Visual Composer Hub of elements, templates, and extensions</li>
              <li className='vcv-basic-list-item'>Theme builder with Header, Footer, and Sidebar editor</li>
              <li className='vcv-basic-list-item'>WooCommerce compatibility</li>
              <li className='vcv-basic-list-item'>Premium support and updates</li>
            </ul>
            <div className='vcv-activation-button-container'>
              <a href='#' className='vcv-activation-button vcv-activation-button--dark'>I want to go premium</a>
            </div>
          </div>
          <div className='vcv-activation-box'>
            <div className='vcv-basic-input-container--password'>
              <input placeholder='Enter your license key' className='vcv-basic-input' required='' name='licenseKey' type='text' value={this.state.licenseValue} onChange={this.handleInputChange} maxLength='36' />
            </div>
            <div className='vcv-activation-input-description'>
              You can find your Visual Composer Premium subscription license key by accessing our Customer Portal at <a href="#" className='vcv-activation-link'>my.visualcomposer.com</a>
            </div>
            <div className='vcv-activation-button-container'>
              <button className='vcv-activation-button' type='submit' onClick={this.handleActivateClick.bind(this, 'premium')}>
                Activate premium
              </button>
            </div>
            <div className='vcv-activation-button-container'>
              <button className='vcv-activation-button vcv-activation-button--dark' type='submit' onClick={this.handleActivateClick.bind(this, 'staging')}>
                Activate staging
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
