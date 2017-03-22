import React from 'react'
import Attribute from '../attribute'

class StringAttribute extends Attribute {
  render () {
    let { value } = this.state
    let { min, max } = this.props.options
    let { placeholder } = this.props
    if (!placeholder && this.props.options && this.props.options.placeholder) {
      placeholder = this.props.options.placeholder
    }
    return (
      <input
        className='vcv-ui-form-input'
        type='number'
        onChange={this.handleChange}
        min={min}
        max={max}
        placeholder={placeholder}
        value={value} />
    )
  }
}

export default StringAttribute
