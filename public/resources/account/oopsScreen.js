import React from 'react'
import VCVLogo from './vcvLogo'
import PropTypes from 'prop-types'

const localizations = window.VCV_I18N && window.VCV_I18N()
const Errors = {
  default: {
    message: localizations.feOopsMessageDefault,
    buttonText: localizations.feOopsButtonTextDefault,
    buttonLink: window.location.href.replace(/&vcv-action=frontend.*/i, '')
  },
  page_for_posts: {
    message: localizations.feOopsMessagePageForPosts,
    buttonText: localizations.feOopsButtonTextPageForPosts,
    buttonLink: window.location.href.replace(/&vcv-action=frontend.*/i, '')
  },
  activation: {
    message: localizations.updateFailed
  }
}

export default class OopsScreen extends React.Component {
  static propTypes = {
    errorMessage: PropTypes.string,
    errorName: PropTypes.string
  }

  constructor (props) {
    super(props)
    this.screenContent = React.createRef()
  }

  componentDidMount () {
    setTimeout(() => {
      this.screenContent.current && this.screenContent.current.classList.add('vcv-screen-content--active')
    }, 0)
  }

  getErrorMessage () {
    const { errorName, errorMessage } = this.props
    let errorText = errorMessage

    if (!errorText && errorName && Errors.hasOwnProperty(errorName)) {
      errorText = Errors[ errorName ].message
    }

    return errorText
  }

  getActionButtons () {
    const { errorName, errorAction, errorReportAction } = this.props
    if (Errors.hasOwnProperty(errorName) && Errors[ errorName ].buttonText) {
      return (
        <button
          className='vcv-screen-button'
          onClick={() => { window.location = Errors[ errorName ].buttonLink }}>
          {Errors[ errorName ].buttonText}
        </button>
      )
    } else {
      return <React.Fragment>
        {errorAction && (
          <button onClick={errorAction} className='vcv-screen-button'>
            Try Again
          </button>
        )}
        {errorReportAction && (
          <button onClick={errorReportAction} className='vcv-screen-button vcv-screen-button--dark'>
            Send error report
          </button>
        )}
      </React.Fragment>
    }
  }

  render () {
    return (
      <div className='vcv-error-screen vcv-screen-content' ref={this.screenContent}>
        <VCVLogo />
        <p className='vcv-screen-text'>Oops</p>
        <p className='vcv-screen-helper-text' dangerouslySetInnerHTML={{ __html: this.getErrorMessage() }} />
        <div className='vcv-screen-button-container'>
          {this.getActionButtons()}
        </div>
      </div>
    )
  }
}
