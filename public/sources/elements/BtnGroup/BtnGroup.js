var React = require('react');
require('./BtnGroup.less');
var BtnGroup = React.createClass({
  render: function() {
    var {key, content, editor, ...other} = this.props;
    return (<div className="vc-btn-group" key={key} {...other} {...editor}>
      {content}
    </div>);
  }
});
module.exports = BtnGroup;