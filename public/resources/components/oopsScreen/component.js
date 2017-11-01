import React from 'react'
import VCVLogo from './vcvLogo'

const Errors = {
  default: {
    message: 'It seems that something went wrong with loading content. Please make sure you are loading correct content and try again.',
    buttonText: 'Back to WordPress Dashboard',
    buttonLink: window.location.href.replace(window.location.search, '').match(/.*admin\//)[0]
  },
  page_for_posts: {
    message: 'It seems you are trying to edit archive page which displays your post archive instead of content. Before edit, please make sure to convert it into a static page via your WordPress admin.',
    buttonText: 'Back to WordPress',
    buttonLink: window.location.href.replace(/&vcv-action=frontend.*/i, '')
  }
}

export default class OopsScreen extends React.Component {
  static propTypes = {
    error: React.PropTypes.string,
    message: React.PropTypes.string,
    buttonText: React.PropTypes.string,
    buttonLink: React.PropTypes.string
  }

  constructor (props) {
    super(props)
    let data = Errors.default
    if (props.error !== 'default' && Errors.hasOwnProperty(props.error)) {
      data = Errors[props.error]
    }
    this.state = {
      ...data
    }
    this.clickButton = this.clickButton.bind(this)
  }

  clickButton () {
    if (this.state.buttonLink) {
      window.location = this.state.buttonLink
    }
  }

  getButtonContent () {
    if (this.state.buttonText) {
      return (
        <div className='vcv-button-container'>
          <button data-vcv-back
            className='vcv-popup-button vcv-popup-form-submit vcv-popup-form-update'
            onClick={this.clickButton}>
            {this.state.buttonText}
          </button>
        </div>
      )
    }
  }

  render () {
    return (
      <div className='vcv-loading-overlay'>
        <div data-vcv-error-description
          className='vcv-popup-content vcv-popup-error-description vcv-popup-error--active'>
          <VCVLogo />
          <div className='vcv-popup-heading'>
            Oops
          </div>
          <span className='vcv-popup-loading-heading'>
            {this.state.message}
          </span>
          {this.getButtonContent()}
        </div>
      </div>
    )
  }
}
