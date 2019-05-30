import React from 'react'
import Attribute from '../attribute'

export default class ObjectComponent extends Attribute {
  static defaultProps = {
    fieldType: 'object'
  }

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
