import React from 'react';
import Attribute from '../attribute';

export default class Component extends Attribute {
  render() {
    return (
      <textarea
        className="vc_ui-form-input"
        onChange={this.handleChange}
        ref={this.props.name + 'Component'}
        value={this.state.value}/>
    );
  }
}
