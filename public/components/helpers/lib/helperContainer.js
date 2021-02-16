import React from 'react'
import classNames from 'classnames'
import vcCake from 'vc-cake'

const dataManager = vcCake.getService('dataManager')

export default class HelperContainer extends React.Component {
  static localizations = dataManager.get('localizations')

  constructor (props) {
    super(props)

    this.state = {
      activeStep: false
    }
  }

  render () {
    const { handleActiveChange, handleNextClick, handleCloseGuide, isActive, isLast } = this.props
    const done = HelperContainer.localizations ? HelperContainer.localizations.done : 'Done'
    const nextTip = HelperContainer.localizations ? HelperContainer.localizations.nextTip : 'Next Tip'
    const clickHereToSkip = HelperContainer.localizations ? HelperContainer.localizations.clickHereToSkip : 'Click here to skip'

    const helperClasses = classNames({
      'vcv-helper-box': true,
      'vcv-helper-box-position--bottom': this.props.helperPosition.bottom
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

    let buttonText = nextTip
    if (isLast) {
      buttonText = `${done}!`
    }
    let helperContent = null
    if (isActive) {
      helperContent = (
        <div className={helperClasses}>
          <h2 className='vcv-helper-box-heading'>{this.props.helperData.heading}</h2>
          <p className='vcv-helper-box-description' dangerouslySetInnerHTML={{ __html: this.props.helperData.description }} />
          <div className='vcv-helper-box-actions'>
            <div className='vcv-helper-box-actions-skip'>
              <span className='vcv-helper-box-done'>{done}?</span>
              <span
                className='vcv-helper-box-skip'
                onClick={handleCloseGuide}
              >
                {clickHereToSkip}
              </span>
            </div>
            <button
              className='vcv-helper-box-next'
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

    const helperIcons = []
    if (this.props.helperData.icons) {
      this.props.helperData.icons.forEach((icon) => {
        const helperIconClasses = classNames({
          'vcv-ui-navbar-control-icon': true,
          'vcv-ui-icon': true,
          [`vcv-ui-icon-${icon.icon}`]: true
        })
        const helperIconStyles = {
          left: icon.left,
          top: icon.top
        }
        helperIcons.push(<i className={helperIconClasses} style={helperIconStyles} key={icon.icon} />)
      })
    }

    return (
      <div className='vcv-helper' style={containerStyleProps}>
        <i
          className={iconClasses}
          onClick={handleActiveChange.bind(this, this.props.helperData.step)}
        />
        {helperIcons}
        {helperContent}
        {helperImage}
      </div>
    )
  }
}
