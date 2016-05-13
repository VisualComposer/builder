import React from 'react';
import Attribute from '../attribute';
require('./media-editor');
export default class Component extends Attribute {
  openLibrary() {
    alert(1);
  }
  componentWillMount() {
    // require('./media-editor');
  }
  render() {
    let {value} = this.state;
    let style = {

    };
    return (
      <div className="vcv-attach-image">
          <input
            className="vc_ui-form-input"
            type="hidden"
            onChange={this.handleChange}
            defaultValue={value}/>
          <a onClick={this.openLibrary.bind(this)}>
            <i className="vc-ui-icon vc-ui-icon-add"/>
          </a>
      </div>

    );
  }
}
