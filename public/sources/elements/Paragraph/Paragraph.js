var React = require('react');
var Paragraph = React.createClass({
    render: function() {
        var { key, content, ...other } = this.props;
        return (<p className="vc-text-block" key={key} {...other}>
            {content}
        </p>);
    }
});
module.exports = Paragraph;