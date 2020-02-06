import React from 'react'

const EditFormSettings = ({ isRootElement, handleNameChange, nameValue, showSpinner }) => {
  const localizations = window.VCV_I18N && window.VCV_I18N()
  const presetsHelperText = localizations ? localizations.presetsHelperText : 'Create an element with your chosen parameters. The new element will be added to your Add Element panel.'
  const templateHelperText = localizations ? localizations.templateHelperText : 'Create a template with your chosen parameters. The new template will be added to your Add Template panel.'
  const saveAsPreset = localizations ? localizations.saveAsPreset : 'Save as Preset'
  const saveAsTemplate = localizations ? localizations.saveAsTemplate : 'Save as Template'
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
