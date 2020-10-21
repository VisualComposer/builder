import React from 'react'
import classNames from 'classnames'

export default class HelperContainer extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      activeStep: false
    }
  }

  static localizations = window.VCV_I18N && window.VCV_I18N()

  render () {
    const { handleActiveChange, handleNextClick, handleCloseGuide, isActive, isLast } = this.props
    const done = HelperContainer.localizations ? HelperContainer.localizations.done : 'Done'
    const nextTip = HelperContainer.localizations ? HelperContainer.localizations.nextTip : 'Next Tip'
    const clickHereToSkip = HelperContainer.localizations ? HelperContainer.localizations.clickHereToSkip : 'Click here to skip'

    const helperClasses = classNames({
      'vcv-helper-wrapper': true,
      'vcv-helper-container-helper-bottom': this.props.helperPosition.bottom
    })

    const iconClasses = classNames({
      'vcv-ui-icon': true,
      'vcv-ui-icon-question': true,
      'vcv-ui-icon-selected': isActive
    })

    const containerStyleProps = {
      left: this.props.left,
      top: this.props.top
    }

    const helperStyleProps = {
      left: this.props.helperPosition.left,
      top: this.props.helperPosition.top
    }

    let buttonText = nextTip
    if (isLast) {
      buttonText = `${done}!`
    }
    let helperContent = null
    if (isActive) {
      helperContent = (
        <div className={helperClasses} style={helperStyleProps}>
          <h2 className='vcv-helper-container-heading'>{this.props.helperData.heading}</h2>
          <p className='vcv-helper-container-description' dangerouslySetInnerHTML={{ __html: this.props.helperData.description }} />
          <div className='vcv-helper-container-actions'>
            <div className='vcv-helper-container-actions-skip'>
              <span className='vcv-helper-container-done'>{done}?</span>
              <span
                className='vcv-helper-container-skip'
                onClick={handleCloseGuide}
              >
                {clickHereToSkip}
              </span>
            </div>
            <button
              className='vcv-helper-container-next'
              onClick={isLast ? handleCloseGuide : handleNextClick}
            >
              {buttonText}
            </button>
          </div>
        </div>
      )
    }

    let helperImage = null
    if (this.props.helperData.helperImage) {
      helperImage = (
        <div className={this.props.helperData.helperImage} />
      )
    }

    return (
      <div className='vcv-helper-container' style={containerStyleProps}>
        <i
          className={iconClasses}
          onClick={handleActiveChange.bind(this, this.props.helperData.step)}
        />
        {helperContent}
        {helperImage}
      </div>
    )
  }
}
