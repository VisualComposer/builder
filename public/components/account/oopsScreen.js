import React from 'react'
import VCVLogo from './vcvLogo'
import PropTypes from 'prop-types'
import { getService } from 'vc-cake'

const dataManager = getService('dataManager')
const localizations = dataManager.get('localizations')
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

    if (!errorText && errorName && Object.prototype.hasOwnProperty.call(Errors, errorName)) {
      errorText = Errors[errorName].message
    }

    return errorText
  }

  getActionButtons () {
    const { errorName, errorAction, errorReportAction } = this.props
    if (Object.prototype.hasOwnProperty.call(Errors, errorName) && Errors[errorName].buttonText) {
      return (
        <button
          className='vcv-screen-button'
          onClick={() => { window.location = Errors[errorName].buttonLink }}
        >
          {Errors[errorName].buttonText}
        </button>
      )
    } else {
      const tryAgainButtonText = localizations ? localizations.feOopsTryAgainButtonText : 'Try Again'
      const reportAnIssueButtonText = localizations ? localizations.feOopsReportAnIssueButtonText : 'Report an Issue'
      return (
        <>
          {errorAction && (
            <button onClick={errorAction} className='vcv-screen-button'>
              {tryAgainButtonText}
            </button>
          )}
          {errorReportAction && (
            <a href={dataManager.get('supportUrl')} className='vcv-screen-button vcv-screen-button--dark'>
              {reportAnIssueButtonText}
            </a>
          )}
        </>
      )
    }
  }

  render () {
    const oopsText = localizations.somethingWentWrong || 'Oops ... Something Went Wrong'
    return (
      <div className='vcv-error-screen vcv-screen-content' ref={this.screenContent}>
        <VCVLogo />
        <p className='vcv-screen-text'>{oopsText}</p>
        <p className='vcv-screen-helper-text' dangerouslySetInnerHTML={{ __html: this.getErrorMessage() }} />
        <div className='vcv-screen-button-container'>
          {this.getActionButtons()}
        </div>
      </div>
    )
  }
}
