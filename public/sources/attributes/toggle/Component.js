import React from 'react';
import Attribute from '../attribute';
export default class Component extends Attribute {
  handleChange(event) {
    if (!event.target.checked) {
      event.target.value = '';
    }
    super.handleChange(event);
  }

  render() {
    let {fieldKey} = this.props;
    let checked = (!!this.state.value) ? 'checked' : '';
    return (<label key={fieldKey} className="vc_ui-form-switch">
      <input type='checkbox' onChange={this.handleChange} checked={checked} value={this.props.options.value}/>
      <span className="vc_ui-form-switch-indicator"></span>
      <span className="vc_ui-form-switch-label" data-vc-switch-on="on"></span>
      <span className="vc_ui-form-switch-label" data-vc-switch-off="off"></span>
    </label>);
  }
}
