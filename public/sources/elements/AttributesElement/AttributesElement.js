var React = require('react');
var Validation = React.createClass({
    render: function() {
        var { key, content, textfield, textarea, select, string, ...other } = this.props;
        return (<div className="vc-text-element" key={key} {...other}>
			<p>TextField value: {textfield}</p>
			<p>TextArea value: {textarea}</p>
			<p>Select value: {select}</p>
			<p>String value: {string}</p>
        </div>);
    }
});
module.exports = Validation;