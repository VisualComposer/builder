import React from 'react';

module.exports = React.createClass({
  render() {
    console.log('render string', this.props);
    return (
      <div className="vc_ui-form-group">
        <label className="vc_ui-form-group-heading">{this.props.settings.getTitle()}</label>
        <input
          className="vc_ui-form-input"
          type="text"
          onChange={this.handleChange}
          ref={this.props.name + 'Component'}
          value={this.state.value}/>
      </div>);
  }
});
