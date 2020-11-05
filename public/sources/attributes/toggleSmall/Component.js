import React from 'react'
import Toggle from '../toggle/Component'
import Tooltip from '../../../components/tooltip/tooltip'
import vcCake from 'vc-cake'
const dataManager = vcCake.getService('dataManager')

class ToggleSmall extends Toggle {
  static defaultProps = {
    fieldType: 'toggleSmall'
  }

  render () {
    const { fieldKey, options, elementAccessPoint } = this.props
    const checked = (this.state.value) ? 'checked' : ''
    const localizations = dataManager.get('localizations')
    const useTheToggleToSwitchBetweenLightAndDarkBackground = localizations ? localizations.useTheToggleToSwitchBetweenLightAndDarkBackground : 'Use the toggle to switch between light and dark background while editing the text.'
    let label = null
    let fieldId = `${fieldKey}_input`
    if (elementAccessPoint && elementAccessPoint.id) {
      fieldId += `_${elementAccessPoint.id}`
    }
    if (options && options.labelText) {
      label = (
        <label htmlFor={fieldId} className='vcv-ui-form-switch-small-trigger-label'>{this.props.options.labelText}</label>
      )
    }
    return (
      <div className='vcv-ui-form-switch-small-container'>
        <Tooltip>
          {useTheToggleToSwitchBetweenLightAndDarkBackground}
        </Tooltip>
        <label className='vcv-ui-form-switch-small'>
          <input type='checkbox' onChange={this.handleChange} id={fieldId} checked={checked} />
          <span className='vcv-ui-form-switch-small-indicator' />
        </label>
        {label}
      </div>
    )
  }
}

export default ToggleSmall
