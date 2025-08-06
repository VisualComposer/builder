import React, { useState, useEffect, useCallback } from 'react'
import { Dispatch } from 'redux' // eslint-disable-line
import classNames from 'classnames'
import { getStorage } from 'vc-cake'
import PremiumPromoPopup from './popups/premiumPromoPopup'
import PricingPopup from './popups/pricingPopup'
import { connect } from 'react-redux'
import { allPopupsHidden, popupVisibilitySet } from '../../editor/stores/editorPopup/slice'
import { AppStateType } from '../../editor/stores/reducer'
import { PopupContainerProps } from './types'

const elementsStorage = getStorage('elements')

const PopupContainer = ({ activePopup, allPopupsHidden, isPopupVisible, popupVisibilitySet }: PopupContainerProps) => {
  const [actionClicked, setActionClicked] = useState(false)

  const handleDocumentChange = useCallback((data:[]) => {
    if (data && data.length) {
      window.setTimeout(() => {
        popupVisibilitySet(!!activePopup)
        elementsStorage.state('document').ignoreChange(handleDocumentChange)
      }, activePopup === 'pricingPopup' ? 20000 : 500)
    }
  }, [popupVisibilitySet, activePopup])

  useEffect(() => {
    elementsStorage.state('document').onChange(handleDocumentChange)
    return () => {
      elementsStorage.state('document').ignoreChange(handleDocumentChange)
    }
  }, [handleDocumentChange])

  const handleCloseClick = () => {
    popupVisibilitySet(false)
    window.setTimeout(() => {
      allPopupsHidden()
    }, 500)
  }

  const handlePrimaryButtonClick = () => {
    setActionClicked(true)
    window.setTimeout(() => {
      setActionClicked(false)
      popupVisibilitySet(false)
      allPopupsHidden()
    }, 500)
  }

  const popupClasses = classNames({
    'vcv-layout-popup': true,
    'vcv-layout-popup--visible': isPopupVisible,
    'vcv-layout-popup--action-clicked': actionClicked,
    'vcv-layout-popup--pricing-popup': activePopup === 'pricingPopup'
  })

  const popupProps = {
    onClose: handleCloseClick,
    onPrimaryButtonClick: handlePrimaryButtonClick
  }

  let activePopupHtml = null

  if (activePopup === 'premiumPromoPopup') {
    activePopupHtml = <PremiumPromoPopup {...popupProps} />
  } else if (activePopup === 'pricingPopup') {
    activePopupHtml = <PricingPopup {...popupProps} />
  }

  return (
    <div className={popupClasses}>
      <div className='vcv-layout-popup-container'>
        {activePopupHtml}
      </div>
    </div>
  )
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  allPopupsHidden: () => dispatch(allPopupsHidden()),
  popupVisibilitySet: (data:boolean) => dispatch(popupVisibilitySet(data))
})

const mapStateToProps = (state: AppStateType) => ({
  activePopup: state.editorPopup.activePopup,
  isPopupVisible: state.editorPopup.isPopupVisible
})

export default connect(mapStateToProps, mapDispatchToProps)(PopupContainer)
