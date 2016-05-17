/*eslint jsx-quotes: ["error", "prefer-double"]*/
import React from 'react'
import Attribute from '../attribute'

export default class Component extends Attribute {
  render () {
    let {value} = this.state
    return (
      <textarea
        className="vc_ui-form-input"
        onChange={this.handleChange}
        value={value} />
    )
  }
}
