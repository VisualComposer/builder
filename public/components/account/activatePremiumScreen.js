import React from 'react'
import VCVLogo from './vcvLogo'
import VersionBox from './versionBox'
import { getService } from 'vc-cake'
import { getResponse } from 'public/tools/response'

const dataProcessor = getService('dataProcessor')

export default class FeatureScreen extends React.Component {
  static localizations = window.VCV_I18N && window.VCV_I18N()

  constructor (props) {
    super(props)
    this.activationContent = React.createRef()

    this.state = {
      licenseValue: '',
      hasError: false,
      errorText: ''
    }

    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleInputFocus = this.handleInputFocus.bind(this)
    this.setError = this.setError.bind(this)
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
    this.setState({
      licenseValue: '',
      hasError: false,
      errorText: ''
    })
    if (this.state.licenseValue) {
      this.setState({
        loading: type
      })
      dataProcessor.appAdminServerRequest({
        'vcv-action': 'activateLicense:adminNonce',
        'vcv-license-key': this.state.licenseValue,
        'vcv-activation-type': type ? type : 'premium'
      }).then((responseData) => {
        let response = getResponse(responseData)
        if (response && response.status) {
          const updateUrl = window.VCV_UPDATE_URL && window.VCV_UPDATE_URL()
          if (updateUrl) {
            window.location.href = updateUrl
          } else {
            window.location.reload()
          }
        } else {
          this.setError(response && response.message ? response.message : '')
          console.warn(response)
        }
      }, (error) => {
        this.setError()
        console.warn(error)
      })
    } else {
      this.setState({
        hasError: true
      })
    }
  }

  setError (errorText) {
    if (errorText) {
      this.setState({ errorText })
    }
    this.setState({
      hasError: true,
      loading: false
    })
  }

  handleInputFocus () {
    this.setState({ hasError: false })
  }

  render () {
    const { hasError, errorText, loading } = this.state
    let stagingButton = null
    if (window.VCV_STAGING_AVAILABLE && window.VCV_STAGING_AVAILABLE()) {
      let buttonClasses = 'vcv-activation-button vcv-activation-button--dark'
      if (loading === 'staging') {
        buttonClasses += ' vcv-activation-button--loading'
      }
      stagingButton = <div className='vcv-activation-button-container'>
        <button className={buttonClasses} onClick={this.handleActivateClick.bind(this, 'staging')}>
          Activate staging
        </button>
      </div>
    }

    let inputClasses = 'vcv-basic-input'
    if (hasError) {
      inputClasses += ' vcv-ui-form-input--error'
    }

    let errorBox = null
    if (errorText) {
      errorBox = <div className='vcv-activation-box-error-box'>
        {errorText}
      </div>
    }

    let premiumButtonClasses = 'vcv-activation-button'
    if (loading === 'premium') {
      premiumButtonClasses += ' vcv-activation-button--loading'
    }

    let activationBoxClasses = 'vcv-activation-box-container vcv-activation-box-container-premium'
    if (loading) {
      activationBoxClasses += ' vcv-activation--loading'
    }

    return (
      <div className='vcv-activation-content' ref={this.activationContent}>
        <VCVLogo />
        <VersionBox />
        <p className='vcv-activation-heading'>
          Get Premium Elements, Templates,<br />
          Extensions, and Support
        </p>
        <div className={activationBoxClasses}>
          <div className='vcv-activation-box'>
            <h3 className='vcv-activation-box-heading'>What You Will Get?</h3>
            <ul className='vcv-basic-list'>
              <li className='vcv-basic-list-item'>Limited access to the Visual Composer Hub of elements, templates, and extensions</li>
              <li className='vcv-basic-list-item'>Theme builder with Header, Footer, and Sidebar editor</li>
              <li className='vcv-basic-list-item'>WooCommerce compatibility</li>
              <li className='vcv-basic-list-item'>Premium support and updates</li>
            </ul>
            <div className='vcv-activation-button-container'>
              <a href={window.VCV_PREMIUM_URL()} className='vcv-activation-button vcv-activation-button--dark'>I want to go premium</a>
            </div>
          </div>
          <div className='vcv-activation-box'>
            {errorBox}
            <div className='vcv-basic-input-container--password'>
              <input placeholder='Enter your license key' className={inputClasses} required='' name='licenseKey' type='text' value={this.state.licenseValue} onChange={this.handleInputChange} maxLength='36' onFocus={this.handleInputFocus} />
            </div>
            <div className='vcv-activation-input-description'>
              You can find your Visual Composer Premium subscription license key by accessing our Customer Portal at <a href="https://account.visualcomposer.com" className='vcv-activation-link'>account.visualcomposer.com</a>
            </div>
            <div className='vcv-activation-button-container'>
              <button className={premiumButtonClasses} onClick={this.handleActivateClick.bind(this, 'premium')}>
                Activate premium
              </button>
            </div>
            {stagingButton}
          </div>
        </div>
      </div>
    )
  }
}
