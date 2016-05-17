/*eslint jsx-quotes: ["error", "prefer-double"]*/
import React from 'react'
import Attribute from '../attribute'
export default class Component extends Attribute {
  handleChange (event) {
    var value = event.target.checked
    this.setFieldValue(value)
  }

  render () {
    let checked = (this.state.value) ? 'checked' : ''
    return (<label className="vc_ui-form-switch">
      <input type="checkbox" onChange={this.handleChange} checked={checked} />
      <span className="vc_ui-form-switch-indicator" />
      <span className="vc_ui-form-switch-label" data-vc-switch-on="on" />
      <span className="vc_ui-form-switch-label" data-vc-switch-off="off" />
    </label>)
  }
}
