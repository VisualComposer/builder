import React from 'react'
import Attribute from '../attribute'

export default class TextareaComponent extends Attribute {
  static defaultProps = {
    fieldType: 'textarea'
  }

  render () {
    const { value } = this.state
    return (
      <textarea
        className='vcv-ui-form-input'
        onChange={this.handleChange}
        value={value}
      />
    )
  }
}
