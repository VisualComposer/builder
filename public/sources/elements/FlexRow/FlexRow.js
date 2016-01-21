var React = require('react');
require('./FlexRow.less');
var Row = React.createClass({
    render: function() {
        var { key, content, editor, ...other } = this.props;
        return (<div className="vc-flex-row" key={key} {...editor}>
            {content}
        </div>);
    }
});
module.exports = Row;