import React, { useState } from 'react'
import PopupInner from '../popupInner'
import { getService } from 'vc-cake'
import { PopupProps, CustomButtonProps } from '../types'

const dataManager = getService('dataManager')
const dataProcessor = getService('dataProcessor')
const localizations = dataManager.get('localizations')
const headingText = localizations ? localizations.dataCollectionHeadingText : 'Share Usage Data'
const text = localizations ? localizations.dataCollectionText : 'Help to make Visual Composer better by sharing anonymous usage data. We appreciate your help.'
const readMoreText = localizations ? localizations.readMoreText : 'Read more'
const dashboardUrl = `${window.vcvSettingsDashboardUrl}#vcv-ui-settings-data-collection-table`
const confirmText = localizations ? localizations.dataCollectionToggleText : 'Share anonymous data'

const DataCollectionPopup = ({ onClose, onPrimaryButtonClick }: PopupProps) => {
  const [isChecked, setIsChecked] = useState<boolean>(false)

  const handleChange = (): void => {
    setIsChecked(!isChecked)
  }

  const handlePrimaryButtonClick = (): void => {
    const checkedInput = document.querySelector('#vcv-layout-popup-data-collection:checked')
    if (!checkedInput) {
      return
    }
    dataProcessor.appAdminServerRequest({
      'vcv-action': 'dataCollection:submit:adminNonce',
      'vcv-dataCollection': true
    })

    dataManager.set('dataCollectionEnabled', true)

    onPrimaryButtonClick()
  }

  const handleCloseClick = (): void => {
    dataProcessor.appAdminServerRequest({
      'vcv-action': 'dataCollection:submit:adminNonce',
      'vcv-dataCollection': false
    })

    onClose()
  }

  const customButtonProps: CustomButtonProps<boolean> = {
    disabled: !isChecked
  }

  return (
    <PopupInner
      headingText={headingText}
      popupName='dataCollectionPopup'
      customButtonProps={customButtonProps}
      customButtonTag='button'
      onPrimaryButtonClick={handlePrimaryButtonClick}
      onClose={handleCloseClick}
    >
      <p className='vcv-layout-popup-text'>{text} <a className='vcv-layout-popup-text--anchor' target='_blank' rel='noopener noreferrer' href={dashboardUrl}>{readMoreText}</a></p>
      <div className='vcv-layout-popup-checkbox-option-wrapper'>
        <input
          type='checkbox'
          id='vcv-layout-popup-data-collection'
          className='vcv-layout-popup-checkbox'
          name='vcv-data-collection'
          checked={isChecked}
          onChange={handleChange}
        />
        <label htmlFor='vcv-layout-popup-data-collection' className='vcv-layout-popup-checkbox-label'>
          {confirmText}
        </label>
      </div>
    </PopupInner>
  )
}

export default DataCollectionPopup
