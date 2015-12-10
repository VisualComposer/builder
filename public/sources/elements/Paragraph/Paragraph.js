var React = require('react');
var Paragraph = React.createClass({
    render: function() {
        var { key, content, ...other } = this.props;
        return (<p className="vc-text-block" key={key} {...other}>
            Hello my name is Boris and I know ninja rules very well. Hide away.
        </p>);
    }
});
module.exports = Paragraph;