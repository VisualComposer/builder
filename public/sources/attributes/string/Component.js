import React from 'react';
import Attribute from '../attribute';

export default class Component extends Attribute {
  render() {
    var {fieldKey, settings, value} = this.props;
    return (
      <div className="vc_ui-form-group">
        <label className="vc_ui-form-group-heading">{fieldKey}</label>
        <input
          className="vc_ui-form-input"
          type="text"
          ref={fieldKey + 'Component'}
          onChange={this.handleChange.bind(this)}
          defaultValue={value}/>
      </div>);
  }
}
