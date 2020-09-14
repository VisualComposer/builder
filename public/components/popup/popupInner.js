import React from 'react'
import PropTypes from 'prop-types'

export default class PopupInner extends React.Component {
  static propTypes = {
    headingText: PropTypes.string.isRequired,
    buttonText: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
    onPrimaryButtonClick: PropTypes.func.isRequired,
    popupName: PropTypes.string.isRequired,
    customButtonProps: PropTypes.object
  }

  constructor (props) {
    super(props)

    this.handleCloseClick = this.handleCloseClick.bind(this)
  }

  handleCloseClick () {
    this.props.onClose()
  }

  render () {
    const { children, headingText, buttonText, onPrimaryButtonClick, customButtonProps } = this.props
    const localizations = window.VCV_I18N && window.VCV_I18N()
    const closeButtonText = localizations ? localizations.close : 'Close'

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
        <a className='vcv-layout-popup-btn' onClick={onPrimaryButtonClick} {...customButtonProps}>
          {buttonText}
        </a>
      </div>
    )
  }
}
