import React from 'react';
import Attribute from '../attribute';

export default class Component extends Attribute {
  render() {
    // TODO: Fix title.
    let {fieldKey, settings} = this.props;
    let {value} = this.state;
    return (
      <div className="vc_ui-form-group">
        <label className="vc_ui-form-group-heading">{fieldKey}</label>
        <input
          className="vc_ui-form-input"
          type="color"
          onChange={this.handleChange}
          defaultValue={value}/>
      </div>);
  }
}
