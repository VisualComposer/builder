var React = require('react');
var Validation = React.createClass({
    render: function() {
        var { key, content, editor, ...other } = this.props;
        return (<div className="vc-text-validation" key={key} {...editor}>
            Use edit form and console to check validation
        </div>);
    }
});
module.exports = Validation;