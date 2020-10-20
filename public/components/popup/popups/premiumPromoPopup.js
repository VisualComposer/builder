import React from 'react'
import PopupInner from '../popupInner'
import { getService } from 'vc-cake'

const dataProcessor = getService('dataProcessor')
const dataManager = getService('dataManager')

export default class PremiumPromoPopup extends React.Component {
  constructor (props) {
    super(props)

    this.handlePrimaryButtonClick = this.handlePrimaryButtonClick.bind(this)
    this.handleCloseClick = this.handleCloseClick.bind(this)
  }

  handlePrimaryButtonClick () {
    this.sendClosePopupRequest()
    this.props.onPrimaryButtonClick(true)
  }

  handleCloseClick () {
    this.sendClosePopupRequest()
    this.props.onClose(true)
  }

  sendClosePopupRequest () {
    dataProcessor.appAdminServerRequest({
      'vcv-action': 'premiumPromoPopup:submit:adminNonce',
      'vcv-premiumPromoPopup': false
    })
  }

  render () {
    const localizations = dataManager.get('localizations')
    const headingText = localizations ? localizations.getFullAccessToTheVisualComposerHub : 'Get full access to the Visual Composer Hub'
    const text = localizations ? localizations.downloadAllExclusiveText : 'Download all exclusive elements, templates, and extensions with Visual Composer Premium.'
    const buttonText = localizations ? localizations.goPremium : 'Go Premium'

    const customButtonProps = {
      target: '_blank',
      rel: 'noopener noreferrer',
      href: 'https://visualcomposer.com/premium/?utm_source=vcwb&utm_medium=editor&utm_campaign=gopremium&utm_content=popup-button'
    }

    return (
      <PopupInner
        {...this.props}
        headingText={headingText}
        popupName='premiumPromoPopup'
        customButtonProps={customButtonProps}
        onPrimaryButtonClick={this.handlePrimaryButtonClick}
        onClose={this.handleCloseClick}
        buttonText={buttonText}
      >
        <p className='vcv-layout-popup-text'>{text}</p>
      </PopupInner>
    )
  }
}
