var React = require('react');
var Button = React.createClass({
    render: function() {
        var { key, content, test, ...other } = this.props;
        return (<button className="vc-button-block " data-vc-test={test} key={key} {...other}>{content}</button>);
    }
});
module.exports = Button;