import React from 'react'

const EditFormSettings = ({ isRootElement, handleNameChange, nameValue, showSpinner }) => {
  const localizations = window.VCV_I18N && window.VCV_I18N()
  const presetsHelperText = localizations ? localizations.presetsHelperText : 'Change default parameters to create a unique element. The new element will be added to the Element Library.'
  const templateHelperText = localizations ? localizations.templateHelperText : 'Change the default parameters of sections and their content to create a unique block template. The new block template will be added to your library.'
  const saveAsPreset = localizations ? localizations.saveAsPreset : 'Save as a Preset'
  const saveAsTemplate = localizations ? localizations.saveAsTemplate : 'Save as a Template'
  const buttonText = isRootElement ? saveAsTemplate : saveAsPreset

  return (
    <div className='vcv-ui-presets-form'>
      <p className='vcv-ui-form-helper'>{isRootElement ? templateHelperText : presetsHelperText}</p>
      <div className='vcv-ui-form-input-group'>
        <input
          className='vcv-ui-form-input'
          type='text'
          onChange={handleNameChange}
          value={nameValue}
          disabled={!!showSpinner}
        />
        <button className='vcv-ui-form-button vcv-ui-form-button--action' disabled={!!showSpinner}>
          {buttonText}
        </button>
      </div>
    </div>
  )
}

export default EditFormSettings
