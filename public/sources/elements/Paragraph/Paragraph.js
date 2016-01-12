var React = require('react');
require('./Paragraph.less');
var Paragraph = React.createClass({
    render: function() {
        var { key, content, ...other } = this.props;
        return (<div className="vc-text-block" key={key} {...other}>
            {content}
        </div>);
    }
});
module.exports = Paragraph;