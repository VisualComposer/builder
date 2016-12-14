import React from 'react'
import Attribute from '../attribute'

class Toggle extends Attribute {
  handleChange (event) {
    let value = event.target.checked
    this.setFieldValue(value)
  }

  render () {
    let checked = (this.state.value) ? 'checked' : ''
    return (
      <label className='vcv-ui-form-switch'>
        <input type='checkbox' onChange={this.handleChange} checked={checked} />
        <span className='vcv-ui-form-switch-indicator' />
        <span className='vcv-ui-form-switch-label' data-vc-switch-on='on' />
        <span className='vcv-ui-form-switch-label' data-vc-switch-off='off' />
      </label>
    )
  }
}
Toggle.propTypes = {
  value: React.PropTypes.bool.isRequired,
  fieldKey: React.PropTypes.string.isRequired
}

export default Toggle
