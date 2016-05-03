var React = require('react');
require('./Paragraph.less');
var Paragraph = React.createClass({
  render: function() {
    var {key, content, editor, ...other} = this.props;
    return (<div className="vc-text-block" key={key} {...editor}>
      {content}
    </div>);
  }
});
module.exports = Paragraph;