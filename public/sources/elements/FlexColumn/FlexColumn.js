var React = require('react');
require('./FlexColumn.less');
var Column = React.createClass({
  render: function() {
    var {key, content, ...editor} = this.props;
    return (<div className="vc-flex-column" key={key} {...editor}>
      {content}
    </div>);
  }
});
module.exports = Column;