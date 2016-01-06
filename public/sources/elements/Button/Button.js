var React = require('react');
var Button = React.createClass({
    render: function() {
        var { key, content, ...other } = this.props;
        return (<button type="button" className="vc-button-block" key={key} {...other}>{content}</button>);
    }
});
module.exports = Button;