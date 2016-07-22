/*eslint jsx-quotes: [2, "prefer-double"]*/
import React from 'react'
import Attribute from '../attribute'
export default class Component extends Attribute {
  handleChange (event) {
    var value = event.target.checked
    this.setFieldValue(value)
  }

  componentWillReceiveProps (nextProps) {
    this.setState({ value: nextProps.value })
  }

  render () {
    let checked = (this.state.value) ? 'checked' : ''
    return (<label className="vcv-ui-form-switch">
      <input type="checkbox" onChange={this.handleChange} checked={checked} />
      <span className="vcv-ui-form-switch-indicator" />
      <span className="vcv-ui-form-switch-label" data-vc-switch-on="on" />
      <span className="vcv-ui-form-switch-label" data-vc-switch-off="off" />
    </label>)
  }
}
