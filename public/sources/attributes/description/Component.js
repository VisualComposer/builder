import React from 'react'
import Attribute from '../attribute'

export default class DescriptionAttribute extends Attribute {
  static defaultProps = {
    fieldType: 'description'
  }

  render () {
    const value = this.state.value === false ? '' : this.state.value
    return <p className='vcv-ui-form-helper'>{value}</p>
  }
}
