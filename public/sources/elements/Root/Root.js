var React = require('react');
var Section = React.createClass({
    render: function() {
        var { key, content, ...other } = this.props;
        return (<div className="vc-v-root-element" key={key} {...other}>{content}</div>);
    }
});
module.exports = Section;