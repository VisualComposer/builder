var React = require('react');
var Button = React.createClass({
    render: function() {
        var { key, content, ...other } = this.props;
        return (<button className="vc-button-block" key={key} {...other}>Button</button>);
    }
});
module.exports = Button;