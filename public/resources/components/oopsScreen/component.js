import React from 'react'
import PropTypes from 'prop-types'
import VCVLogo from './vcvLogo'

const localizations = window.VCV_I18N && window.VCV_I18N()
const Errors = {
  default: {
    message: localizations.feOopsMessageDefault || 'It seems that something went wrong with loading content. Please make sure you are loading correct content and try again.',
    buttonText: localizations.feOopsButtonTextDefault || 'Return to WordPress dashboard',
    buttonLink: window.location.href.replace(/&vcv-action=frontend.*/i, '')
  },
  page_for_posts: {
    message: localizations.feOopsMessagePageForPosts || 'It seems you are trying to edit archive page which displays your post archive instead of content. Before edit, please make sure to convert it to a static page via your WordPress admin',
    buttonText: localizations.feOopsButtonTextPageForPosts || 'Return to WordPress dashboard',
    buttonLink: window.location.href.replace(/&vcv-action=frontend.*/i, '')
  }
}

export default class OopsScreen extends React.Component {
  static propTypes = {
    error: PropTypes.string,
    message: PropTypes.string,
    buttonText: PropTypes.string,
    buttonLink: PropTypes.string
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
