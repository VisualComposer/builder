var React = require('react');
var ParamMixin = require('../param-mixin');
module.exports = React.createClass({
  mixins: [ParamMixin],
  render: function() {
    console.log('render string');
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
