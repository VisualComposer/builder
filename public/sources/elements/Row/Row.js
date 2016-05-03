var React = require('react');
require('./editor/Row.less');
var Row = React.createClass({
  render: function() {
    var {key, content, editor, ...other} = this.props;
    return (<div className="vc-v-row clearfix" key={key} {...editor}>
      {content}
    </div>);
  }
});
module.exports = Row;