var React = require('react');
var Button = React.createClass({
    render: function() {
        var { key, content, controls, ...other } = this.props;
        return (<button className="vc-button-block" key={key} {...other}>{content ? 'Button' : ''}{controls || ''}</button>);
    }
});
module.exports = Button;