import React from 'react'
import Attribute from '../attribute'

class StringAttribute extends Attribute {
  render () {
    let { value } = this.state
    let { min, max } = this.props.options
    return (
      <input
        className='vcv-ui-form-input'
        type='number'
        onChange={this.handleChange}
        min={min}
        max={max}
        value={value} />
    )
  }
}

export default StringAttribute
