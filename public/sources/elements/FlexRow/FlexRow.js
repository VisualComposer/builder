var React = require('react');
require('./FlexRow.less');
var Row = React.createClass({
    render: function() {
        var { key, content, ...other } = this.props;
        return (<div className="vc-flex-row" key={key} {...other}>
            {content}
        </div>);
    }
});
module.exports = Row;