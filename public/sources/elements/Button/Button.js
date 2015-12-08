var React = require('react');
var Button = React.createClass({
    render: function() {
        return (<button className="vc-button-block" key={this.props.key}>Button</button>);
    }
});
module.exports = Button;