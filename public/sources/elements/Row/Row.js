var React = require('react');
require('./Row.less');
var Row = React.createClass({
    render: function() {
        var { key, content, ...other } = this.props;
        return (<div className="vc-row" key={key} {...other}>
            {content}
        </div>);
    }
});
module.exports = Row;