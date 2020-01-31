import React from 'react'

const PresetSection = () => (
  <div className='vcv-ui-presets-form'>
    <p className='vcv-ui-form-helper'>
      Create an element with your chosen parameters. The new element will be added to your Add Element panel.
    </p>
    <div className='vcv-ui-form-input-group'>
      <input className='vcv-ui-form-input' type='text' />
      <button className='vcv-ui-form-button vcv-ui-form-button--action'>Save as Preset</button>
    </div>
  </div>
)

export default PresetSection
