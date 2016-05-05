import React from 'react';

export default class StringComponent extends React.Component {
  render() {
    var {fieldKey, settings, value} = this.props;
    return (
      <div className="vc_ui-form-group">
        <label className="vc_ui-form-group-heading">{fieldKey}</label>
        <input
          className="vc_ui-form-input"
          type="text"
          ref={fieldKey + 'Component'}
          value={value}/>
      </div>);
  }
}
