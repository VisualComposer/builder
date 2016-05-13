import React from 'react';
import Attribute from '../attribute';
export default class Component extends Attribute {
  handleChange(event) {
    var value = event.target.checked;
    this.setFieldValue(value);
  }

  render() {
    let {fieldKey} = this.props;
    let checked = (this.state.value) ? 'checked' : '';
    return (<label key={fieldKey} className="vc_ui-form-switch">
      <input type='checkbox' onChange={this.handleChange} checked={checked}/>
      <span className="vc_ui-form-switch-indicator"></span>
      <span className="vc_ui-form-switch-label" data-vc-switch-on="on"></span>
      <span className="vc_ui-form-switch-label" data-vc-switch-off="off"></span>
    </label>);
  }
}
