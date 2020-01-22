import React from 'react'
import Toggle from '../toggle/Component'

class ToggleSmall extends Toggle {
  static defaultProps = {
    fieldType: 'toggleSmall'
  }

  render () {
    const { fieldKey, options } = this.props
    const checked = (this.state.value) ? 'checked' : ''
    let label = null
    const fieldId = `${fieldKey}_input`
    if (options && options.labelText) {
      label = (
        <label htmlFor={fieldId} className='vcv-ui-form-switch-small-trigger-label'>{this.props.options.labelText}</label>
      )
    }
    return (
      <div className='vcv-ui-form-switch-small-container'>
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
