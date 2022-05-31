import React from 'react'
import PopupInner from '../popupInner'
import { getService } from 'vc-cake'
import { PopupProps, CustomButtonProps } from "../types";

const dataProcessor = getService('dataProcessor')
const dataManager = getService('dataManager')
const localizations = dataManager.get('localizations')
const headingText = localizations ? localizations.getFullAccessToTheVisualComposerHub : 'Get full access to the Visual Composer Hub'
const text = localizations ? localizations.downloadAllExclusiveText : 'Download all exclusive elements, templates, and extensions with Visual Composer Premium.'
const buttonText = localizations ? localizations.goPremium : 'Go Premium'

const PremiumPromoPopup = ({ onPrimaryButtonClick, onClose }: PopupProps) => {

  const sendClosePopupRequest = (): void => {
    dataProcessor.appAdminServerRequest({
      'vcv-action': 'premiumPromoPopup:submit:adminNonce',
      'vcv-premiumPromoPopup': false
    })
  }

  const handlePrimaryButtonClick = (): void => {
    sendClosePopupRequest()
    onPrimaryButtonClick()
  }

  const handleCloseClick = (): void => {
    sendClosePopupRequest()
    onClose()
  }

  const customButtonProps: CustomButtonProps<string> = {
    target: '_blank',
    rel: 'noopener noreferrer',
    href: dataManager.get('utm')['editor-gopremium-popup-button']
  }

  return (
    <PopupInner
      headingText={headingText}
      popupName='premiumPromoPopup'
      customButtonProps={customButtonProps}
      onPrimaryButtonClick={handlePrimaryButtonClick}
      onClose={handleCloseClick}
      buttonText={buttonText}
    >
      <p className='vcv-layout-popup-text'>{text}</p>
    </PopupInner>
  )
}

export default PremiumPromoPopup
