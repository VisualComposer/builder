import React from 'react';
import Attribute from '../attribute';

export default class Component extends Attribute {
  render() {
    let {fieldKey, settings} = this.props;
    let {value} = this.state;
    return (
      <input
        className="vc_ui-form-input"
        type="text"
        onChange={this.handleChange}
        defaultValue={value}/>
    );
  }
}
