var React = require('react');
var Paragraph = React.createClass({
    render: function() {
        return (<p className="vc-text-block" key={this.props.key}>
            Hello my name is Boris and I know ninja rules very well. Hide away.
        </p>);
    }
});
module.exports = Paragraph;