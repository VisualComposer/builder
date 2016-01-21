var React = require('react');
require('./Heading.less');
var Heading = React.createClass({
    render: function() {
        var { key, content, editor, ...other } = this.props;
        return (<h2 className="vc-heading" key={key} {...editor}>
            {content}
        </h2>);
    }
});
module.exports = Heading;