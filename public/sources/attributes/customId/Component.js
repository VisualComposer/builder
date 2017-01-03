import React from 'react'
import Attribute from '../attribute'

class customIdAttribute extends Attribute {
  render () {
    let value = this.state.value || this.props.element.get('id')
    return (
      <input
        className='vcv-ui-form-input'
        type='text'
        onChange={this.handleChange}
        value={value} />
    )
  }
}

export default customIdAttribute
