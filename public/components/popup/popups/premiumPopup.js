import React from 'react'
import PopupInner from '../popupInner'

export default class PremiumPopup extends React.Component {
  constructor (props) {
    super(props)

    this.handleCloseClick = this.handleCloseClick.bind(this)
  }

  handleCloseClick () {
    this.props.onClose()
  }

  getPopupBadge () {
    return (
      <div className='vcv-layout-popup-badge' />
    )
  }

  render () {
    const headingText = this.props.popupData ? this.props.popupData.headingText : 'PREMIUM POPUP BUILDER. DO MORE.'
    const buttonText = this.props.popupData ? this.props.popupData.buttonText : 'GO PREMIUM'
    const popupText = this.props.popupData ? this.props.popupData.popupDesc : 'Create engaging popups to boost your conversion rate with Visual Composer Premium Popup Builder.'

    return (
      <PopupInner
        {...this.props}
        headingText={headingText}
        popupName='premiumPopup'
        buttonText={buttonText}
        popupBadgeHtml={this.getPopupBadge()}
        onClose={this.handleCloseClick}
      >
        <p className='vcv-layout-popup-text'>{popupText}</p>
      </PopupInner>
    )
  }
}
