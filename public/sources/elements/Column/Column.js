var React = require('react');
require('./Column.less');
var Column = React.createClass({
    render: function() {
        var { key, content, ...other } = this.props;
        return (<div className="vc-column" key={key} {...other}>
            {content}
        </div>);
    }
});
module.exports = Column;