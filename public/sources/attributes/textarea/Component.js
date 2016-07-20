/*eslint jsx-quotes: [2, "prefer-double"]*/
import React from 'react'
import Attribute from '../attribute'

export default class Component extends Attribute {
  render () {
    let {value} = this.state
    return (
      <textarea
        className="vcv-ui-form-input"
        onChange={this.handleChange}
        value={value} />
    )
  }
}
