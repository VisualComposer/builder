import React from 'react';

export class Component extends React.Component {
  render() {
    console.log('render string', this.props);
    var {settings, name} = this.props;
    var {value} = this.state;
    return (
      <div className="vc_ui-form-group">
        <label className="vc_ui-form-group-heading">{settings.getTitle()}</label>
        <input
          className="vc_ui-form-input"
          type="text"
          onChange={this.handleChange}
          ref={name + 'Component'}
          value={value}/>
      </div>);
  }
}
