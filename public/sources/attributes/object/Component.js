import React from 'react'
import Attribute from '../attribute'

export default class Component extends Attribute {
  render () {
    let { value } = this.state
    return (
      <input
        className='vcv-ui-form-input'
        type='text'
        onChange={this.handleChange}
        value={value} />
    )
  }
}
