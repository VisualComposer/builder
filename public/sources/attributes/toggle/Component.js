import React from 'react'
import Attribute from '../attribute'
import PropTypes from 'prop-types'

class Toggle extends Attribute {
  static defaultProps = {
    fieldType: 'toggle'
  }

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
      label = (
        <label htmlFor={fieldId} className='vcv-ui-form-switch-trigger-label'>{this.props.options.labelText}</label>
      )
    }
    return (
      <div className='vcv-ui-form-switch-container'>
        <label className='vcv-ui-form-switch'>
          <input type='checkbox' onChange={this.handleChange} id={fieldId} checked={checked} />
          <span className='vcv-ui-form-switch-indicator' />
          <span className='vcv-ui-form-switch-label' data-vc-switch-on='on' />
          <span className='vcv-ui-form-switch-label' data-vc-switch-off='off' />
        </label>
        {label}
      </div>
    )
  }
}

Toggle.propTypes = {
  value: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string
  ]).isRequired,
  fieldKey: PropTypes.string.isRequired
}

export default Toggle
