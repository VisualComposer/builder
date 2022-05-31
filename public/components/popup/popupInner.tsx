import React from 'react'
import { getService } from 'vc-cake'
import { PopupInnerProps } from './types'

const dataManager = getService('dataManager')

const PopupInner = ({ children, headingText, buttonText, onPrimaryButtonClick, customButtonProps, customButtonTag, badge, onClose }: PopupInnerProps) => {

  const localizations = dataManager.get('localizations')
  const closeButtonText = localizations ? localizations.close : 'Close'
  const popupButtonText = buttonText || (localizations ? localizations.submit : 'Submit')
  const ButtonTag = customButtonTag || 'a'

  let badgeHtml = null

  if (badge) {
    badgeHtml = (
      <div className='vcv-layout-popup-header-badge'>
        {badge}
      </div>
    )
  }

  return (
    <div className='vcv-layout-popup-inner'>
      <header className='vcv-layout-popup-header'>
        {badgeHtml}
        <h2 className='vcv-layout-popup-heading'>{headingText}</h2>
        <button
          className='vcv-layout-popup-close vcv-ui-icon vcv-ui-icon-close-thin'
          aria-label={closeButtonText}
          onClick={onClose}
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

export default PopupInner
