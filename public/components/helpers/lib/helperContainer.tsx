import React from 'react'
import classNames from 'classnames'
import vcCake from 'vc-cake'

const dataManager = vcCake.getService('dataManager')
const localizations = dataManager.get('localizations')

interface Props {
  handleActiveChange: (step: number) => void,
  handleNextClick: () => void,
  handleCloseGuide: () => void,
  isActive: boolean,
  isLast: boolean
  helperData: {
    top: number,
    left: number,
    helperPosition: {
      bottom: number
    },
    helperId: string,
    position: {
      horizontal: string
    },
    heading: string,
    description: string,
    helperImage: string,
    step: number,
    icons: [{
      icon: string,
      left: number,
      top: number
    }]
  }
}

const HelperContainer: React.FC<Props> = ({ handleActiveChange, handleNextClick, handleCloseGuide, isActive, isLast, helperData }) => {
  const done = localizations.done || 'Done'
  const nextTip = localizations.nextTip || 'Next Tip'
  const clickHereToSkip = localizations.clickHereToSkip || 'Click here to skip'

  const helperClasses = classNames({
    'vcv-helper-box': true,
    'vcv-helper-box-position--bottom': helperData.helperPosition.bottom,
    'vcv-helper-box-position--horizontal-top': helperData.position && helperData.position.horizontal === 'top',
    'vcv-helper-box-position--horizontal-bottom': helperData.position && helperData.position.horizontal === 'bottom'
  })

  const iconClasses = classNames({
    'vcv-ui-icon': true,
    'vcv-ui-icon-question': true,
    'vcv-ui-icon-selected': isActive
  })

  const containerStyleProps = {
    left: helperData.left,
    top: helperData.top
  }

  let buttonText = nextTip
  if (isLast) {
    buttonText = `${done}!`
  }
  let helperContent = null
  if (isActive) {
    helperContent = (
      <div className={helperClasses}>
        <h2 className='vcv-helper-box-heading'>{helperData.heading}</h2>
        <p className='vcv-helper-box-description' dangerouslySetInnerHTML={{ __html: helperData.description }} />
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
  if (helperData.helperImage) {
    helperImage = (
      <div className={helperData.helperImage} />
    )
  }

  const helperIcons:React.ReactElement[] = []
  if (helperData.icons) {
    helperData.icons.forEach((icon) => {
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
        onClick={handleActiveChange.bind(this, helperData.step)}
      />
      {helperIcons}
      {helperContent}
      {helperImage}
    </div>
  )
}

export default HelperContainer
