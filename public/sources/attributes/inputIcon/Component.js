import React from 'react'
import Attribute from '../attribute'

class InputIcon extends Attribute {
  static defaultProps = {
    fieldType: 'inputIcon'
  }

  render () {
    const { value } = this.state
    const { placeholder, options } = this.props
    const { min, max } = options
    const iconClasses = 'vcv-ui-form-dropdown vcv-ui-form-icon ' + options.iconClasses

    return (
      <div className='vcv-ui-form-input-icon'>
        <div className='vcv-ui-form-input-group'>
          <div className={iconClasses} />
          <input
            className='vcv-ui-form-input'
            type={options.inputType}
            min={min}
            max={max}
            onChange={this.handleChange}
            placeholder={placeholder}
            value={value}
          />
        </div>
      </div>
    )
  }
}

export default InputIcon
