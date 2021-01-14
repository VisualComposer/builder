import React from 'react'
import PropTypes from 'prop-types'
import { getService } from 'vc-cake'
const dataManager = getService('dataManager')

export default class PopupInner extends React.Component {
  static propTypes = {
    headingText: PropTypes.string.isRequired,
    buttonText: PropTypes.string,
    onClose: PropTypes.func.isRequired,
    onPrimaryButtonClick: PropTypes.func.isRequired,
    popupName: PropTypes.string.isRequired,
    customButtonProps: PropTypes.object,
    customButtonTag: PropTypes.string
  }

  constructor (props) {
    super(props)

    this.handleCloseClick = this.handleCloseClick.bind(this)
    this.getPopupBadgeHtml = this.getPopupBadgeHtml.bind(this)
  }

  handleCloseClick () {
    this.props.onClose()
  }

  render () {
    const { children, headingText, buttonText, onPrimaryButtonClick, customButtonProps, customButtonTag } = this.props
    const localizations = dataManager.get('localizations')
    const closeButtonText = localizations ? localizations.close : 'Close'
    const popupButtonText = buttonText || (localizations ? localizations.submit : 'Submit')
    const ButtonTag = customButtonTag || 'a'

    return (
      <div className='vcv-layout-popup-inner'>
        <header className='vcv-layout-popup-header'>
          <h2 className='vcv-layout-popup-heading'>{headingText}</h2>
          <button
            className='vcv-layout-popup-close vcv-ui-icon vcv-ui-icon-close-thin'
            aria-label={closeButtonText}
            onClick={this.handleCloseClick}
          />
        </header>
        <div className='vcv-layout-popup-content'>
          {children}
        </div>
        <ButtonTag className='vcv-layout-popup-btn' onClick={onPrimaryButtonClick} {...customButtonProps}>
          {popupButtonText}
        </ButtonTag>
      </div>
    )
  }
}
