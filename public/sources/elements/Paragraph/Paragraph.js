var React = require('react');
var Paragraph = React.createClass({
    render: function() {
        var { key, content, controls, ...other } = this.props;
        return (<p className="vc-text-block" key={key} {...other}>
            {content}{controls || ''}
        </p>);
    }
});
module.exports = Paragraph;