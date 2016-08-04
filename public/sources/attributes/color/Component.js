import React from 'react'
import Attribute from '../attribute'

export default class Color extends Attribute {
  render () {
    let { value } = this.state
    return (
      <input
        className='vcv-ui-form-input-color'
        type='color'
        onChange={this.handleChange}
        defaultValue={value} />
    )
  }
}
