var React = require('react');
var Header = React.createClass({
  render: function() {
    var {key, content, param_tag, editor, ...other} = this.props;
    var Tag = param_tag.toString();
    return ( <Tag className="vc-header" key={key} {...editor}>{content}</Tag>);
  }
});
module.exports = Header;