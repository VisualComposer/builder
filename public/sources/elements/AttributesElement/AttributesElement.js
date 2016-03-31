var React = require('react');
var Validation = React.createClass({
  render: function() {
    var {key, content, textarea, select, string, editor, ...other} = this.props;
    return (<div className="vc-text-element" key={key} {...editor}>
      <p>TextArea value: {textarea}</p>
      <p>Select value: {select}</p>
      <p>String value: {string}</p>
    </div>);
  }
});
module.exports = Validation;