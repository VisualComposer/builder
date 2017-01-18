import React from 'react'
import Attribute from '../attribute'

class StringAttribute extends Attribute {
  render () {
    let { value } = this.state
    let { placeholder } = this.props
    return (
      <input
        className='vcv-ui-form-input'
        type='text'
        onChange={this.handleChange}
        placeholder={placeholder}
        value={value} />
    )
  }
}

export default StringAttribute
