import React from 'react'
import classNames from 'classnames'
import { getService } from 'vc-cake'
import PremiumTeaser from 'public/components/premiumTeasers/component'
import { connect } from 'react-redux'
import { activeFullPopupSet } from 'public/editor/stores/editorPopup/slice'

const dataManager = getService('dataManager')

const FullPagePopupContainer = ({ activeFullPopupSet, fullScreenPopupData, activeFullPopup }) => {
  const handleCloseClick = () => {
    window.setTimeout(() => {
      activeFullPopupSet(false)
    }, 350)
  }

  const handlePrimaryButtonClick = () => {
    const popupData = fullScreenPopupData || {}
    popupData.primaryButtonClick && popupData.primaryButtonClick()
  }

  const handleOutsideClick = (event) => {
    if (event.target.classList.contains('vcv-layout-popup--full-page')) {
      handleCloseClick()
    }
  }

  const popupClasses = classNames({
    'vcv-layout-popup': true,
    'vcv-layout-popup--full-page': true,
    'vcv-layout-popup--visible': !!activeFullPopup
  })
  const popupData = fullScreenPopupData || {}

  const popupProps = {
    onClose: handleCloseClick,
    onPrimaryButtonClick: handlePrimaryButtonClick,
    isPremiumActivated: dataManager.get('isPremiumActivated'),
    ...popupData
  }
  let activePopupHtml = null

  if (activeFullPopup === 'premium-teaser') {
    activePopupHtml = <PremiumTeaser {...popupProps} />
  }

  return (
    <div className={popupClasses} onClick={handleOutsideClick}>
      <div className='vcv-layout-popup-container'>
        {activePopupHtml}
      </div>
    </div>
  )
}

const mapStateToProps = (state) => ({
  activeFullPopup: state.editorPopup.activeFullPopup,
  fullScreenPopupData: state.editorPopup.fullScreenPopupData
})

const mapDispatchToProps = (dispatch) => ({
  activeFullPopupSet: (data) => dispatch(activeFullPopupSet(data))
})

export default connect(mapStateToProps, mapDispatchToProps)(FullPagePopupContainer)
