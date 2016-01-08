var React = require('react');
var CallToAction = React.createClass({
    render: function() {
        var { key, content, ...other } = this.props;
        return (<div className="vc-cta-block" key={key} {...other}>{content}</div>);
    }
});
module.exports = CallToAction;