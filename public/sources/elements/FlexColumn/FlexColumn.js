var React = require('react');
require('./FlexColumn.less');
var Column = React.createClass({
    render: function() {
        var { key, content, ...other } = this.props;
        return (<div className="vc-flex-column" key={key} {...other}>
            {content}
        </div>);
    }
});
module.exports = Column;