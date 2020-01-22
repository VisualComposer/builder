import React from 'react'
import Attribute from '../attribute'

export default class NumberAttribute extends Attribute {
  static defaultProps = {
    fieldType: 'number'
  }

  render () {
    const { value } = this.state
    const { min, max } = this.props.options
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
        value={value}
      />
    )
  }
}
