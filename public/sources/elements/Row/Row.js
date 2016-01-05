var React = require('react');
require('./editor/Row.less');
var Row = React.createClass({
    render: function() {
        var { key, content, ...other } = this.props;
        return (<div className="vc-v-row" key={key} {...other}>
            {content}
        </div>);
    }
});
module.exports = Row;