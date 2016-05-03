var React = require('react');
require('./Section.less');
var Section = React.createClass({
  render: function() {
    var {key, content, editor, ...other} = this.props;
    return (<section className="vc-v-section" key={key} {...other} {...editor}>
      {content}
    </section>);
  }
});
module.exports = Section;