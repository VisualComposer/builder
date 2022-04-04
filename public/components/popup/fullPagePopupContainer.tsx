import React from 'react'
import classNames from 'classnames'
import { getService } from 'vc-cake'
import PremiumTeaser from '../../components/premiumTeasers/component'
import { connect } from 'react-redux'
import { activeFullPopupSet } from '../../editor/stores/editorPopup/slice'
import { AppStateType } from "../../editor/stores/reducer"
import { Dispatch } from 'redux'

const dataManager = getService('dataManager')

type Props = {
    activeFullPopupSet: (activeFullPopup:string | boolean) => void,
    fullScreenPopupData: any
    activeFullPopup: string
}

const FullPagePopupContainer: React.FC<Props> = ({ activeFullPopupSet, fullScreenPopupData, activeFullPopup }) => {
  const handleCloseClick = () => {
    window.setTimeout(() => {
      activeFullPopupSet(false)
    }, 350)
  }

  const handlePrimaryButtonClick = () => {
    const popupData = fullScreenPopupData || {}
    popupData.primaryButtonClick && popupData.primaryButtonClick()
  }

  const handleOutsideClick = (event: React.MouseEvent) => {
      const target = event.target as HTMLDivElement
      if (target.classList?.contains('vcv-layout-popup--full-page')) {
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

const mapStateToProps = (state: AppStateType) => ({
  activeFullPopup: state.editorPopup.activeFullPopup,
  fullScreenPopupData: state.editorPopup.fullScreenPopupData
})

const mapDispatchToProps = (dispatch:Dispatch) => ({
  activeFullPopupSet: (data:any) => dispatch(activeFullPopupSet(data))
})

export default connect(mapStateToProps, mapDispatchToProps)(FullPagePopupContainer)
