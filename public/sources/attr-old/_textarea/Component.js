var React = require('react');
var ParamMixin = require('../param-mixin.js');
module.exports = React.createClass({
  mixins: [ParamMixin],
  render: function() {
    console.log('render textarea');

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
});
