import React from 'react'
import Attribute from '../attribute'

class StringAttribute extends Attribute {
  render () {
    let { value } = this.state
    return (
      <input
        className='vcv-ui-form-input'
        type='number'
        onChange={this.handleChange}
        value={value} />
    )
  }
}

export default StringAttribute
