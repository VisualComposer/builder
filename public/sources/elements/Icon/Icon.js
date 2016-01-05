var React = require('react');
require('./Icon.less');
var Icon = React.createClass({
    render: function() {
        var { key, content, ...other } = this.props;
        return (<span className="vc-icon" key={key} {...other}>{content}</span>);
    }
});
module.exports = Icon;