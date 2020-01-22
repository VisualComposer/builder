import React from 'react'
import Attribute from '../attribute'

class customIdAttribute extends Attribute {
  static defaultProps = {
    fieldType: 'customId'
  }

  render () {
    const value = this.state.value === false ? '' : this.state.value
    return (
      <input
        className='vcv-ui-form-input'
        type='text'
        onChange={this.handleChange}
        value={value}
      />
    )
  }
}

export default customIdAttribute
