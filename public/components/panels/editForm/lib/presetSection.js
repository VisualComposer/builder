import React from 'react'

const PresetSection = () => {
  const localizations = window.VCV_I18N && window.VCV_I18N()
  const presetsHelperText = localizations ? localizations.presetsHelperText : 'Create an element with your chosen parameters. The new element will be added to your Add Element panel.'
  const presetsButtonText = localizations ? localizations.presetsButtonText : 'Save as Preset'

  return (
    <div className='vcv-ui-presets-form'>
      <p className='vcv-ui-form-helper'>{presetsHelperText}</p>
      <div className='vcv-ui-form-input-group'>
        <input className='vcv-ui-form-input' type='text' />
        <button className='vcv-ui-form-button vcv-ui-form-button--action'>{presetsButtonText}</button>
      </div>
    </div>
  )
}

export default PresetSection
