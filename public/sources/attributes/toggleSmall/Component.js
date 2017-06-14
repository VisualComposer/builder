import React from 'react'
import Attribute from '../attribute'

class ToggleSmall extends Attribute {
  handleChange (event) {
    let value = event.target.checked
    this.setFieldValue(value)
  }

  render () {
    let { fieldKey, options } = this.props
    let checked = (this.state.value) ? 'checked' : ''
    let label = null
    let fieldId = `${fieldKey}_input`
    if (options && options.labelText) {
      label = <label htmlFor={fieldId} className='vcv-ui-form-switch-small-trigger-label'>{this.props.options.labelText}</label>
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
ToggleSmall.propTypes = {
  value: React.PropTypes.bool.isRequired,
  fieldKey: React.PropTypes.string.isRequired
}

export default ToggleSmall
