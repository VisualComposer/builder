var React = require('react');
require('./editor/Column.less');
var Column = React.createClass({
    render: function() {
        var { key, content, ...other } = this.props;
        return (<div className="vc-v-column" key={key} {...other}>
            {content}
        </div>);
    }
});
module.exports = Column;