import React from 'react'
import { getService } from 'vc-cake'
import classNames from 'classnames'
const dataManager = getService('dataManager')

const EditFormSettings = ({ isRootElement, handleNameChange, nameValue, showSpinner, tabTitle }) => {
  const localizations = dataManager.get('localizations')
  const presetsHelperText = localizations ? localizations.presetsHelperText : 'Change the default parameters to create a unique element. The new element will be added to your library.'
  const templateHelperText = localizations ? localizations.templateHelperText : 'Change the default parameters of the section to save it as a unique block template. The new block template will be added to your library.'
  const saveAsPreset = localizations ? localizations.saveAsPreset : 'Save as a Preset'
  const saveAsTemplate = localizations ? localizations.saveAsBlock : 'Save as a Block'
  const presetPlaceholderText = localizations.enterPresetName || 'Enter preset name'
  const bloksPlaceholderText = localizations.enterBlocksName || 'Enter block\'s name'
  const enterPresetNameText = isRootElement ? bloksPlaceholderText : presetPlaceholderText
  const buttonText = isRootElement ? saveAsTemplate : saveAsPreset

  const buttonClasses = classNames({
    'vcv-ui-form-button': true,
    'vcv-ui-form-button--action': true,
    'vcv-ui-form-button--loading': !!showSpinner
  })

  return (
    <div className='vcv-ui-presets-form'>
      <h2 className='vcv-ui-section-heading'>{tabTitle}</h2>
      <p className='vcv-ui-section-description'>{isRootElement ? templateHelperText : presetsHelperText}</p>
      <div className='vcv-ui-form-input-group'>
        <input
          className='vcv-ui-form-input vcv-ui-editor-save-preset-field'
          type='text'
          onChange={handleNameChange}
          value={nameValue}
          disabled={!!showSpinner}
          placeholder={enterPresetNameText}
        />
        <button className={buttonClasses} disabled={!!showSpinner}>
          {buttonText}
        </button>
      </div>
    </div>
  )
}

export default EditFormSettings
