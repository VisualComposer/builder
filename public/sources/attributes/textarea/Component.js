import React from 'react';

export default class Component extends React.Component {
  render() {
    console.log({renderTextAreaAttribute: this.props});

    return (
      <div className="vc_ui-form-group">
        <label className="vc_ui-form-group-heading">{this.props.settings.getTitle()}</label>
        <textarea
          className="vc_ui-form-input"
          onChange={this.handleChange}
          ref={this.props.name + 'Component'}
          value={this.state.value}/>
      </div>);
  }
}
