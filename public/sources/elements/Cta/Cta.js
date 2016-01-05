var React = require('react');
var Button = require('./../Button/Button.js');
var Paragraph = require('./../Paragraph/Paragraph.js');
var Header = require('./../Header/Header.js');
var CTA = React.createClass({
    render: function() {
        var { key, content, ...other } = this.props;
        return (<div className="vc-cta-block" key={key} {...other}><Button/><Paragraph/><Header/>{content}</div>);
    }
});
module.exports = CTA;